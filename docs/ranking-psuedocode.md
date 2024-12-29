1. Input:
   - `guessedPokemon`: The Pokémon guessed by the user.
   - `targetPokemon`: The actual Pokémon to guess.

2. Initialize `totalScore` to 0.

3. Scoring Rules:
   a. **Evolution Line**
      - If `guessedPokemon` and `targetPokemon` are in the same evolution line:
         - If directly adjacent (e.g., pre-evolution or post-evolution): Add 10 points.
         - If two stages apart: Add 7 points.
      - Else: Add 1 point.

   b. **Type Similarity**
      - For each type of `guessedPokemon`:
         - If it matches a type of `targetPokemon`: Add 5 points.
      - If both types match: Add an additional 5 points.

   c. **Generation**
      - If the same generation: Add 5 points.
      - If one generation apart: Add 3 points.
      - If more than one generation apart: Add 1 point.

   d. **Habitat**
      - If the habitats match: Add 5 points.
      - Else: Add 0 points.

   e. **Shape / Body Features**
      - If the body shape matches: Add 5 points.
      - Else: Add 0 points.

   f. **Color**
      - If the dominant color matches: Add 3 points.
      - Else: Add 0 points.

4. Compute the final score for `guessedPokemon` based on the above rules.

5. Repeat steps 3-4 for all Pokémon in the dataset to determine their scores.

6. Rank Pokémon based on their scores:
   - Sort all scored Pokémon in descending order of their scores.

7. Output:
   - Display the ranked list of Pokémon.
   - Highlight the rank and score of the guessed Pokémon.
   - Provide feedback to the user (Optional):
      - "You're close!" if the rank is high.
      - "Try again!" if the rank is low.
