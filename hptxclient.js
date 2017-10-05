var input = dni;
var sampleInput = input.slice(0, 24);
document.write("One Day DNI Sample <br>");
document.write(sampleInput);
document.write("<br>---------<br>");

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
document.write("Sample Output <br>");
document.write(JSON.stringify(runHptx(sampleInput)));
document.write("<br>---------<br>");

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
document.write("Sample Output Summed by Month <br>");
document.write(output);
