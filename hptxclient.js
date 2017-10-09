var input = dni; // dni from data file
var sampleInput = input.slice(0, 24); //just pull out the first day to look at
document.getElementById('output').innerHTML += "One Day DNI Sample <br>";
document.getElementById('output').innerHTML += JSON.stringify(sampleInput);
document.getElementById('output').innerHTML += "<br>---------<br>";

// Generic method for looping over an array and applying a function to each element
var applyLoss = function (inputArray, loss) {
  var output = inputArray.map( function(x) {
    return loss(x);
  });
  return output;
}

// Example loss functions
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

// Running scenario is just applying a series of loss functions
var runHptx = function (input) {
  var output = applyLoss(input, loss1);
  output = applyLoss(output, loss2);
  output = applyLoss(output, loss3);
  output = applyLoss(output, round);
  return output;
}

// Example of how to run scenario
var output = runHptx(sampleInput);
document.getElementById('output').innerHTML += "Sample Output <br>";
document.getElementById('output').innerHTML += JSON.stringify(runHptx(sampleInput));
document.getElementById('output').innerHTML += "<br>---------<br>";

// Resulting output can be summed by different divisions, ex, weekly, monthy, etc...
// outputArray and outputArray2 are just playing with different output formats.  Don't need both ultimately.
var sumBy = function (inputArray, delta) {
  var outputArray = [];
  var outputArray2 = [];
  for (var i=0; i<inputArray.length; i = i + delta) {
    var cut = inputArray.slice(i, i + delta);
    var ogCut = input.slice(i, i + delta);

    var sum = cut.reduce((a, b) => a + b, 0);
    var ogSum = ogCut.reduce((a, b) => a + b, 0);
    outputArray.push(sum);

    var periodSum = {"barName":i, "ogSum":ogSum, "sum":sum};
    outputArray2.push(periodSum);
  }
  return outputArray2;
}

// Example of how to summarize input DNI monthly-ish
var output = sumBy(input, 30*24);
console.log('OUTPUT', output)
document.getElementById('output').innerHTML += "Sample Output Summed by Month <br>";
document.getElementById('output').innerHTML += JSON.stringify(output);
document.getElementById('output').innerHTML += "<br>---------<br>";

// Example of how to run scenario and summaraize results
var runScenario = runHptx(input);
var outputByMonth = sumBy(runScenario, 30*24);

//D3 Magic:
var svg = d3.select("svg"),
    margin = {top: 120, right: 120, bottom: 130, left: 140},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(outputByMonth.map(function(d) { return d.barName; }));
y.domain([0, d3.max(outputByMonth, function(d) { return d.sum; })]);

g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10))
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Frequency");

g.selectAll(".dniBar")
  .data(outputByMonth)
  .enter().append("rect")
    .attr("class", "dniBar")
    .attr("x", function(d) { return x(d.barName); })
    .attr("y", function(d) { return y(d.ogSum); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.ogSum); });

g.selectAll(".outputBar")
  .data(outputByMonth)
  .enter().append("rect")
    .attr("class", "outputBar")
    .attr("x", function(d) { return x(d.barName); })
    .attr("y", function(d) { return y(d.sum); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.sum); });
