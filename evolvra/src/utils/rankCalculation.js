import {
  getPokemonByName,
  getEvolutionChain,
  getGeneration,
  getShape,
  getHabitat,
  getColor,
} from './pokeapi';

export const calculatePokemonRank = async (guessedPokemon, targetPokemon) => {
  let totalScore = 0;

  const guessedEvolution = await getEvolutionChain(guessedPokemon.id);
  const targetEvolution = await getEvolutionChain(targetPokemon.id);

  const typeMatch = guessedPokemon.types.some((type) =>
    targetPokemon.types.some((targetType) => targetType.type.name === type.type.name)
  ) ? 1 : 0;
  totalScore += typeMatch * 4;

  // const evolutionChainMatch = guessedEvolution && targetEvolution
  //   ? (guessedEvolution.chain.species.name === targetEvolution.chain.species.name ? 1 : 0)
  //   : 0;
  // totalScore += evolutionChainMatch * 3;

  if (guessedEvolution && targetEvolution ) {
    const guessedEvolutionNames = guessedEvolution
    const targetEvolutionNames = targetEvolution
    const evolutionChainMatch = guessedEvolutionNames.every((name, index) => name === targetEvolutionNames[index]) ? 1 : 0
    totalScore += evolutionChainMatch * 3;
  }

  const guessedGeneration = await getGeneration(guessedPokemon.id);
  const targetGeneration = await getGeneration(targetPokemon.id);
  const generationProximity = Math.abs(guessedGeneration - targetGeneration) <= 1 ? 1 : 0;
  totalScore += generationProximity * 2;

  const guessedHabitat = await getHabitat(guessedPokemon.id);
  const targetHabitat = await getHabitat(targetPokemon.id);
  const habitatMatch = (guessedHabitat === targetHabitat) ? 1 : 0;
  totalScore += habitatMatch * 1.5;

  const guessedShape = await getShape(guessedPokemon.id);
  const targetShape = await getShape(targetPokemon.id);
  const shapeSimilarity = (guessedShape === targetShape) ? 1 : 0;
  totalScore += shapeSimilarity * 1;

  const guessedColor = await getColor(guessedPokemon.id);
  const targetColor = await getColor(targetPokemon.id);
  const colorMatch = (guessedColor === targetColor) ? 1 : 0;
  totalScore += colorMatch * 0.5;

  const penalty = calculatePenalties(guessedPokemon, targetPokemon);
  totalScore -= penalty;

  totalScore = Math.max(0, Math.min(totalScore, 1000));

  return { name: guessedPokemon.name, score: totalScore };
};

const calculatePenalties = (guessedPokemon, targetPokemon) => {
  let penalty = 0;

  if (!guessedPokemon.types.some((type) => targetPokemon.types.some((targetType) => targetType.type.name === type.type.name))) {
    penalty += 50;
  }

  const guessedEvolution = getEvolutionChain(guessedPokemon.id);
  const targetEvolution = getEvolutionChain(targetPokemon.id);
  console.log(guessedEvolution, targetEvolution);
  if (guessedEvolution && targetEvolution && guessedEvolution.species.name !== targetEvolution.chain.name) {
    penalty += 30;
  }

  const guessedGeneration = getGeneration(guessedPokemon.id);
  const targetGeneration = getGeneration(targetPokemon.id);
  if (Math.abs(guessedGeneration - targetGeneration) > 1) {
    penalty += 20;
  }

  const guessedHabitat = getHabitat(guessedPokemon.id);
  const targetHabitat = getHabitat(targetPokemon.id);
  if (guessedHabitat !== targetHabitat) {
    penalty += 10;
  }

  const guessedShape = getShape(guessedPokemon.id);
  const targetShape = getShape(targetPokemon.id);
  if (guessedShape !== targetShape) {
    penalty += 5;
  }

  const guessedColor = getColor(guessedPokemon.id);
  const targetColor = getColor(targetPokemon.id);
  if (guessedColor !== targetColor) {
    penalty += 2;
  }

  return penalty;
};
