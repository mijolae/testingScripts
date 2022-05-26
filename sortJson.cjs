// make sure the format of both files are the same prior to running
const originalInput = require("./data/starterra-snapshot.json");
const toCheck = require("./data/starterra-jason.json");

const _ = require("lodash");
let equal = "";

const ordered = Object.keys(originalInput)
  .sort()
  .reduce((obj, key) => {
    obj[key] = originalInput[key];
    return obj;
  }, {});

function checkEquality(a, b) {
  const entries1 = Object.entries(a).sort();
  const entries2 = Object.entries(b).sort();

  entries1.forEach((value, index) => {
    if (entries1[index][0] != entries2[index][0]) {
      console.log("This is from originalInput: " + entries1[index][0]);
      console.log("This is from jason: " + entries2[index][0]);
      return false;
    } else if (!_.isEqual(entries1[index][1], entries2[index][1])) {
      console.log("This is from originalInput: " + entries1[index][1]);
      console.log("This is from jason: " + entries2[index][1]);
      return false;
    }
  });

  return true;
}

console.log("Sorting...");
console.log("Are the two files equal? ", checkEquality(ordered[0], toCheck[0]));
