/**
 * sorting was the bottleneck for a lot of operations using native sorting
 * LLMs to the rescue
 */

/**
 * Sorts an array of unique integers (length 3 to 7) in place using optimal sorting networks.
 * Assumes array length is between 3 and 7, and elements are unique integers.
 *
 * @param {number[]} arr The array to sort (will be modified in place).
 */
export const sortCards = (arr: number[]) => {
  const n = arr.length
  let tmp // Reusable temporary variable for swaps

  // Inline Compare-and-Swap (Descending): Swaps if arr[i] < arr[j]
  // const CAS_DESC = (i, j) => {
  //     if (arr[i] < arr[j]) { tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; }
  // };
  // We will write this inline for maximum speed.

  switch (n) {
    case 1:
      // Already sorted
      break

    case 2: // Network: [(0,1)]
      // Layer 1
      if (arr[0] < arr[1]) {
        tmp = arr[0]
        arr[0] = arr[1]
        arr[1] = tmp
      } // (0,1)
      break

    case 3: // Network: [(0,2)], [(0,1)], [(1,2)]
      // Layer 1
      if (arr[0] < arr[2]) {
        tmp = arr[0]
        arr[0] = arr[2]
        arr[2] = tmp
      } // (0,2)
      // Layer 2
      if (arr[0] < arr[1]) {
        tmp = arr[0]
        arr[0] = arr[1]
        arr[1] = tmp
      } // (0,1)
      // Layer 3
      if (arr[1] < arr[2]) {
        tmp = arr[1]
        arr[1] = arr[2]
        arr[2] = tmp
      } // (1,2)
      break

    case 4: // Network: [(0,2),(1,3)], [(0,1),(2,3)], [(1,2)]
      // Layer 1
      if (arr[0] < arr[2]) {
        tmp = arr[0]
        arr[0] = arr[2]
        arr[2] = tmp
      } // (0,2)
      if (arr[1] < arr[3]) {
        tmp = arr[1]
        arr[1] = arr[3]
        arr[3] = tmp
      } // (1,3)
      // Layer 2
      if (arr[0] < arr[1]) {
        tmp = arr[0]
        arr[0] = arr[1]
        arr[1] = tmp
      } // (0,1)
      if (arr[2] < arr[3]) {
        tmp = arr[2]
        arr[2] = arr[3]
        arr[3] = tmp
      } // (2,3)
      // Layer 3
      if (arr[1] < arr[2]) {
        tmp = arr[1]
        arr[1] = arr[2]
        arr[2] = tmp
      } // (1,2)
      break

    case 5: // Network: [(0,3),(1,4)], [(0,2),(1,3)], [(0,1),(2,4)], [(1,2),(3,4)], [(2,3)]
      // Layer 1
      if (arr[0] < arr[3]) {
        tmp = arr[0]
        arr[0] = arr[3]
        arr[3] = tmp
      } // (0,3)
      if (arr[1] < arr[4]) {
        tmp = arr[1]
        arr[1] = arr[4]
        arr[4] = tmp
      } // (1,4)
      // Layer 2
      if (arr[0] < arr[2]) {
        tmp = arr[0]
        arr[0] = arr[2]
        arr[2] = tmp
      } // (0,2)
      if (arr[1] < arr[3]) {
        tmp = arr[1]
        arr[1] = arr[3]
        arr[3] = tmp
      } // (1,3)
      // Layer 3
      if (arr[0] < arr[1]) {
        tmp = arr[0]
        arr[0] = arr[1]
        arr[1] = tmp
      } // (0,1)
      if (arr[2] < arr[4]) {
        tmp = arr[2]
        arr[2] = arr[4]
        arr[4] = tmp
      } // (2,4)
      // Layer 4
      if (arr[1] < arr[2]) {
        tmp = arr[1]
        arr[1] = arr[2]
        arr[2] = tmp
      } // (1,2)
      if (arr[3] < arr[4]) {
        tmp = arr[3]
        arr[3] = arr[4]
        arr[4] = tmp
      } // (3,4)
      // Layer 5
      if (arr[2] < arr[3]) {
        tmp = arr[2]
        arr[2] = arr[3]
        arr[3] = tmp
      } // (2,3)
      break

    case 6: // Network: [(0,5),(1,3),(2,4)], [(1,2),(3,4)], [(0,3),(2,5)], [(0,1),(2,3),(4,5)], [(1,2),(3,4)]
      // Layer 1
      if (arr[0] < arr[5]) {
        tmp = arr[0]
        arr[0] = arr[5]
        arr[5] = tmp
      } // (0,5)
      if (arr[1] < arr[3]) {
        tmp = arr[1]
        arr[1] = arr[3]
        arr[3] = tmp
      } // (1,3)
      if (arr[2] < arr[4]) {
        tmp = arr[2]
        arr[2] = arr[4]
        arr[4] = tmp
      } // (2,4)
      // Layer 2
      if (arr[1] < arr[2]) {
        tmp = arr[1]
        arr[1] = arr[2]
        arr[2] = tmp
      } // (1,2)
      if (arr[3] < arr[4]) {
        tmp = arr[3]
        arr[3] = arr[4]
        arr[4] = tmp
      } // (3,4)
      // Layer 3
      if (arr[0] < arr[3]) {
        tmp = arr[0]
        arr[0] = arr[3]
        arr[3] = tmp
      } // (0,3)
      if (arr[2] < arr[5]) {
        tmp = arr[2]
        arr[2] = arr[5]
        arr[5] = tmp
      } // (2,5)
      // Layer 4
      if (arr[0] < arr[1]) {
        tmp = arr[0]
        arr[0] = arr[1]
        arr[1] = tmp
      } // (0,1)
      if (arr[2] < arr[3]) {
        tmp = arr[2]
        arr[2] = arr[3]
        arr[3] = tmp
      } // (2,3)
      if (arr[4] < arr[5]) {
        tmp = arr[4]
        arr[4] = arr[5]
        arr[5] = tmp
      } // (4,5)
      // Layer 5
      if (arr[1] < arr[2]) {
        tmp = arr[1]
        arr[1] = arr[2]
        arr[2] = tmp
      } // (1,2)
      if (arr[3] < arr[4]) {
        tmp = arr[3]
        arr[3] = arr[4]
        arr[4] = tmp
      } // (3,4)
      break

    case 7: // Network: [(0,6),(2,3),(4,5)], [(0,2),(1,4),(3,6)], [(0,1),(2,5),(3,4)], [(1,2),(4,6)], [(2,3),(4,5)], [(1,2),(3,4),(5,6)]
      // Layer 1
      if (arr[0] < arr[6]) {
        tmp = arr[0]
        arr[0] = arr[6]
        arr[6] = tmp
      } // (0,6)
      if (arr[2] < arr[3]) {
        tmp = arr[2]
        arr[2] = arr[3]
        arr[3] = tmp
      } // (2,3)
      if (arr[4] < arr[5]) {
        tmp = arr[4]
        arr[4] = arr[5]
        arr[5] = tmp
      } // (4,5)
      // Layer 2
      if (arr[0] < arr[2]) {
        tmp = arr[0]
        arr[0] = arr[2]
        arr[2] = tmp
      } // (0,2)
      if (arr[1] < arr[4]) {
        tmp = arr[1]
        arr[1] = arr[4]
        arr[4] = tmp
      } // (1,4)
      if (arr[3] < arr[6]) {
        tmp = arr[3]
        arr[3] = arr[6]
        arr[6] = tmp
      } // (3,6)
      // Layer 3
      if (arr[0] < arr[1]) {
        tmp = arr[0]
        arr[0] = arr[1]
        arr[1] = tmp
      } // (0,1)
      if (arr[2] < arr[5]) {
        tmp = arr[2]
        arr[2] = arr[5]
        arr[5] = tmp
      } // (2,5)
      if (arr[3] < arr[4]) {
        tmp = arr[3]
        arr[3] = arr[4]
        arr[4] = tmp
      } // (3,4)
      // Layer 4
      if (arr[1] < arr[2]) {
        tmp = arr[1]
        arr[1] = arr[2]
        arr[2] = tmp
      } // (1,2)
      if (arr[4] < arr[6]) {
        tmp = arr[4]
        arr[4] = arr[6]
        arr[6] = tmp
      } // (4,6)
      // Layer 5
      if (arr[2] < arr[3]) {
        tmp = arr[2]
        arr[2] = arr[3]
        arr[3] = tmp
      } // (2,3)
      if (arr[4] < arr[5]) {
        tmp = arr[4]
        arr[4] = arr[5]
        arr[5] = tmp
      } // (4,5)
      // Layer 6
      if (arr[1] < arr[2]) {
        tmp = arr[1]
        arr[1] = arr[2]
        arr[2] = tmp
      } // (1,2)
      if (arr[3] < arr[4]) {
        tmp = arr[3]
        arr[3] = arr[4]
        arr[4] = tmp
      } // (3,4)
      if (arr[5] < arr[6]) {
        tmp = arr[5]
        arr[5] = arr[6]
        arr[6] = tmp
      } // (5,6)
      break

    default:
      arr.sort((a, b) => b - a)
  }

  // Return the mutated array
  return arr
}
