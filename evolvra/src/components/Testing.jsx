'use client'

import React, { useEffect } from 'react'
import { getPokemonByName, getSpeciesByName, getEvolutionChain } from '@/api/api'

const Testing = () => {

  useEffect(() => {
    async function fetchData() {
      const bulbasaur = await getPokemonByName('bulbasaur')
      console.log('Bulbasaur Data:', bulbasaur)

      const species = await getSpeciesByName('bulbasaur')
      console.log('Species Data:', species)

      const evolutionChain = await getEvolutionChain(species.evolution_chain.url)
      console.log('Evolution Chain:', evolutionChain)
    }
    fetchData()
  }, [])

  return (
    <div className='absolute top-10 left-12 font-extrabold'>Check your console for Pokemon data</div>
  )
}

export default Testing