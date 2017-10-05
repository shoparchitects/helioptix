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

var round = function (x) {
  return +(x.toFixed(3));
}

var runHptx = function (input) {
  var output = applyLoss(input, loss1);
  output = applyLoss(output, loss2);
  output = applyLoss(output, loss3);
  output = applyLoss(output, round);
  return output;
}

var output = runHptx(sampleInput);
console.log(JSON.stringify(runHptx(sampleInput)));

var ones = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var sumBy = function (inputArray, delta) {
  var outputArray = [];
  for (var i=0; i<inputArray.length; i = i + delta) {
    var cut = inputArray.slice(i, i + delta);
    var sum = cut.reduce((a, b) => a + b, 0);
    outputArray.push(sum);
  }
  return outputArray;
}

var output = sumBy(input, 30*24);
console.log(output);
