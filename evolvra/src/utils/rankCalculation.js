import {
  getPokemonByName,
  getEvolutionChain,
  getGeneration,
  getShape,
  getHabitat,
  getColor,
} from './pokeapi'

const weights = {
  evolutionChain: 3,
  type: 4,
  generation: 2,
  habitat: 1.5,
  shape: 1,
  color: 0.5,
}

// const penalties = {
//   evolutionChain: -5,
//   type: -2,
//   generation: -3,
//   habitat: -3,
//   shape: -2,
//   color: -1,
// }


const penalties = {
  evolutionChain: 0,
  type: 0,
  generation: 0,
  habitat: 0,
  shape: 0,
  color: 0,
}

const calculateEvolutionChain = async (guessedPokemon, targetPokemon) => {
  const guessedEvolution = await getEvolutionChain(guessedPokemon.id)
  const targetEvolution = await getEvolutionChain(targetPokemon.id)

  return guessedEvolution && targetEvolution && guessedEvolution[0] === targetEvolution[0] ? 10 : penalties.evolutionChain
}


const calculateTypeSimilarity = async (guessedPokemon, targetPokemon) => {
  const guessedTypes = (await getPokemonByName(guessedPokemon.name)).types
  const targetTypes = (await getPokemonByName(targetPokemon.name)).types

  let score = 0

  const targetTypeNames = targetTypes.map(type => type.type.name)

  guessedTypes.forEach(type => {
    if(targetTypeNames.includes(type.type.name)) {
      score += 5
    }
  })

  if (score === 0) {
    return penalties.type
  }

  return score
}

const calculateGenerationProximity = async (guessedPokemon, targetPokemon) => {
  const guessedGeneration = await getGeneration(guessedPokemon.id)
  const targetGeneration = await getGeneration(targetPokemon.id)

  if (guessedGeneration === targetGeneration) {
    return 5
  }

  const generationDifference = Math.abs(Number(guessedGeneration.split('-')[1]) - Number(targetGeneration.split('-')[1]))
  return generationDifference === 1 ? 3 : penalties.generation
}

const calculateHabitatSimilarity = async (guessedPokemon, targetPokemon) => {
  const guessedHabitat = await getHabitat(guessedPokemon.id)
  const targetHabitat = await getHabitat(targetPokemon.id)

  return guessedHabitat === targetHabitat ? 5 : penalties.habitat
}

const calculateShapeSimilarity = async (guessedPokemon, targetPokemon) => {
  const guessedShape = await getShape(guessedPokemon.id)
  const targetShape = await getShape(targetPokemon.id)

  return guessedShape === targetShape ? 5 : penalties.shape
}

const calculateColorSimilarity = async (guessedPokemon, targetPokemon) => {
  const guessedColor = await getColor(guessedPokemon.id)
  const targetColor = await getColor(targetPokemon.id)

  return guessedColor === targetColor ? 3 : penalties.color
}

export const calculateRank = async (guessedPokemon, targetPokemon) => {
  let totalScore = 0

  totalScore += (await calculateEvolutionChain(guessedPokemon, targetPokemon)) * weights.evolutionChain
  totalScore += (await calculateTypeSimilarity(guessedPokemon, targetPokemon)) * weights.type
  totalScore += (await calculateGenerationProximity(guessedPokemon, targetPokemon)) * weights.generation
  totalScore += (await calculateHabitatSimilarity(guessedPokemon, targetPokemon)) * weights.habitat
  totalScore += (await calculateShapeSimilarity(guessedPokemon, targetPokemon)) * weights.shape
  totalScore += (await calculateColorSimilarity(guessedPokemon, targetPokemon)) * weights.color

  const idDifference = Math.abs(guessedPokemon.id - targetPokemon.id)

  totalScore -= idDifference / 1000

  return totalScore
}