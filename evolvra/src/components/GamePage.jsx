'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Star from '@/assets/star.svg'
import MenuBtn from '@/assets/menuBtn.svg'
import SubmitBtn from '@/assets/submitBtn.svg'
import { getRandomPokemon, getPokemonByName } from '@/utils/pokeapi'
import Confetti from 'react-confetti'

const GamePage = () => {

  const [targetPokemon, setTargetPokemon] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [guessCount, setGuessCount] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [input, setInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTryAnother, setShowTryAnother] = useState(false);
  const [wrongPokemon, setWrongPokemon] = useState(false);
  const [currentGuess, setCurrentGuess] = useState(null);

  useEffect(() => {
    const fetchRandomPokemon = async () => {
      const pokemon = await getRandomPokemon();
      setTargetPokemon(pokemon);
      console.log("Target Pokemon:", pokemon);
    }
    fetchRandomPokemon()
  }, [])

  const handleInputChange = (e) => {
    setInput(e.target.value);
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const guessedPokemon = await getPokemonByName(input)

    if (guessedPokemon) {
      setWrongPokemon(false)
      setCurrentGuess(capitalizeFirstLetter(guessedPokemon.name))
      console.log("Guessed Pokemon:", guessedPokemon)
      setGuesses((prev) => [...prev, guessedPokemon])
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
    setGuesses([])
    setGuessCount(0)
    setIsCorrect(false)
    setShowConfetti(false)
    setShowTryAnother(false)
    setCurrentGuess(null)
    setWrongPokemon(false)
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

      <div className={`w-[573px] mt-2 mb-10 ${currentGuess ? '' : 'hidden'} h-12 bg-transparent border-[3px] border-solid border-[#6A0DAD] rounded-lg flex items-center justify-start`}>
        <p className='ml-6 nunito-semibold text-lg'>{currentGuess}</p>
      </div>

      {guesses.map((guess, index) => (
        <div key={index} className='w-[573px] mt-2 h-12 bg-transparent border-[3px] border-solid border-[#6A0DAD] rounded-lg flex items-center justify-start'>
          <p className='ml-6 nunito-semibold text-lg'>{capitalizeFirstLetter(guess.name)}</p>
        </div>
      ))}

    </div>
  )
}

export default GamePage