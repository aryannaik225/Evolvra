# **Pokémon Rank Counting Logic**

## **Overview**
The ranking system in the project determines how closely a guessed Pokémon resembles the target Pokémon based on multiple criteria. Each criterion contributes to a total score, which is then used to rank the guessed Pokémon. This helps players gauge their guesses' proximity to the target Pokémon and adjust their subsequent guesses accordingly.

---

## **Current Scoring Logic**
The current system evaluates the similarity between the guessed Pokémon and the target Pokémon based on six key attributes:

1. **Evolution Chain**
   - If both Pokémon belong to the same evolution chain:
     - **+10 points**
   - Otherwise:
     - **+1 point**

2. **Type Similarity**
   - For each matching type (e.g., Fire, Water):
     - **+5 points**

3. **Generation Proximity**
   - If both Pokémon are from the same generation:
     - **+5 points**
   - If the generations are adjacent:
     - **+3 points**
   - Otherwise:
     - **+1 point**

4. **Habitat Similarity**
   - If both Pokémon share the same habitat:
     - **+5 points**

5. **Shape Similarity**
   - If both Pokémon share the same body shape:
     - **+5 points**

6. **Color Similarity**
   - If both Pokémon share the same primary color:
     - **+3 points**

### **Drawback of the Current System**
While the scoring system provides a quick and intuitive way to rank guesses, it has a significant limitation:

- **Ambiguity in Scores**: Multiple Pokémon can achieve the same score, making it difficult to differentiate which one is truly closer to the target. This lack of granularity can lead to confusion when interpreting rankings.

---

## **Enhanced Scoring Logic**
To address the limitations of the current system, the following enhanced approach is proposed. This approach introduces greater granularity and differentiation between scores, ensuring more accurate and precise rankings.

### **Key Enhancements**

1. **Weighted Scoring**
   - Assign weights to each criterion based on its importance to similarity.
     - **Type Match**: Weight = 4
     - **Evolution Chain**: Weight = 3
     - **Generation Proximity**: Weight = 2
     - **Habitat Match**: Weight = 1.5
     - **Shape Similarity**: Weight = 1
     - **Color Match**: Weight = 0.5

   Example:
   - A matching type contributes significantly more to the score than matching color.

2. **Penalty for Mismatches**
   - Deduct points for mismatched attributes to penalize guesses that are vastly different from the target.

3. **Distance Normalization**
   - Normalize scores to fall within a broad range (e.g., [0, 1000]). This ensures that even minor differences in features result in distinct scores.

4. **Tie-Breaking Mechanisms**
   - In cases where multiple Pokémon achieve the same score:
     - Use secondary attributes such as base stats or height/weight proximity.
     - If still tied, append a unique identifier (e.g., Pokémon ID) as a decimal fraction to the score.

### **Formula**
The enhanced scoring formula can be represented as:

\[ \text{Score} = \sum_{i=1}^{n} \left( W_i \times S_i \right) - \text{Penalty} \]

Where:
- \( W_i \): Weight for the \( i \)-th criterion.
- \( S_i \): Score for the \( i \)-th criterion (e.g., type match, color similarity).
- \( \text{Penalty} \): Penalties for mismatches.

### **Benefits**
- **Granularity**: Ensures unique scores for each Pokémon.
- **Fairness**: Accounts for both matches and mismatches.
- **Clarity**: Makes it easier for players to discern which Pokémon are closer to the target.

---

## **Implementation Notes**
- Adjust the weights and penalties based on gameplay feedback to balance difficulty and fairness.
- Test the enhanced scoring system with various target Pokémon and guesses to ensure consistency and reliability.
- Use real-world scenarios to validate that the rankings align with user expectations.

---

## **Conclusion**
The enhanced scoring system addresses the ambiguity of the current logic by introducing weighted scores, penalties, and tie-breaking mechanisms. This ensures that each guessed Pokémon receives a distinct and accurate ranking, providing players with a clearer understanding of how close their guesses are to the target Pokémon.

