'use client'

import React, { act, useEffect, useState } from 'react'
import Image from 'next/image'
import Star from '@/assets/star.svg'
import MenuBtn from '@/assets/menuBtn.svg'
import SubmitBtn from '@/assets/submitBtn.svg'
import { getRandomPokemon, getPokemonByName, getShape, getHabitat, getGeneration } from '@/utils/pokeapi'
import Confetti from 'react-confetti'
import { calculateRank } from '@/utils/rankCalculation'
import Instructions from './Instructions'
import PurplePokeball from '@/assets/purple-pokeball.svg'

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
  const [showInstruction, setShowInstruction] = useState(true);
  const [hintCountDown, setHintCountDown] = useState(5);
  const [hintList, setHintList] = useState([]);
  const [giveUpNotice, setGiveUpNotice] = useState(false);
  const [types, setTypes] = useState([]);



  const handleHint = async () => {
    if (!targetPokemon) return;
  
    const newHintList = [...hintList];
  
    if (hintCount === 0) {
      const shape = await getShape(targetPokemon.id);
      setHintCount(1);
      newHintList.push(`The Pokemon has a ${shape} shape`);
      setHintCountDown(5);
    } else if (hintCount === 1) {
      const habitat = await getHabitat(targetPokemon.id);
      setHintCount(2);
      newHintList.push(`The Pokemon is often found in ${habitat}`);
      setHintCountDown(5);
    } else if (hintCount === 2) {
      setHintCount(3);
      setHintCountDown(5);
      if(types.length === 2) {
        newHintList.push(`The Pokemon is of ${types[0]} and ${types[1]} types`);
      } else {
        newHintList.push(`The Pokemon is of ${types[0]} type`);
      }
    } else if (hintCount === 3) {
      const generation = await getGeneration(targetPokemon.id);
      setHintCount(4);
      newHintList.push(`The Pokemon is from Generation ${generation}`);
      setHintCountDown(5);
    } else {
      setGiveUpNotice(true);
    }
  
    setHintList(newHintList);
  };
  

  const handleGiveUp = (action) => {
    if (action === 'giveUp') {
      setIsCorrect(true);
      setShowTryAnother(true);
    }
    setGiveUpNotice(false);
  }


  const mapWidth = (score) => Math.max(10, (score / 100) * 573);

  const handleGuess = (rankPercentage) => {
    const width = mapWidth(rankPercentage); // Map score to width
    let color = '';
  
    if (rankPercentage < 25) {
      color = '#BE0049'; // Red for low similarity
    } else if (rankPercentage < 50) {
      color = '#BE6200'; // Orange for moderate similarity
    } else if (rankPercentage < 75) {
      color = '#DBC200'; // Yellow for good similarity
    } else {
      color = '#00B859'; // Green for high similarity
    }
  
    setCurrentWidth(width);
    setCurrentColor(color);
  };
  

  useEffect(() => {
    const fetchRandomPokemon = async () => {
      const pokemon = await getRandomPokemon();
      setTargetPokemon(pokemon);
      console.log("Target Pokemon:", pokemon);
      
      const targetTypes = pokemon.types
      const targetTypeNames = targetTypes.map(type => type.type.name)
      setTypes(targetTypeNames)

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
    setShowInstruction(false)
    const guessedPokemon = await getPokemonByName(input)

    if (guessedPokemon) {
      setWrongPokemon(false)
      setCurrentWidth(0)
      setCurrentColor('')
      setCurrentGuess(capitalizeFirstLetter(guessedPokemon.name))

      if (hintCountDown === 0) {
        setHintCountDown(0)
      } else {
        setHintCountDown((prev) => prev - 1)
      }

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
    setCurrentWidth(0)
    setCurrentColor('')
    setHintCountDown(5)
    setHintList([])
    const pokemon = await getRandomPokemon()
    setTargetPokemon(pokemon)
    console.log("Target Pokemon:", pokemon)
    const rank = await calculateRank(pokemon, pokemon)
    setTargetRank(rank)
    console.log("Target Rank:", rank)
  }

  const getPokemonImageUrl = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`
  }


  return (
    <div className='flex sm:flex-col md:flex-row justify-between items-start'>
      
      <div className='ml-5 w-1/4 h-auto bg-transparent border-transparent border-solid border-[3px] rounded-lg flex flex-col items-center'>

      </div>

      {giveUpNotice && (
        <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50'>
          <div className='p-6 w-80 bg-[#2A1E4F] border-[#6A0DAD] border-solid border-[4px] rounded-lg flex flex-col items-center'>
            <p className='text-xl mb-4'>You've exhausted all your hints. Do you want to continue playing?</p>
            <div className='flex justify-between gap-4'>
              <button onClick={() => handleGiveUp('continue')} className='mt-8 px-4 py-2 text-base nunito-extrabold box-shadow bg-[#6A0DAD]'>Continue</button>
              <button onClick={() => handleGiveUp('giveUp')} className='mt-8 px-4 py-2 text-base nunito-extrabold box-shadow bg-[#6A0DAD]'>Give Up</button>
            </div>
          </div>
        </div>
      )}


      <div className='w-[573px] flex flex-col items-center'>
        <a href="https://github.com/aryannaik225/Evolvra" className='w-[573px] h-12 bg-[#2A1E4F] border-[#6A0DAD] border-solid border-[3px] rounded-lg flex items-center'>
          <div className='flex gap-[6px]'>
            <Image src={Star} alt='Star' className='ml-3 w-6 h-auto select-none'/>
            <p className='nunito-semibold text-base mt-1'>Love the project? Star it on GitHub!</p>
          </div>
        </a>

        <div className='w-[573px] flex justify-evenly mt-12 items-center'>
          <div></div>
          <span className='nunito-bold text-3xl'>Guess the Pokémon</span>
          <div className='flex justify-center items-center rounded-full h-8 w-8 hover:bg-[#6A0DAD40] transition-all ease-in-out cursor-pointer'>
            <Image src={MenuBtn} alt='Menu Button' width={5} height={24} className='select-none'/>
          </div>
        </div>

        <div className='mt-8 w-[573px] justify-start mb-3'>
          <div className='ml-2 flex gap-5'>
            <p className='nunito-bold text-base'>Guesses: <span className='text-xl'>{guessCount}</span></p>
            <p className='nunito-bold text-base'>Hint: <span className='text-xl'>{hintCount}</span></p>
          </div>
        </div>

        {showInstruction && (
          <Instructions />
        )}

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
              <Image src={SubmitBtn} alt='Submit Button' width={12} height={12} className='select-none'/>
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
                className="rounded-lg select-none"
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

        {/* {guesses.map((guess, index) => {
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
        })} */}




        {guesses
          .map((guess, index) => {
            let rankPercentage = ranks[index];
            let width = 0;

            // if (rankPercentage < 0) {
            //   width = 50 + rankPercentage;
            // } else if (rankPercentage === 100 && guess.name.toLowerCase() !== targetPokemon.name.toLowerCase()) {
            //   width = 563;
            // } else {
            //   width = (573 * rankPercentage) / 100;
            // }

            width = mapWidth(rankPercentage)

            return { guess, width, rankPercentage }; // Combine guess, width, and rankPercentage
          })
          .sort((a, b) => b.width - a.width) // Sort by width in descending order
          .map(({ guess, width, rankPercentage }, index) => {
            let color = '';
            if (rankPercentage < 25) {
              color = '#BE0049';
            } else if (rankPercentage < 50) {
              color = '#BE6200';
            } else if (rankPercentage < 75) {
              color = '#DBC200';
            } else {
              color = '#00B859';
            }

            console.log(
              `Guess: ${guess.name}, RankPercentage: ${rankPercentage}, Width: ${width}px`
            );

            return (
              <div
                key={index}
                className='w-[573px] mt-2 h-12 bg-transparent border-[3px] border-solid border-[#6A0DAD] rounded-lg flex items-center justify-start relative z-10 overflow-hidden'
              >
                <div
                  className='absolute inset-y-0 rounded-sm opacity-70 -z-10'
                  style={{ backgroundColor: `${color}`, width: `${width}px` }}
                />
                <p className='ml-6 nunito-semibold text-lg z-10'>
                  {capitalizeFirstLetter(guess.name)}
                </p>
              </div>
            );
          })}

      </div>

      <div className='mr-5 w-1/4 h-[501px] bg-[#2A1E4F] border-[#6A0DAD] border-solid border-[4px] rounded-lg flex flex-col items-center'>
          <div className='flex justify-between w-full mt-3'>
            <Image src={PurplePokeball} alt='*' width={26} className='ml-3 select-none'/>
            <p className='nunito-bold text-xl'>Want a hint?</p>
            <Image src={PurplePokeball} alt='*' width={26} className='mr-3 select-none'/>
          </div>
          <div className='w-full flex justify-start ml-6 mt-7'>
            <p className='nunito-bold text-base'>Countdown to your next hint: <span>{hintCountDown}</span></p>
          </div>
          <button className={`mt-8 px-[70px] py-[18px] text-base nunito-extrabold box-shadow ${hintCountDown!=0 ? 'bg-gray-600 cursor-not-allowed text-gray-900' : 'bg-[#6A0DAD] text-white'}`} disabled={hintCountDown!=0} onClick={handleHint}>
            Get Hint
          </button>
          
          <div className='w-full flex h-[309px] overflow-y-scroll flex-col items-center'>
            {hintList.map((hint, index) => {
              return (
                <div key={index} className='w-10/12 border-t-[0.5px] border-[#220139] flex-start mt-2'>
                  <p className='py-4 ml-5'>{hint}</p>
                </div>
              )
            })}
          </div>




      </div>
    </div>
  );
}

export default GamePage