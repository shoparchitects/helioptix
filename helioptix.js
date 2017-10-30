// Generic method for looping over an array and applying a function to each element
var applyLoss = function (inputArray, loss) {
  var output = inputArray.map( function(x) {
    return loss(x);
  });
  return output;
}

// Example loss functions
var loss1 = function (x) {
  return x * 0.75;
}

var loss2 = function (x) {
  return x * 0.75;
}

var loss3 = function (x) {
  return x * 0.75;
}

var round = function (x) {
  return +(x.toFixed(3));
}

// Running scenario is just applying a series of loss functions
var runHptx = function (input) {
  var output = applyLoss(input, loss1);
  output = applyLoss(output, loss2);
  output = applyLoss(output, loss3);
  output = applyLoss(output, round);
  return output;
}
