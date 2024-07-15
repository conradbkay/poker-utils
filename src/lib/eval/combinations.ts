// from thunderkid on Github https://gist.github.com/axelpale/3118596?permalink_comment_id=3945828#gistcomment-3945828

export function* combinations<T>(
  arr: T[],
  size: number
): Generator<T[], void, unknown> {
  if (size < 0 || arr.length < size) return // invalid parameters, no combinations possible

  // generate the initial combination indices
  const combIndices: number[] = Array.from(Array(size).keys())

  while (true) {
    yield combIndices.map((x) => arr[x])

    // find first index to update
    let indexToUpdate = size - 1
    while (
      indexToUpdate >= 0 &&
      combIndices[indexToUpdate] >= arr.length - size + indexToUpdate
    )
      indexToUpdate--

    if (indexToUpdate < 0) return

    // update combination indices
    for (
      let combIndex = combIndices[indexToUpdate] + 1;
      indexToUpdate < size;
      indexToUpdate++, combIndex++
    )
      combIndices[indexToUpdate] = combIndex
  }
}
