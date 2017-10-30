var tmyData = require ('./data/tmy725033.js');

var input = tmyData.dni;
var sampleInput = input.slice(8, 17);
console.log(sampleInput);

var applyLoss = function (inputArray, loss) {
  var output = inputArray.map( function(x) {
    return loss(x);
  });
  return output;
}

var loss1 = function (x) {
  return x * 0.9;
}

var loss2 = function (x) {
  return x * 0.9;
}

var loss3 = function (x) {
  return x * 0.9;
}

var runHptx = function (input) {
  var output = applyLoss(input, loss1);
  output = applyLoss(output, loss2);
  output = applyLoss(output, loss3);
  return output;
}

console.log(runHptx(sampleInput));
