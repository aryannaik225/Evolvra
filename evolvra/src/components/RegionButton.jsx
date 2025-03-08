import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const RegionButton = () => {
  
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      className={`relative flex justify-between items-center w-44 h-11 px-2 rounded-lg overflow-hidden ${hovered ? 'text-white' : 'text-black dark:text-white'}`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >

    </motion.button>
  )
}

export default RegionButton