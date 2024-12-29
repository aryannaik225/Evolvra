import { Pokedex } from "pokeapi-js-wrapper"

const P = new Pokedex()


// Function to fetch basic Pokemon data
export async function getPokemonByName(name) {
  try {
    const pokemon = await P.getPokemonByName(name.toLowerCase())
    return pokemon
  } catch (error) {
    console.error(`Error fetching data for Pokemon ${name}: ${error}`)
    return null
  }
}

// Function to fetch speices data
export async function getSpeciesByName(name) {
  try {
    const species = await P.getPokemonSpeciesByName(name.toLowerCase())
    return species
  } catch (error) {
    console.error(`Error fetching data for Pokemon ${name}: ${error}`)
    return null
  }
}

// Function to fetch Pokemon from evolution chain
export async function getEvolutionChain(url) {
  try {
    const evolutionChain = await P.resource(url)
    return evolutionChain
  } catch (error) {
    console.error(`Error fetching evolution chain: ${url}`, error)
    return null
  }
}