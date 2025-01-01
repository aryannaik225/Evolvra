'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Star from '@/assets/star.svg'
import MenuBtn from '@/assets/menuBtn.svg'
import SubmitBtn from '@/assets/submitBtn.svg'
import { getRandomPokemon, getPokemonByName } from '@/utils/pokeapi'
import Confetti from 'react-confetti'
import { calculateRank } from '@/utils/rankCalculation'

const GamePage = () => {

  const [targetPokemon, setTargetPokemon] = useState(null);
  const [targetRank, setTargetRank] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [guessCount, setGuessCount] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [input, setInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTryAnother, setShowTryAnother] = useState(false);
  const [wrongPokemon, setWrongPokemon] = useState(false);
  const [currentGuess, setCurrentGuess] = useState(null);
  const [currentRank, setCurrentRank] = useState(null);

  const [currentWidth, setCurrentWidth] = useState(0);
  const [currentColor, setCurrentColor] = useState('');


  const handleGuess = async (r, guessChecker) => {
    let width = 0
    if (r < 0) {
      // setCurrentWidth(50 + r)
      width = 50 + r
    } else if (r === 100 && guessChecker.name.toLowerCase() != targetPokemon.name.toLowerCase()) {
      // setCurrentWidth(563)
      width = 563
    } else {
      // setCurrentWidth((573 * r) / 100)
      width = (573 * r) / 100
    }

    if (width > 0 && width < 143) {
      setCurrentColor('#D5006D')
    } else if (width > 142 && width < 286) {
      setCurrentColor('#FF7043')
    } else if (width > 285 && width < 429) {
      setCurrentColor('#FFEB3B')
    } else {
      setCurrentColor('#66BB6A')
    }

    setCurrentWidth(width)
  }

  useEffect(() => {
    const fetchRandomPokemon = async () => {
      const pokemon = await getRandomPokemon();
      setTargetPokemon(pokemon);
      console.log("Target Pokemon:", pokemon);
      const rank = await calculateRank(pokemon, pokemon)
      setTargetRank(rank)
      console.log("Target Rank:", rank)
    }
    fetchRandomPokemon()
  }, [])

  const handleInputChange = (e) => {
    setInput(e.target.value);
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const calculateRankPercentage = (currentRank, targetRank) => {
    const Percentage = (currentRank / targetRank) * 100
    return Math.round(Percentage * 100) / 100
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const guessedPokemon = await getPokemonByName(input)

    if (guessedPokemon) {
      setWrongPokemon(false)
      setCurrentWidth(0)
      setCurrentColor('')
      setCurrentGuess(capitalizeFirstLetter(guessedPokemon.name))
      let guessChecker = guessedPokemon
      console.log("Guessed Pokemon:", guessedPokemon)
      setGuesses((prev) => [...prev, guessedPokemon])
      const rank = await calculateRank(guessedPokemon, targetPokemon)
      console.log("Rank:", rank)
      setCurrentRank(rank)

      const rankPercentage = calculateRankPercentage(rank, targetRank)
      setRanks((prev) => [...prev, rankPercentage])
      console.log("Rank Percentage:", rankPercentage)

      handleGuess(rankPercentage, guessChecker)

      setGuessCount((prev) => prev + 1)

      // Check if the guessed Pokemon is the target Pokemon
      if (guessedPokemon.name.toLowerCase() === targetPokemon.name.toLowerCase()) {
        setIsCorrect(true)
        setShowConfetti(true)
        setShowTryAnother(true)
      }
      setInput('');
    } else {
      console.log('Pokemon not found!')
      setWrongPokemon(true)
    }
  }


  const handleTryAnother = async () => {
    const pokemon = await getRandomPokemon()
    setTargetPokemon(pokemon)
    console.log("Target Pokemon:", pokemon)
    const rank = await calculateRank(pokemon, pokemon)
    setTargetRank(rank)
    console.log("Target Rank:", rank)
    setGuesses([])
    setRanks([])
    setGuessCount(0)
    setHintCount(0)
    setIsCorrect(false)
    setShowConfetti(false)
    setShowTryAnother(false)
    setWrongPokemon(false)
    setCurrentGuess(null)
    setCurrentRank(null)
  }

  const getPokemonImageUrl = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`
  }


  return (
    <div className='w-full flex flex-col items-center'>
      <a href="https://github.com/aryannaik225/Evolvra" className='w-[573px] h-12 bg-[#2A1E4F] border-[#6A0DAD] border-solid border-[3px] rounded-lg flex items-center'>
        <div className='flex gap-[6px]'>
          <Image src={Star} alt='Star' className='ml-3 w-6 h-auto'/>
          <p className='nunito-semibold text-base mt-1'>Love the project? Star it on GitHub!</p>
        </div>
      </a>

      <div className='w-[573px] flex justify-evenly mt-12 items-center'>
        <div></div>
        <span className='nunito-bold text-3xl'>Guess the Pokémon</span>
        <div className='flex justify-center items-center rounded-full h-8 w-8 hover:bg-[#6A0DAD40] transition-all ease-in-out cursor-pointer'>
          <Image src={MenuBtn} alt='Menu Button' width={5} height={24} />
        </div>
      </div>

      <div className='mt-8 w-[573px] justify-start mb-3'>
        <div className='ml-2 flex gap-5'>
          <p className='nunito-bold text-base'>Guesses: <span className='text-xl'>{guessCount}</span></p>
          <p className='nunito-bold text-base'>Hint: <span className='text-xl'>{hintCount}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='w-[573px] h-16 rounded-lg bg-[#2D1D58] border-[3px] border-solid border-[#374151] flex items-center'>
          <input 
            type="text" 
            className='ml-5 bg-transparent w-[533px] placeholder:text-[#6A0DAD] nunito-bold text-xl focus:outline-none' 
            placeholder='guess a pokemon'
            spellCheck='false'
            value={input}
            onChange={handleInputChange}
          />
          <button className='flex justify-center items-center w-8 h-8 rounded-[4px] bg-[#2A1E4F] border-[#6A0DAD] border-solid border-2 mx-4 cursor-pointer lg:hidden'>
            <Image src={SubmitBtn} alt='Submit Button' width={12} height={12} />
          </button>
        </div>

        <div className='w-[573px] flex justify-center mt-2'>
          <div className='w-[563px] h-auto rounded-full'>
            <p className={`ml-2 nunito-semibold text-red-700 ${wrongPokemon ? '' : 'hidden'}`}>Oops! This Pokemon does not exist</p>
          </div>
        </div>
      </form>

      {isCorrect && (
        <div className="mt-6 text-center">
          <h2 className="nunito-bold text-2xl text-green-500">Correct!! 🎉</h2>
          <p className="nunito-semibold text-xl">You caught {capitalizeFirstLetter(targetPokemon?.name)} in {guessCount} guesses!</p>
          <div className="mt-4">
            <Image 
              src={getPokemonImageUrl(targetPokemon?.id)} 
              alt={targetPokemon?.name} 
              width={200} 
              height={200} 
              className="rounded-lg"
            />
          </div>
          {showConfetti && <Confetti />}
        </div>
      )}

      {showTryAnother && (
        <button onClick={handleTryAnother} className="mt-6 bg-[#6A0DAD] text-white px-6 py-2 rounded-lg">
          Try another Pokémon
        </button>
      )}

      

      <div className={`w-[573px] mt-2 mb-10 ${currentGuess ? '' : 'hidden'} h-12 bg-transparent border-[3px] border-solid border-[#6A0DAD] rounded-lg flex items-center justify-start relative z-10 overflow-hidden`}>
        <div className='absolute inset-y-0 rounded-sm opacity-70 -z-10' style={{ backgroundColor: `${currentColor}`, width: `${currentWidth}px`}}/>
        <p className='ml-6 nunito-semibold text-lg z-10'>{currentGuess}</p>
      </div>

      {guesses.map((guess, index) => {
        const rankPercentage = ranks[index]
        let width = 0
        if (rankPercentage < 0) {
          width = 50 + rankPercentage
        } else if (rankPercentage === 100 && guess.name.toLowerCase() != targetPokemon.name.toLowerCase()) {
          width = 563
        } else {
          width = (573 * rankPercentage) / 100
        }

        let color = ''

        if (width > 0 && width < 143) {
          color = '#D5006D'
        } else if (width > 142 && width < 286) {
          color = '#FF7043'
        } else if (width > 285 && width < 429) {
          color = '#FFEB3B'
        } else {
          color = '#66BB6A'
        }


        console.log(`Guess: ${guess.name}, CurrentRank: ${currentRank}, TargetRank: ${targetRank}, Percentage: ${rankPercentage}, Width: ${width}px`);

        return (
          <div key={index} className='w-[573px] mt-2 h-12 bg-transparent border-[3px] border-solid border-[#6A0DAD] rounded-lg flex items-center justify-start relative z-10 overflow-hidden'>
            <div className='absolute inset-y-0 rounded-sm opacity-70 -z-10' style={{ backgroundColor: `${color}`, width: `${width}px`}}/>
            <p className='ml-6 nunito-semibold text-lg z-10'>{capitalizeFirstLetter(guess.name)}</p>
          </div>
        )
      })}

    </div>
  )
}

export default GamePage