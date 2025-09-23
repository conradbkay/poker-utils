"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = void 0;
exports.combinations = combinations;
// from thunderkid on Github https://gist.github.com/axelpale/3118596?permalink_comment_id=3945828#gistcomment-3945828
function* combinations(arr, size) {
    if (size < 0 || arr.length < size)
        return; // invalid parameters, no combinations possible
    // generate the initial combination indices
    const combIndices = Array.from(Array(size).keys());
    while (true) {
        yield combIndices.map((x) => arr[x]);
        // find first index to update
        let indexToUpdate = size - 1;
        while (indexToUpdate >= 0 &&
            combIndices[indexToUpdate] >= arr.length - size + indexToUpdate)
            indexToUpdate--;
        if (indexToUpdate < 0)
            return;
        // update combination indices
        for (let combIndex = combIndices[indexToUpdate] + 1; indexToUpdate < size; indexToUpdate++, combIndex++)
            combIndices[indexToUpdate] = combIndex;
    }
}
exports.hash = {};
const indexes = [0, 1, 2, 3, 4, 5];
for (let i = 3; i <= 6; i++) {
    const useArr = indexes.slice(0, i);
    exports.hash[i] = {};
    for (let j = 2; j <= 3; j++) {
        exports.hash[i][j] = [];
        for (const combination of combinations(useArr, j)) {
            exports.hash[i][j].push(combination);
        }
    }
}
