import { Pokedex } from "pokeapi-js-wrapper";

const p = new Pokedex();

export const getPokemonByName = async (name) => {
  try {
    const pokemon = await p.getPokemonByName(String(name).toLowerCase())
    return pokemon
  } catch (error) {
    console.error('Error fetching Pokemon data:', error)
    return null
  }
}

export const getRandomPokemon = async () => {
  try {
    const randomId = Math.floor(Math.random() * 1010) + 1
    const pokemon = await p.getPokemonByName(randomId)
    return pokemon
  } catch (error) {
    console.error('Error fetching random Pokemon:', error)
    return null
  }
}

export const getEvolutionChain = async (pokemonId) => {
  try {
    const pokemonSpecies = await p.getPokemonSpeciesByName(pokemonId)
    const evolutionChainUrl = pokemonSpecies.evolution_chain.url
    const evolutionChain = await fetch(evolutionChainUrl).then((res) => res.json())
    return evolutionChain
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