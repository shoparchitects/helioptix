var tmyData = require ('./data/tmy725033.js');

var input = tmyData.dni;
var sampleInput = input.slice(8, 17);
console.log(sampleInput);

var applyLoss = function (inputArray) {
  var output = inputArray.map( function(x) {
    return x * 0.9;
  });
  return output;
}
console.log(applyLoss(sampleInput));
