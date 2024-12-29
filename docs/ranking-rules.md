# Ranking Rules

Each guessed Pokémon is compared with the target Pokémon, and scores are assigned based on these criteria:

## 1. Species / Evolution Line
- Same evolution line (adjacent stages):
  - Direct pre-evolution or post-evolution: **+10**
  - Two stages away: **+7**
- Different evolution line: **+1**

## 2. Type Similarity
- Shares one type with the target Pokémon: **+5**
- Shares both types with the target Pokémon: **+10**
- No shared type: **+0**

## 3. Generation
- Same generation: **+5**
- One generation apart: **+3**
- More than one generation apart: **+1**

## 4. Habitat
- Same habitat: **+5**
- Different habitat: **+0**

## 5. Shape / Body Features
- Similar body shape: **+5**
- Different body shape: **+0**

## 6. Color
- Same dominant color: **+3**
- Different dominant color: **+0**

---

### Additional Notes
- The total score is calculated by summing up all the points across these criteria.
- In case of ties between two Pokémon, a random tie-breaker or priority rule can be applied (e.g., evolution score has higher weight).
- Each guessed Pokémon will be displayed with its rank based on the total score.
