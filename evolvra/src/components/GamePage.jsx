'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Star from '@/assets/star.svg';
import MenuBtn from '@/assets/menuBtn.svg';
import SubmitBtn from '@/assets/submitBtn.svg';
import { getRandomPokemon, getPokemonByName } from '@/utils/pokeapi';
import { calculatePokemonRank } from '@/utils/rankCalculation';
import Confetti from 'react-confetti';

const GamePage = () => {
  const [targetPokemon, setTargetPokemon] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [guessCount, setGuessCount] = useState(0);
  const [hintCount, setHintCount] = useState(0);
  const [input, setInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTryAnother, setShowTryAnother] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    const fetchRandomPokemon = async () => {
      setLoading(true);
      const startTime = performance.now();
      const timerInterval = setInterval(() => {
        setLoadingTime(((performance.now() - startTime) / 1000).toFixed(2));
      }, 100);

      const pokemon = await getRandomPokemon();
      setTargetPokemon(pokemon);
      console.log('Target Pokemon:', pokemon);

      clearInterval(timerInterval);
      setLoadingTime(((performance.now() - startTime) / 1000).toFixed(2));
      setLoading(false);
    };

    fetchRandomPokemon();
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const guessedPokemon = await getPokemonByName(input);

    if (guessedPokemon) {
      console.log('Guessed Pokemon:', guessedPokemon);
      const rankResult = await calculatePokemonRank(guessedPokemon, targetPokemon);

      setGuesses((prev) => [...prev, rankResult]);
      setGuessCount((prev) => prev + 1);

      if (guessedPokemon.name.toLowerCase() === targetPokemon.name.toLowerCase()) {
        setIsCorrect(true);
        setShowConfetti(true);
        setShowTryAnother(true);
      }
    } else {
      console.log('Pokemon not found!');
    }

    setInput('');
  };

  const handleTryAnother = async () => {
    setLoading(true);
    const startTime = performance.now();
    const timerInterval = setInterval(() => {
      setLoadingTime(((performance.now() - startTime) / 1000).toFixed(2));
    }, 100);

    const pokemon = await getRandomPokemon();
    setTargetPokemon(pokemon);
    console.log('Target Pokemon:', pokemon);

    setGuesses([]);
    setGuessCount(0);
    setIsCorrect(false);
    setShowConfetti(false);
    setShowTryAnother(false);

    clearInterval(timerInterval);
    setLoadingTime(((performance.now() - startTime) / 1000).toFixed(2));
    setLoading(false);
  };

  const getPokemonImageUrl = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center bg-[#2A1E4F] text-white">
        <h2 className="nunito-bold text-3xl">Loading Pokémon...</h2>
        <p className="nunito-medium text-lg mt-4">
          Time elapsed: <span className="text-xl">{loadingTime}s</span>
        </p>
        <div className="mt-6 flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-t-[#6A0DAD] border-[#374151] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <a href="https://github.com/aryannaik225/Evolvra" className="w-[573px] h-12 bg-[#2A1E4F] border-[#6A0DAD] border-solid border-[3px] rounded-lg flex items-center">
        <div className="flex gap-[6px]">
          <Image src={Star} alt="Star" className="ml-3 w-6 h-auto" />
          <p className="nunito-semibold text-base mt-1">Love the project? Star it on GitHub!</p>
        </div>
      </a>

      <div className="w-[573px] flex justify-evenly mt-12 items-center">
        <div></div>
        <span className="nunito-bold text-3xl">Guess the Pokémon</span>
        <div className="flex justify-center items-center rounded-full h-8 w-8 hover:bg-[#6A0DAD40] transition-all ease-in-out cursor-pointer">
          <Image src={MenuBtn} alt="Menu Button" width={5} height={24} />
        </div>
      </div>

      <div className="mt-8 w-[573px] justify-start mb-3">
        <div className="ml-2 flex gap-5">
          <p className="nunito-bold text-base">Guesses: <span className="text-xl">{guessCount}</span></p>
          <p className="nunito-bold text-base">Hint: <span className="text-xl">{hintCount}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="w-[573px] h-16 rounded-lg bg-[#2D1D58] border-[3px] border-solid border-[#374151] flex items-center">
          <input
            type="text"
            className="ml-5 bg-transparent lg:w-[533px] placeholder:text-[#6A0DAD] nunito-bold text-xl focus:outline-none"
            placeholder="guess a pokemon"
            spellCheck="false"
            value={input}
            onChange={handleInputChange}
          />
          <button className="flex justify-center items-center w-8 h-8 rounded-[4px] bg-[#2A1E4F] border-[#6A0DAD] border-solid border-2 mx-4 cursor-pointer lg:hidden">
            <Image src={SubmitBtn} alt="Submit Button" width={12} height={12} />
          </button>
        </div>
      </form>

      <div className="mt-4">
        <p className="nunito-semibold text-base">Game Time: <span className="text-xl">{loadingTime}s</span></p>
      </div>

      {guesses.map((guess, index) => (
        <div key={index}>
          <p>{guess.name} - Score: {guess.score}</p>
        </div>
      ))}

      {isCorrect && (
        <div className="mt-6 text-center">
          <h2 className="nunito-bold text-2xl text-green-500">Correct!! 🎉</h2>
          <p className="nunito-semibold text-xl">You caught {targetPokemon?.name} in {guessCount} guesses!</p>
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
    </div>
  );
};

export default GamePage;
