/**
 * Sorting was the bottleneck for a lot of operations using native .sort
 *
 * Sorts an array of unique integers descending in place using optimal sorting networks for length up to 11 (PLO6+board)
 *
 * @param {number[]} arr The array to sort (will be modified in place).
 */
export const sortCards = (arr: number[], n = arr.length) => {
  let tmp // Reusable temporary variable for swaps

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
    case 8: // Network: [(0,2),(1,3),(4,6),(5,7)], [(0,4),(1,5),(2,6),(3,7)], [(0,1),(2,3),(4,5),(6,7)], [(2,4),(3,5)], [(1,4),(3,6)], [(1,2),(3,4),(5,6)] - 19 CEs
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
      if (arr[4] < arr[6]) {
        tmp = arr[4]
        arr[4] = arr[6]
        arr[6] = tmp
      } // (4,6)
      if (arr[5] < arr[7]) {
        tmp = arr[5]
        arr[5] = arr[7]
        arr[7] = tmp
      } // (5,7)
      // Layer 2
      if (arr[0] < arr[4]) {
        tmp = arr[0]
        arr[0] = arr[4]
        arr[4] = tmp
      } // (0,4)
      if (arr[1] < arr[5]) {
        tmp = arr[1]
        arr[1] = arr[5]
        arr[5] = tmp
      } // (1,5)
      if (arr[2] < arr[6]) {
        tmp = arr[2]
        arr[2] = arr[6]
        arr[6] = tmp
      } // (2,6)
      if (arr[3] < arr[7]) {
        tmp = arr[3]
        arr[3] = arr[7]
        arr[7] = tmp
      } // (3,7)
      // Layer 3
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
      if (arr[6] < arr[7]) {
        tmp = arr[6]
        arr[6] = arr[7]
        arr[7] = tmp
      } // (6,7)
      // Layer 4
      if (arr[2] < arr[4]) {
        tmp = arr[2]
        arr[2] = arr[4]
        arr[4] = tmp
      } // (2,4)
      if (arr[3] < arr[5]) {
        tmp = arr[3]
        arr[3] = arr[5]
        arr[5] = tmp
      } // (3,5)
      // Layer 5
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

    case 9: // Network: [(0,3),(1,7),(2,5),(4,8)], [(0,7),(2,4),(3,8),(5,6)], [(0,2),(1,3),(4,5),(7,8)], [(1,4),(3,6),(5,7)], [(0,1),(2,4),(3,5),(6,8)], [(2,3),(4,5),(6,7)], [(1,2),(3,4),(5,6)] - 25 CEs
      // Layer 1
      if (arr[0] < arr[3]) {
        tmp = arr[0]
        arr[0] = arr[3]
        arr[3] = tmp
      } // (0,3)
      if (arr[1] < arr[7]) {
        tmp = arr[1]
        arr[1] = arr[7]
        arr[7] = tmp
      } // (1,7)
      if (arr[2] < arr[5]) {
        tmp = arr[2]
        arr[2] = arr[5]
        arr[5] = tmp
      } // (2,5)
      if (arr[4] < arr[8]) {
        tmp = arr[4]
        arr[4] = arr[8]
        arr[8] = tmp
      } // (4,8)
      // Layer 2
      if (arr[0] < arr[7]) {
        tmp = arr[0]
        arr[0] = arr[7]
        arr[7] = tmp
      } // (0,7)
      if (arr[2] < arr[4]) {
        tmp = arr[2]
        arr[2] = arr[4]
        arr[4] = tmp
      } // (2,4)
      if (arr[3] < arr[8]) {
        tmp = arr[3]
        arr[3] = arr[8]
        arr[8] = tmp
      } // (3,8)
      if (arr[5] < arr[6]) {
        tmp = arr[5]
        arr[5] = arr[6]
        arr[6] = tmp
      } // (5,6)
      // Layer 3
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
      if (arr[4] < arr[5]) {
        tmp = arr[4]
        arr[4] = arr[5]
        arr[5] = tmp
      } // (4,5)
      if (arr[7] < arr[8]) {
        tmp = arr[7]
        arr[7] = arr[8]
        arr[8] = tmp
      } // (7,8)
      // Layer 4
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
      if (arr[5] < arr[7]) {
        tmp = arr[5]
        arr[5] = arr[7]
        arr[7] = tmp
      } // (5,7)
      // Layer 5
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
      if (arr[3] < arr[5]) {
        tmp = arr[3]
        arr[3] = arr[5]
        arr[5] = tmp
      } // (3,5)
      if (arr[6] < arr[8]) {
        tmp = arr[6]
        arr[6] = arr[8]
        arr[8] = tmp
      } // (6,8)
      // Layer 6
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
      if (arr[6] < arr[7]) {
        tmp = arr[6]
        arr[6] = arr[7]
        arr[7] = tmp
      } // (6,7)
      // Layer 7
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

    case 10: // Network: [(0,1),(2,5),(3,6),(4,7),(8,9)], [(0,6),(1,8),(2,4),(3,9),(5,7)], [(0,2),(1,3),(4,5),(6,8),(7,9)], [(0,1),(2,7),(3,5),(4,6),(8,9)], [(1,2),(3,4),(5,6),(7,8)], [(1,3),(2,4),(5,7),(6,8)], [(2,3),(4,5),(6,7)] - 31 CEs
      // Layer 1
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
      if (arr[3] < arr[6]) {
        tmp = arr[3]
        arr[3] = arr[6]
        arr[6] = tmp
      } // (3,6)
      if (arr[4] < arr[7]) {
        tmp = arr[4]
        arr[4] = arr[7]
        arr[7] = tmp
      } // (4,7)
      if (arr[8] < arr[9]) {
        tmp = arr[8]
        arr[8] = arr[9]
        arr[9] = tmp
      } // (8,9)
      // Layer 2
      if (arr[0] < arr[6]) {
        tmp = arr[0]
        arr[0] = arr[6]
        arr[6] = tmp
      } // (0,6)
      if (arr[1] < arr[8]) {
        tmp = arr[1]
        arr[1] = arr[8]
        arr[8] = tmp
      } // (1,8)
      if (arr[2] < arr[4]) {
        tmp = arr[2]
        arr[2] = arr[4]
        arr[4] = tmp
      } // (2,4)
      if (arr[3] < arr[9]) {
        tmp = arr[3]
        arr[3] = arr[9]
        arr[9] = tmp
      } // (3,9)
      if (arr[5] < arr[7]) {
        tmp = arr[5]
        arr[5] = arr[7]
        arr[7] = tmp
      } // (5,7)
      // Layer 3
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
      if (arr[4] < arr[5]) {
        tmp = arr[4]
        arr[4] = arr[5]
        arr[5] = tmp
      } // (4,5)
      if (arr[6] < arr[8]) {
        tmp = arr[6]
        arr[6] = arr[8]
        arr[8] = tmp
      } // (6,8)
      if (arr[7] < arr[9]) {
        tmp = arr[7]
        arr[7] = arr[9]
        arr[9] = tmp
      } // (7,9)
      // Layer 4
      if (arr[0] < arr[1]) {
        tmp = arr[0]
        arr[0] = arr[1]
        arr[1] = tmp
      } // (0,1)
      if (arr[2] < arr[7]) {
        tmp = arr[2]
        arr[2] = arr[7]
        arr[7] = tmp
      } // (2,7)
      if (arr[3] < arr[5]) {
        tmp = arr[3]
        arr[3] = arr[5]
        arr[5] = tmp
      } // (3,5)
      if (arr[4] < arr[6]) {
        tmp = arr[4]
        arr[4] = arr[6]
        arr[6] = tmp
      } // (4,6)
      if (arr[8] < arr[9]) {
        tmp = arr[8]
        arr[8] = arr[9]
        arr[9] = tmp
      } // (8,9)
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
      if (arr[5] < arr[6]) {
        tmp = arr[5]
        arr[5] = arr[6]
        arr[6] = tmp
      } // (5,6)
      if (arr[7] < arr[8]) {
        tmp = arr[7]
        arr[7] = arr[8]
        arr[8] = tmp
      } // (7,8)
      // Layer 6
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
      if (arr[5] < arr[7]) {
        tmp = arr[5]
        arr[5] = arr[7]
        arr[7] = tmp
      } // (5,7)
      if (arr[6] < arr[8]) {
        tmp = arr[6]
        arr[6] = arr[8]
        arr[8] = tmp
      } // (6,8)
      // Layer 7
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
      if (arr[6] < arr[7]) {
        tmp = arr[6]
        arr[6] = arr[7]
        arr[7] = tmp
      } // (6,7)
      break

    case 11: // Network: [(0,9),(1,6),(2,4),(3,7),(5,8)], [(0,1),(3,5),(4,10),(6,9),(7,8)], [(1,3),(2,5),(4,7),(8,10)], [(0,4),(1,2),(3,7),(5,9),(6,8)], [(0,1),(2,6),(4,5),(7,8),(9,10)], [(2,4),(3,6),(5,7),(8,9)], [(1,2),(3,4),(5,6),(7,8)], [(2,3),(4,5),(6,7)] - 35 CEs
      // Layer 1
      if (arr[0] < arr[9]) {
        tmp = arr[0]
        arr[0] = arr[9]
        arr[9] = tmp
      } // (0,9)
      if (arr[1] < arr[6]) {
        tmp = arr[1]
        arr[1] = arr[6]
        arr[6] = tmp
      } // (1,6)
      if (arr[2] < arr[4]) {
        tmp = arr[2]
        arr[2] = arr[4]
        arr[4] = tmp
      } // (2,4)
      if (arr[3] < arr[7]) {
        tmp = arr[3]
        arr[3] = arr[7]
        arr[7] = tmp
      } // (3,7)
      if (arr[5] < arr[8]) {
        tmp = arr[5]
        arr[5] = arr[8]
        arr[8] = tmp
      } // (5,8)
      // Layer 2
      if (arr[0] < arr[1]) {
        tmp = arr[0]
        arr[0] = arr[1]
        arr[1] = tmp
      } // (0,1)
      if (arr[3] < arr[5]) {
        tmp = arr[3]
        arr[3] = arr[5]
        arr[5] = tmp
      } // (3,5)
      if (arr[4] < arr[10]) {
        tmp = arr[4]
        arr[4] = arr[10]
        arr[10] = tmp
      } // (4,10)
      if (arr[6] < arr[9]) {
        tmp = arr[6]
        arr[6] = arr[9]
        arr[9] = tmp
      } // (6,9)
      if (arr[7] < arr[8]) {
        tmp = arr[7]
        arr[7] = arr[8]
        arr[8] = tmp
      } // (7,8)
      // Layer 3
      if (arr[1] < arr[3]) {
        tmp = arr[1]
        arr[1] = arr[3]
        arr[3] = tmp
      } // (1,3)
      if (arr[2] < arr[5]) {
        tmp = arr[2]
        arr[2] = arr[5]
        arr[5] = tmp
      } // (2,5)
      if (arr[4] < arr[7]) {
        tmp = arr[4]
        arr[4] = arr[7]
        arr[7] = tmp
      } // (4,7)
      if (arr[8] < arr[10]) {
        tmp = arr[8]
        arr[8] = arr[10]
        arr[10] = tmp
      } // (8,10)
      // Layer 4
      if (arr[0] < arr[4]) {
        tmp = arr[0]
        arr[0] = arr[4]
        arr[4] = tmp
      } // (0,4)
      if (arr[1] < arr[2]) {
        tmp = arr[1]
        arr[1] = arr[2]
        arr[2] = tmp
      } // (1,2)
      if (arr[3] < arr[7]) {
        tmp = arr[3]
        arr[3] = arr[7]
        arr[7] = tmp
      } // (3,7)
      if (arr[5] < arr[9]) {
        tmp = arr[5]
        arr[5] = arr[9]
        arr[9] = tmp
      } // (5,9)
      if (arr[6] < arr[8]) {
        tmp = arr[6]
        arr[6] = arr[8]
        arr[8] = tmp
      } // (6,8)
      // Layer 5
      if (arr[0] < arr[1]) {
        tmp = arr[0]
        arr[0] = arr[1]
        arr[1] = tmp
      } // (0,1)
      if (arr[2] < arr[6]) {
        tmp = arr[2]
        arr[2] = arr[6]
        arr[6] = tmp
      } // (2,6)
      if (arr[4] < arr[5]) {
        tmp = arr[4]
        arr[4] = arr[5]
        arr[5] = tmp
      } // (4,5)
      if (arr[7] < arr[8]) {
        tmp = arr[7]
        arr[7] = arr[8]
        arr[8] = tmp
      } // (7,8)
      if (arr[9] < arr[10]) {
        tmp = arr[9]
        arr[9] = arr[10]
        arr[10] = tmp
      } // (9,10)
      // Layer 6
      if (arr[2] < arr[4]) {
        tmp = arr[2]
        arr[2] = arr[4]
        arr[4] = tmp
      } // (2,4)
      if (arr[3] < arr[6]) {
        tmp = arr[3]
        arr[3] = arr[6]
        arr[6] = tmp
      } // (3,6)
      if (arr[5] < arr[7]) {
        tmp = arr[5]
        arr[5] = arr[7]
        arr[7] = tmp
      } // (5,7)
      if (arr[8] < arr[9]) {
        tmp = arr[8]
        arr[8] = arr[9]
        arr[9] = tmp
      } // (8,9)
      // Layer 7
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
      if (arr[7] < arr[8]) {
        tmp = arr[7]
        arr[7] = arr[8]
        arr[8] = tmp
      } // (7,8)
      // Layer 8
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
      if (arr[6] < arr[7]) {
        tmp = arr[6]
        arr[6] = arr[7]
        arr[7] = tmp
      } // (6,7)
      break

    default:
      arr.sort((a, b) => b - a)
  }

  // Return the mutated array
  return arr
}
