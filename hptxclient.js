var input = dni;
var sampleInput = input.slice(0, 24);
document.getElementById('output').innerHTML += "One Day DNI Sample <br>";
document.getElementById('output').innerHTML += JSON.stringify(sampleInput);
document.getElementById('output').innerHTML += "<br>---------<br>";

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
document.getElementById('output').innerHTML += "Sample Output <br>";
document.getElementById('output').innerHTML += JSON.stringify(runHptx(sampleInput));
document.getElementById('output').innerHTML += "<br>---------<br>";

var ones = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
var sumBy = function (inputArray, delta) {
  var outputArray = [];
  var outputArray2 = [];
  for (var i=0; i<inputArray.length; i = i + delta) {
    var cut = inputArray.slice(i, i + delta);
    var sum = cut.reduce((a, b) => a + b, 0);
    var periodSum = {"periodStart":i, "sum":sum};
    outputArray.push(sum);
    outputArray2.push(periodSum);
  }
  return outputArray2;
}

var output = sumBy(ones, 2);
console.log('OUTPUT', output)
document.getElementById('output').innerHTML += "Sample Output Summed by Month <br>";
document.getElementById('output').innerHTML += JSON.stringify(output);
document.getElementById('output').innerHTML += "<br>---------<br>";

var outputByMonth = sumBy(input, 30*24);
//D3 Magic:
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(outputByMonth.map(function(d) { return d.periodStart; }));
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

g.selectAll(".bar")
  .data(outputByMonth)
  .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.periodStart); })
    .attr("y", function(d) { return y(d.sum); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.sum); });
