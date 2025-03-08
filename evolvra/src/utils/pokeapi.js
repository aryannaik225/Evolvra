import { Pokedex } from "pokeapi-js-wrapper";

const p = new Pokedex();

const regionLimits = {
  Kanto: { start: 1, end: 151 },
  Johto: { start: 152, end: 251 },
  Hoenn: { start: 252, end: 386 },
  Sinnoh: { start: 387, end: 493 },
  Unova: { start: 494, end: 649 },
};

export const getPokemonByName = async (name) => {
  try {
    const pokemon = await p.getPokemonByName(String(name).toLowerCase())
    return pokemon
  } catch (error) {
    // console.log('Error fetching Pokemon data:', error)
    return null
  }
}

export const getRandomPokemon = async (selectedRegion) => {
  try {

    if(!selectedRegion || !regionLimits[selectedRegion]) return null

    const { start, end } = regionLimits[selectedRegion]
    const randomId = Math.floor(Math.random() * (end - start + 1)) + start
    const pokemon = await p.getPokemonByName(randomId)
    return pokemon
  } catch (error) {
    console.error('Error fetching random Pokemon:', error)
    return null
  }
}

// export const getEvolutionChain = async (pokemonId) => {
//   try {
//     const pokemonSpecies = await p.getPokemonSpeciesByName(pokemonId)
//     const evolutionChainUrl = pokemonSpecies.evolution_chain.url
//     const evolutionChain = await fetch(evolutionChainUrl).then((res) => res.json())
//     console.log(evolutionChain)
//     return evolutionChain
//   } catch (error) {
//     console.error('Error fetching evolution chain:', error)
//     return null
//   }
// }


export const getEvolutionChain = async (pokemonId) => {
  try {
    const pokemonSpecies = await p.getPokemonSpeciesByName(pokemonId)
    const evolutionChainUrl = pokemonSpecies.evolution_chain.url
    const evolutionChain = await fetch(evolutionChainUrl).then((res) => res.json())

    // console.log(evolutionChain)

    const extractPokemonNames = (chain) => {
      const names = []

      if (chain.species) {
        names.push(chain.species.name)
      }

      if (chain.evolves_to && chain.evolves_to.length > 0) {
        chain.evolves_to.forEach((evolve) => {
          names.push(...extractPokemonNames(evolve))
        })
      }

      return names
    }

    const evolutionNames = extractPokemonNames(evolutionChain.chain)
    // console.log(evolutionNames)

    return evolutionNames
  } catch (error) {
    console.error('Error fetching evolution chain:', error)
    return null
  }
}

export const getGeneration = async (pokemonId) => {
  try {
    const pokemonSpecies = await p.getPokemonSpeciesByName(pokemonId)
    return pokemonSpecies.generation.name
  } catch (error) {
    console.error('Error fetching generation:', error)
    return null
  }
}

export const getShape = async (pokemonId) => {
  try {
    const pokemonSpecies = await p.getPokemonSpeciesByName(pokemonId)
    return pokemonSpecies.shape ? pokemonSpecies.shape.name : null
  } catch (error) {
    console.error('Error fetching shape:', error)
    return null
  }
}

export const getHabitat = async (pokemonId) => {
  try {
    const pokemonSpecies = await p.getPokemonSpeciesByName(pokemonId)
    return pokemonSpecies.habitat ? pokemonSpecies.habitat.name : null
  } catch (error) {
    console.error('Error fetching habitat:', error)
    return null
  }
}

export const getColor = async (pokemonId) => {
  try {
    const pokemonSpecies = await p.getPokemonSpeciesByName(pokemonId)
    return pokemonSpecies.color.name
  } catch (error) {
    console.error("Error fetching color:", error)
    return null
  }
};