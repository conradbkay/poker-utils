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
  let tmp // Use a single temp variable for swaps within the function scope

  // Use a switch for efficient dispatch based on array length
  switch (n) {
    case 1:
      // Length 1 array is already sorted
      break

    case 2: // 1 comparison
      if (arr[0] < arr[1]) {
        tmp = arr[0]
        arr[0] = arr[1]
        arr[1] = tmp
      }
      break

    case 3: // Optimal network: 3 comparisons
      if (arr[0] < arr[1]) {
        tmp = arr[0]
        arr[0] = arr[1]
        arr[1] = tmp
      }
      if (arr[1] < arr[2]) {
        tmp = arr[1]
        arr[1] = arr[2]
        arr[2] = tmp
      }
      if (arr[0] < arr[1]) {
        tmp = arr[0]
        arr[0] = arr[1]
        arr[1] = tmp
      }
      break

    case 4: // Optimal network: 5 comparisons
      if (arr[0] < arr[1]) {
        tmp = arr[0]
        arr[0] = arr[1]
        arr[1] = tmp
      } // c01
      if (arr[2] < arr[3]) {
        tmp = arr[2]
        arr[2] = arr[3]
        arr[3] = tmp
      } // c23
      if (arr[0] < arr[2]) {
        tmp = arr[0]
        arr[0] = arr[2]
        arr[2] = tmp
      } // c02
      if (arr[1] < arr[3]) {
        tmp = arr[1]
        arr[1] = arr[3]
        arr[3] = tmp
      } // c13
      if (arr[1] < arr[2]) {
        tmp = arr[1]
        arr[1] = arr[2]
        arr[2] = tmp
      } // c12
      break

    case 5: // Optimal network: 9 comparisons
      if (arr[0] < arr[1]) {
        tmp = arr[0]
        arr[0] = arr[1]
        arr[1] = tmp
      } // c01
      if (arr[3] < arr[4]) {
        tmp = arr[3]
        arr[3] = arr[4]
        arr[4] = tmp
      } // c34
      if (arr[2] < arr[4]) {
        tmp = arr[2]
        arr[2] = arr[4]
        arr[4] = tmp
      } // c24
      if (arr[2] < arr[3]) {
        tmp = arr[2]
        arr[2] = arr[3]
        arr[3] = tmp
      } // c23
      if (arr[0] < arr[3]) {
        tmp = arr[0]
        arr[0] = arr[3]
        arr[3] = tmp
      } // c03
      if (arr[0] < arr[2]) {
        tmp = arr[0]
        arr[0] = arr[2]
        arr[2] = tmp
      } // c02
      if (arr[1] < arr[4]) {
        tmp = arr[1]
        arr[1] = arr[4]
        arr[4] = tmp
      } // c14
      if (arr[1] < arr[2]) {
        tmp = arr[1]
        arr[1] = arr[2]
        arr[2] = tmp
      } // c12
      if (arr[3] < arr[4]) {
        tmp = arr[3]
        arr[3] = arr[4]
        arr[4] = tmp
      } // c34
      break

    case 6: // Optimal network: 12 comparisons
      if (arr[1] < arr[2]) {
        tmp = arr[1]
        arr[1] = arr[2]
        arr[2] = tmp
      } // c12
      if (arr[0] < arr[3]) {
        tmp = arr[0]
        arr[0] = arr[3]
        arr[3] = tmp
      } // c03
      if (arr[4] < arr[5]) {
        tmp = arr[4]
        arr[4] = arr[5]
        arr[5] = tmp
      } // c45

      if (arr[0] < arr[1]) {
        tmp = arr[0]
        arr[0] = arr[1]
        arr[1] = tmp
      } // c01
      if (arr[2] < arr[4]) {
        tmp = arr[2]
        arr[2] = arr[4]
        arr[4] = tmp
      } // c24
      if (arr[3] < arr[5]) {
        tmp = arr[3]
        arr[3] = arr[5]
        arr[5] = tmp
      } // c35

      if (arr[1] < arr[2]) {
        tmp = arr[1]
        arr[1] = arr[2]
        arr[2] = tmp
      } // c12
      if (arr[3] < arr[4]) {
        tmp = arr[3]
        arr[3] = arr[4]
        arr[4] = tmp
      } // c34

      if (arr[0] < arr[3]) {
        tmp = arr[0]
        arr[0] = arr[3]
        arr[3] = tmp
      } // c03
      if (arr[2] < arr[5]) {
        tmp = arr[2]
        arr[2] = arr[5]
        arr[5] = tmp
      } // c25

      if (arr[1] < arr[3]) {
        tmp = arr[1]
        arr[1] = arr[3]
        arr[3] = tmp
      } // c13
      if (arr[2] < arr[4]) {
        tmp = arr[2]
        arr[2] = arr[4]
        arr[4] = tmp
      } // c24

      if (arr[2] < arr[3]) {
        tmp = arr[2]
        arr[2] = arr[3]
        arr[3] = tmp
      } // c23
      break

    case 7: // Optimal network: 16 comparisons
      if (arr[1] < arr[2]) {
        tmp = arr[1]
        arr[1] = arr[2]
        arr[2] = tmp
      } // c12
      if (arr[3] < arr[4]) {
        tmp = arr[3]
        arr[3] = arr[4]
        arr[4] = tmp
      } // c34
      if (arr[5] < arr[6]) {
        tmp = arr[5]
        arr[5] = arr[6]
        arr[6] = tmp
      } // c56

      if (arr[0] < arr[2]) {
        tmp = arr[0]
        arr[0] = arr[2]
        arr[2] = tmp
      } // c02
      if (arr[3] < arr[5]) {
        tmp = arr[3]
        arr[3] = arr[5]
        arr[5] = tmp
      } // c35
      if (arr[4] < arr[6]) {
        tmp = arr[4]
        arr[4] = arr[6]
        arr[6] = tmp
      } // c46

      if (arr[0] < arr[1]) {
        tmp = arr[0]
        arr[0] = arr[1]
        arr[1] = tmp
      } // c01
      if (arr[4] < arr[5]) {
        tmp = arr[4]
        arr[4] = arr[5]
        arr[5] = tmp
      } // c45
      if (arr[2] < arr[6]) {
        tmp = arr[2]
        arr[2] = arr[6]
        arr[6] = tmp
      } // c26

      if (arr[0] < arr[4]) {
        tmp = arr[0]
        arr[0] = arr[4]
        arr[4] = tmp
      } // c04
      if (arr[1] < arr[5]) {
        tmp = arr[1]
        arr[1] = arr[5]
        arr[5] = tmp
      } // c15

      if (arr[0] < arr[3]) {
        tmp = arr[0]
        arr[0] = arr[3]
        arr[3] = tmp
      } // c03
      if (arr[2] < arr[5]) {
        tmp = arr[2]
        arr[2] = arr[5]
        arr[5] = tmp
      } // c25
      if (arr[1] < arr[3]) {
        tmp = arr[1]
        arr[1] = arr[3]
        arr[3] = tmp
      } // c13

      if (arr[2] < arr[4]) {
        tmp = arr[2]
        arr[2] = arr[4]
        arr[4] = tmp
      } // c24
      if (arr[3] < arr[4]) {
        tmp = arr[3]
        arr[3] = arr[4]
        arr[4] = tmp
      } // c34
      break
    default:
      arr.sort((a, b) => b - a)
  }

  // Return the mutated array
  return arr
}
