'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export default function AnimatedButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      className={`relative flex justify-between items-center w-44 h-11 px-2 rounded-lg overflow-hidden 
        ${hovered ? 'text-white' : 'text-black dark:text-white'}
      `}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Background Transition Behind Cloud */}
      <motion.div
        className='absolute top-0 left-0 h-full w-full'
        initial={{ x: '-100%' }}
        animate={hovered ? { x: '0%' } : { x: '-100%' }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        style={{ backgroundImage: "url('/button-assests/kanto-btn.png')", backgroundSize: 'cover' }}
      />

      {/* Cloud Animation */}
      <motion.div
        className='absolute left-0 top-0 h-full w-full'
        initial={{ x: '-100%' }}
        animate={hovered ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <Image src='/button-assests/cloud.png' alt='cloud' layout='fill' objectFit='cover' className='opacity-100' />
      </motion.div>

      {/* Left Pokeball */}
      <Image
        src='/button-assets/pokeball-gray.svg'
        alt='Pokeball'
        width={26}
        height={26}
        draggable='false'
        className='select-none relative z-10'
      />
      
      {/* Text */}
      <motion.p
        className='relative z-10 nunito-semibold text-base'
        animate={hovered ? { fontSize: '1.2rem', fontWeight: 700 } : { fontSize: '1rem', fontWeight: 600 }}
        transition={{ duration: 0.3 }}
      >
        Kanto
      </motion.p>
      
      <div className='w-6 relative z-10' />
      
      {/* Pokémon Animations */}
      {hovered && (
        <>
          <motion.img
            src='evolvra\public\button-assests\articuno.svg'
            alt='Pokemon 1'
            className='absolute top-[-20px] left-[-20px] w-10 h-10'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: [0, -30, -60], x: [0, -20, -40] }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <motion.img
            src='evolvra\public\button-assests\charizard.svg'
            alt='Pokemon 2'
            className='absolute top-[-20px] right-[-20px] w-10 h-10'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: [0, -30, -60], x: [0, 20, 40] }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </>
      )}
    </motion.button>
  );
}
