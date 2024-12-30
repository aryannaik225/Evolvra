import {
  getPokemonByName,
  getEvolutionChain,
  getGeneration,
  getShape,
  getHabitat,
  getColor
} from './pokeapi'

export const calculatePokemonRank = async (guessedPokemon, targetPokemon) => {
  let totalScore = 0

  const guessedEvolution = await getEvolutionChain(guessedPokemon.id)
  const targetEvolution = await getEvolutionChain(targetPokemon.id)


  // Evolution chain
  if (guessedEvolution && targetEvolution) {
    if (guessedEvolution.chain.species.name === targetEvolution.chain.species.name) {
      totalScore += 10
    } else {
      totalScore += 1
    }
  }

  // Type Similarity
  guessedPokemon.types.forEach((type) => {
    if (targetPokemon.types.some((targetType) => targetType.type.name === type.type.name)) {
      totalScore += 5
    }
  })

  // Generation
  const guessedGeneration = await getGeneration(guessedPokemon.id)
  const targetGeneration = await getGeneration(targetPokemon.id)
  if (guessedGeneration === targetGeneration) totalScore += 5
  else if (Math.abs(guessedGeneration - targetGeneration) === 1) totalScore += 3
  else totalScore += 1

  // Habitat
  const guessedHabitat = await getHabitat(guessedPokemon.id)
  const targetHabitat = await getHabitat(targetPokemon.id)
  if (guessedHabitat === targetHabitat) totalScore += 5

  // Shape
  const guessedShape = await getShape(guessedPokemon.id)
  const targetShape = await getShape(targetPokemon.id)
  if (guessedShape === targetShape) totalScore += 5

  // Color
  const guessedColor = await getColor(guessedPokemon.id)
  const targetColor = await getColor(targetPokemon.id)
  if (guessedColor === targetColor) totalScore += 3

  return { name: guessedPokemon.name, score: totalScore }
}

export const getAllPokemonRank = async (targetPokemon) => {
  let allPokemons = []
  for (let i=1; i <= 20 ; i++) {
    const pokemon = await getPokemonByName(i)
    console.log(pokemon)
    const rank = await calculatePokemonRank(pokemon, targetPokemon)
    console.log(rank)
    allPokemons.push(rank)
  }

  allPokemons.sort((a, b) => b.score - a.score)
  console.log(allPokemons)

  return allPokemons
}