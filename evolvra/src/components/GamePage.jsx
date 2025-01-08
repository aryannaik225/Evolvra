'use client'

import React, { act, useEffect, useState } from 'react'
import Image from 'next/image'
import Star from '@/assets/star.svg'
import StarLight from '@/assets/star-light.svg'
import MenuBtn from '@/assets/menuBtn.svg'
import SubmitBtn from '@/assets/submitBtn.svg'
import { getRandomPokemon, getPokemonByName, getShape, getHabitat, getGeneration } from '@/utils/pokeapi'
import Confetti from 'react-confetti'
import { calculateRank } from '@/utils/rankCalculation'
import Instructions from './Instructions'
import PurplePokeball from '@/assets/purple-pokeball.svg'
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/utils/firebaseConfig'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const GamePage = ({ isDarkMode }) => {

  const [letsPlay, setLetsPlay] = useState(false)
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
  const [inventory, setInventory] = useState([]);
  const [calculating, setCalculating] = useState(false)
  const [calc, setCalc] = useState('')
  const [pokemonList, setPokemonList] = useState([])
  const [showInventory, setShowInventory] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const router = useRouter()

  useEffect(() => {

    const fetchPokemonList = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=386')
        const data = await response.json()
        const pokemonNames = data.results.map(pokemon => pokemon.name)
        setPokemonList(pokemonNames)
      } catch (error) {
        console.error("Error fetching pokemon list ",error)
      }
    }

    fetchPokemonList()

  }, [])


  useEffect(() => {
    let interval;
    if (calculating) {
      interval = setInterval(() => {
        setCalc((prev) => {
          if (prev.endsWith('...')) {
            return 'Calculating';
          } else {
            return prev + '.';
          }
        });
      }, 500);
    } else {
      setCalc('');
    }

    return () => clearInterval(interval);
  }, [calculating]);

  const { user, loading } = useAuth()

  const savePokemontoInventory = async (pokemonName) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid)

    try {
      await updateDoc(userRef, {
        inventory: arrayUnion(pokemonName)
      })
    } catch (e) {
      await setDoc(userRef, { inventory: [pokemonName] })
    }
  }

  useEffect(() => {
    if(loading) 
      return
    
    if (!user) {
      router.push('/login')
      return
    }

    const fetchInventory = async () => {
      const userRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(userRef)
      if (docSnap.exists()) {
        setInventory(docSnap.data().inventory || [])
      }
    }

    fetchInventory()
  }, [user, loading, router])


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


  const mapWidth = (score) => {
    const screenWidth = window.innerWidth;
    let multiplier;
  
    if (screenWidth >= 768) {
      multiplier = 573;
    } else if (screenWidth >= 640) {
      multiplier = 443;
    } else {
      multiplier = screenWidth * 0.83333333;
    }
  
    return Math.max(10, (score / 100) * multiplier);
  };

  const handleGuess = (rankPercentage) => {
    const width = mapWidth(rankPercentage);
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
      // console.log("Target Pokemon:", pokemon);
      
      const targetTypes = pokemon.types
      const targetTypeNames = targetTypes.map(type => type.type.name)
      setTypes(targetTypeNames)

      const rank = await calculateRank(pokemon, pokemon)
      setTargetRank(rank)
      // console.log("Target Rank:", rank)
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
      setCalculating(true)
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
      // console.log("Guessed Pokemon:", guessedPokemon)
      setGuesses((prev) => [...prev, guessedPokemon])
      const rank = await calculateRank(guessedPokemon, targetPokemon)
      // console.log("Rank:", rank)
      setCurrentRank(rank)

      const rankPercentage = calculateRankPercentage(rank, targetRank)
      setRanks((prev) => [...prev, rankPercentage])
      setInput('')
      setCalculating(false)
      // console.log("Rank Percentage:", rankPercentage)

      handleGuess(rankPercentage, guessChecker)

      setGuessCount((prev) => prev + 1)

      // Check if the guessed Pokemon is the target Pokemon
      if (guessedPokemon.name.toLowerCase() === targetPokemon.name.toLowerCase()) {
        setIsCorrect(true)
        setShowConfetti(true)
        setShowTryAnother(true)
        
        const pokemonName = capitalizeFirstLetter(targetPokemon.name)

        await savePokemontoInventory(pokemonName)

        setInventory((prev) => [...prev, pokemonName])
      
      }
      
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

    const targetTypes = pokemon.types
    const targetTypeNames = targetTypes.map(type => type.type.name)
    setTypes(targetTypeNames)

    // console.log("Target Pokemon:", pokemon)
    const rank = await calculateRank(pokemon, pokemon)
    setTargetRank(rank)
    // console.log("Target Rank:", rank)
  }

  const getPokemonImageUrl = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`
  }

  return (
    <>
      {!letsPlay && (
      <div className='flex justify-center items-center'>
        <div className='w-10/12 sm:w-[443px] md:w-[573px] flex flex-col items-center'>
          <a href="https://github.com/aryannaik225/Evolvra" className='md:w-[573px] sm:w-[443px] w-full h-12 dark:bg-[#2A1E4F] dark:border-[#6A0DAD] bg-[#8647B3] border-[#2A1E4F] border-solid border-[3px] rounded-lg flex items-center'>
            <div className='flex sm:gap-[6px] gap-[3px]'>
              <Image src={isDarkMode ? Star : StarLight} alt='Star' className='ml-3 w-5 sm:w-6 h-auto select-none'/>
              <p className='nunito-semibold text-sm sm:text-base mt-1'>Love the project? Star it on GitHub!</p>
            </div>
          </a>
  
          <div className='md:w-[573px] sm:w-[443px] w-full flex justify-evenly mt-12 items-center'>
            <div></div>
            <span className='nunito-bold md:text-3xl sm:text-2xl text-xl'>Guess the Pokémon</span>
            <div></div>
            {/* <div className='flex justify-center items-center rounded-full sm:h-8 sm:w-8 h-7 w-7 hover:bg-[#6A0DAD40] transition-all ease-in-out cursor-pointer'>
              <Image src={MenuBtn} alt='Menu Button' width={5} height={24} className='sm:w-[5px] w-[4px] sm:h-[24px] h-[18px] select-none'/>
            </div> */}
          </div>
        
          <div className='mt-4'>
            <Instructions setLetsPlay={setLetsPlay}/>
          </div>
        </div>
      </div>
    )}
  
    {letsPlay && (
      <div className='flex flex-col lg:flex-row justify-between gap-2 lg:items-start items-center'>
        <div className='lg:flex hidden xl:hidden'></div>
        <div className='ml-5 w-1/4 lg:w-0 xl:w-1/4 2xl:w-1/4 h-screen overflow-y-scroll overflow-x-hidden no-scrollbar bg-[#6A0DAD] dark:bg-[#2A1E4F] border-[#2A1E4F] dark:border-[#6A0DAD] border-solid border-4 dark:border-[3px] rounded-lg hidden xl:flex flex-col items-center'>
          {/*{inventory.map((pokemon, index) => (
            <div key={index}>
              <p>{pokemon}</p>
            </div>
          ))}*/}
          <div className='grid grid-cols-3 gap-4 mt-2 w-full ml-5 2xl:ml-7 mb-5 mr-2'>
            {pokemonList.map((pokemon, index) => (
              <div key={index}>
                <div className='w-24 h-28 flex flex-col items-center justify-between gap-2 bg-[#400080]'>
                  <div className='w-24 h-24 flex justify-center items-center'>
                    <Image 
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${index+1}.svg`}
                      alt={pokemon}
                      width={70}
                      height={30}
                      loading='lazy'
                      draggable='false'
                      className={`${!inventory.includes(capitalizeFirstLetter(pokemon)) ? 'silhouette' : ''} max-w-24 max-h-20`}
                    />
                  </div>
                  <p className='nunito-semibold text-sm'>{!inventory.includes(capitalizeFirstLetter(pokemon)) ? '???' : `${capitalizeFirstLetter(pokemon)}`}</p>
                </div>
              </div>
            ))}
          </div>
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


        {showInventory && (
          <div className='fixed w-screen h-screen inset-0 bg-[#000] bg-opacity-75 flex justify-center items-center z-50'>
            <div className='relative 2xl:w-1/4 xl:w-1/3 lg:w-5/12 md:w-1/2 sm:w-7/12 w-11/12 bg-[#2A1E4F] h-3/4 border-[#6A0DAD] border-solid border-[4px] rounded-lg flex flex-col items-center'>
              <div className='absolute top-4 right-4 w-8 h-8 z-50 bg-[#6A0DAD] rounded-full flex justify-center items-center cursor-pointer' onClick={() => setShowInventory(false)}>
                <p className='text-white nunito-bold'>X</p>
              </div>
              <div className='pb-5 overflow-y-scroll h-full no-scrollbar'>
                <div className='grid grid-cols-3 md:gap-6 gap-4 mt-2 w-full'>
                  {pokemonList.map((pokemon, index) => (
                    <div key={index}>
                      <div className='w-24 h-28 flex flex-col items-center justify-between gap-2 bg-[#400080]'>
                        <div className='w-24 h-24 flex justify-center items-center'>
                          <Image 
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${index+1}.svg`}
                            alt={pokemon}
                            width={70}
                            height={30}
                            loading='lazy'
                            draggable='false'
                            className={`${!inventory.includes(capitalizeFirstLetter(pokemon)) ? 'silhouette' : ''} max-w-24 max-h-20`}
                          />
                        </div>
                        <p className='nunito-semibold text-sm text-white'>{!inventory.includes(capitalizeFirstLetter(pokemon)) ? '???' : `${capitalizeFirstLetter(pokemon)}`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!showInstruction && (
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50'>
            <Instructions setLetsPlay={setShowInstruction}/>
          </div>
        )}
  
  
        <div className='w-10/12 sm:w-[443px] md:w-[573px] flex flex-col items-cent</div>er'>
          <a href="https://github.com/aryannaik225/Evolvra" className='md:w-[573px] sm:w-[443px] w-full h-12 dark:bg-[#2A1E4F] dark:border-[#6A0DAD] bg-[#8647B3] border-[#2A1E4F] border-solid border-[3px] rounded-lg flex items-center'>
            <div className='flex sm:gap-[6px] gap-[3px]'>
              <Image src={isDarkMode ? Star : StarLight} alt='Star' draggable='false' className='ml-3 w-5 sm:w-6 h-auto select-none'/>
              <p className='nunito-semibold text-sm sm:text-base mt-1'>Love the project? Star it on GitHub!</p>
            </div>
          </a>
  
          <div className='md:w-[573px] sm:w-[443px] w-full flex justify-evenly mt-12 items-center'>
            <div></div>
            <span className='nunito-bold md:text-3xl sm:text-2xl text-xl'>Guess the Pokémon</span>
            <div className='relative'>
              <div className={` flex justify-center items-center rounded-full sm:h-8 sm:w-8 h-7 w-7 hover:bg-[#6A0DAD40] ${showMenu ? 'bg-[#6A0DAD40]' : 'bg-transparent'} transition-all ease-in-out cursor-pointer z-50`} onClick={() => setShowMenu((prev) => !prev)}>
                <Image src={MenuBtn} alt='Menu Button' width={5} height={24} draggable='false' className='sm:w-[5px] w-[4px] sm:h-[24px] h-[18px] select-none'/>
              </div>
              <div className={`absolute w-[129px] h-[153px] bg-[#2A1E4F] top-0 sm:left-0 -left-14 z-10 rounded-[18px] ${showMenu ? 'flex' : 'hidden'} flex-col justify-end items-center`} onClick={(e) => e.stopPropagation()}>
                <div className={`absolute top-0 left-0 flex justify-center items-center rounded-full sm:h-8 sm:w-8 h-7 w-7 hover:bg-[#6A0DAD40] ${showMenu ? 'bg-[#6A0DAD40]' : 'bg-transparent'} transition-all ease-in-out cursor-pointer z-50`} onClick={() => setShowMenu((prev) => !prev)}>
                  <Image src={MenuBtn} alt='Menu Button' width={5} height={24} draggable='false' className='sm:w-[5px] w-[4px] sm:h-[24px] h-[18px] select-none sm:block hidden'/>
                  <p className='nunito-semibold text-white text-xs block sm:hidden select-none'>X</p>
                </div>
                <div className='mb-2 w-3/4 h-[0.5px] bg-white'/>
                <div className='mb-2'>
                  <button onClick={() => {setShowInventory(true); setShowMenu(false)}} className='text-white nunito-bold text-sm' aria-label='Open Inventory'>Inventory</button>
                </div>
                <div className='mb-2 w-3/4 h-[0.5px] bg-white'/>
                <div className='mb-2'>
                  <button onClick={() => {setShowInstruction(false); setShowMenu(false)}} className='text-white nunito-bold text-sm'>How to Play?</button>
                </div>
                <div className='mb-6 w-3/4 h-[0.5px] bg-white'/>
              </div>
            </div>
          </div>
  
          <div className='mt-8 md:w-[573px] sm:w-[433px] w-full justify-start mb-3'>
            <div className='sm:ml-2 ml-1 flex gap-5'>
              <p className='nunito-semibold md:nunito-bold text-base'>Guesses: <span className='nunito-bold text-lg sm:text-xl'>{guessCount}</span></p>
              <p className='nunito-semibold md:nunito-bold text-base'>Hint: <span className='nunito-bold text-lg sm:text-xl'>{hintCount}</span></p>
              <p className={`sm:ml-2 -ml-2 nunito-semibold text-nowrap ${calculating ? '' : 'hidden'}`}>Calculating{calc}</p>
            </div>
          </div>
  
          <form onSubmit={handleSubmit}>
            <div className={`-z-10 md:w-[573px] sm:w-[443px] w-full h-16 rounded-lg dark:bg-[#2D1D58] bg-[#7334A1] border-[3px] border-solid dark:border-[#374151] border-[#15234B] flex items-center`}>
              <input 
                type="text" 
                className='ml-5 bg-transparent md:w-[533px] sm:w-[423px] w-10/12 dark:placeholder:text-[#6A0DAD] placeholder:text-[#2A1E4F] nunito-bold text-xl focus:outline-none' 
                placeholder='guess a pokemon'
                spellCheck='false'
                value={input}
                onChange={handleInputChange}
              />
              <button className='flex justify-center items-center w-8 h-8 rounded-[4px] bg-[#2A1E4F] border-[#6A0DAD] border-solid border-2 mx-4 cursor-pointer lg:hidden'>
                <Image src={SubmitBtn} draggable='false' alt='Submit Button' width={12} height={12} className='select-none'/>
              </button>
            </div>
  
            <div className='md:w-[573px] sm:w-[443px] w-full flex justify-center mt-2'>
              <div className='md:w-[563px] sm:w-[438px] w-10/12 h-auto rounded-full'>
                <p className={`sm:ml-2 -ml-2 nunito-semibold text-red-700 text-nowrap ${wrongPokemon ? '' : 'hidden'}`}>Oops! This Pokemon does not exist</p>
              </div>
            </div>
          </form>
  
          {isCorrect && (
            <div className="mt-6 text-center">
              <h2 className="nunito-bold text-2xl dark:text-green-500 text-green-700">Correct!! 🎉</h2>
              <p className="nunito-semibold text-xl">You caught {capitalizeFirstLetter(targetPokemon?.name)} in {guessCount} guesses!</p>
              <div className="mt-4 flex justify-center w-full">
                <Image 
                  src={getPokemonImageUrl(targetPokemon?.id)} 
                  alt={targetPokemon?.name} 
                  width={200} 
                  height={200} 
                  draggable='false'
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
  
          
  
          <div className={`md:w-[573px] sm:w-[443px] w-full mt-2 md:mb-10 mb-6 ${currentGuess ? '' : 'hidden'} h-12 bg-transparent border-[3px] border-solid dark:border-[#6A0DAD] border-[#2A1E4F] rounded-lg flex items-center justify-start relative z-10 overflow-hidden`}>
            <div className='absolute inset-y-0 rounded-sm opacity-70 -z-10' style={{ backgroundColor: `${currentColor}`, width: `${currentWidth}px`}}/>
            <p className='ml-5 sm:ml-6 nunito-semibold text-lg z-10'>{currentGuess}</p>
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
  
              // console.log(
              //   `Guess: ${guess.name}, RankPercentage: ${rankPercentage}, Width: ${width}px`
              // );
  
              return (
                <div
                  key={index}
                  className='md:w-[573px] sm:w-[443px] w-full mt-2 h-12 bg-transparent border-[3px] border-solid dark:border-[#6A0DAD] border-[#2A1E4F] rounded-lg flex items-center justify-start relative z-10 overflow-hidden'
                >
                  <div
                    className='absolute inset-y-0 rounded-sm opacity-70 -z-10'
                    style={{ backgroundColor: `${color}`, width: `${width}px` }}
                  />
                  <p className='ml-5 sm:ml-6 nunito-semibold text-lg z-10'>
                    {capitalizeFirstLetter(guess.name)}
                  </p>
                </div>
              );
            })}
  
        </div>
  
        <div className='lg:mr-5 mr-0 lg:w-1/4 xl:w-1/4 sm:w-[443px] w-10/12 lg:h-[501px] h-[401px] lg:mb-0 mb-5 dark:bg-[#2A1E4F] dark:border-[#6A0DAD] bg-[#8647B3] border-[#2A1E4F] border-solid border-[4px] rounded-lg flex flex-col items-center lg:order-3 order-first'>
            <div className='flex justify-between w-full mt-3'>
              <Image src={PurplePokeball} alt='*' width={26} draggable='false' className='ml-3 select-none'/>
              <p className='nunito-bold sm:text-xl text-lg'>Want a hint?</p>
              <Image src={PurplePokeball} alt='*' width={26} draggable='false' className='mr-3 select-none'/>
            </div>
            <div className='w-full flex justify-start ml-6 sm:mt-7 mt-5'>
              <p className='sm:nunito-bold nunito-semibold text-md sm:text-base'>Countdown to your next hint: <span>{hintCountDown}</span></p>
            </div>
            <button className={`mt-5 sm:mt-8 lg:px-[70px] px-[30px] lg:py-[18px] py-[10px] text-base nunito-extrabold box-shadow ${hintCountDown!=0 ? 'bg-gray-600 cursor-not-allowed text-gray-900' : 'bg-[#6A0DAD] dark:text-white text-black'}`} disabled={hintCountDown!=0} onClick={handleHint}>
              Get Hint
            </button>
            
            <div className='w-full flex h-[309px] overflow-y-scroll no-scrollbar flex-col items-center'>
              {hintList.map((hint, index) => {
                return (
                  <div key={index} className='w-10/12 border-t-[0.5px] border-[#220139] flex-start mt-2'>
                    <p className='py-3 xl:py-4 sm:ml-5 ml-2 text-center sm:text-left xl:text-base text-sm nunito-medium sm:nunito-semibold '>{hint}</p>
                  </div>
                )
              })}
            </div>
  
  
  
  
        </div>
      </div>
    )}
    </>
  )
}

export default GamePage