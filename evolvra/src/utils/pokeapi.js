import { Pokedex } from "pokeapi-js-wrapper";

const p = new Pokedex();

export const getPokemonByName = async (name) => {
  try {
    const pokemon = await p.getPokemonByName(name.toLowerCase())
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