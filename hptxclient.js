var input = dni; // dni from data file
var sampleInput = input.slice(0, 24); //just pull out the first day to look at
document.getElementById('output').innerHTML += "One Day DNI Sample <br>";
document.getElementById('output').innerHTML += JSON.stringify(sampleInput);
document.getElementById('output').innerHTML += "<br>---------<br>";

var monthsJulian = [
  {"name": "Jan", "length": 31},
  {"name": "Feb", "length": 28},
  {"name": "Mar", "length": 31},
  {"name": "Apr", "length": 30},
  {"name": "May", "length": 31},
  {"name": "Jun", "length": 30},
  {"name": "Jul", "length": 31},
  {"name": "Aug", "length": 31},
  {"name": "Sep", "length": 30},
  {"name": "Oct", "length": 31},
  {"name": "Nov", "length": 30},
  {"name": "Dec", "length": 31}
];

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

// Example of how to run scenario
var output = runHptx(sampleInput);
document.getElementById('output').innerHTML += "Sample Output <br>";
document.getElementById('output').innerHTML += JSON.stringify(runHptx(sampleInput));
document.getElementById('output').innerHTML += "<br>---------<br>";

// Resulting output can be summed by different divisions, ex, weekly, monthy, etc...
var sumBy = function (inputArray, increment) {
  var outputArray = [];
  if (increment == "monthly") {
    delta = 31 * 24;
    var mJ = 0;
  } else {
    delta = increment;
  }
  for (var i=0; i<inputArray.length; i = i + delta) {
    if (increment == "monthly") {
      delta = monthsJulian[mJ].length * 24;
      title = monthsJulian[mJ].name;
    }
    var cut = inputArray.slice(i, i + delta);
    var sum = cut.reduce((a, b) => a + b, 0);

    var periodSum = {"barName":title, "sum":sum};
    outputArray.push(periodSum);
    mJ += 1;
  }
  return outputArray;
}

// Example of how to summarize input DNI monthly-ish
var output = sumBy(input, "monthly");
document.getElementById('output').innerHTML += "Sample Output Summed by Month <br>";
document.getElementById('output').innerHTML += JSON.stringify(output);
document.getElementById('output').innerHTML += "<br>---------<br>";

// Example of how to run scenario and summaraize results
var runScenario = runHptx(input);
var outputByMonth = sumBy(runScenario, "monthly");

// Full Year
var annualDNI = sumBy(input, 8760); //DNI Summed by Year
var dniaoi = getAOIArray (input, lat, lng, hAngle, vAngle); //Run 8760 AOA calc
var runAngleLoss = input.map(function(_,i) {
                    return input[i] * Math.cos(dniaoi[i] * Math.PI / 180);
                  }); //DNI * AOA
var annualAngleLoss = sumBy(runAngleLoss, 8760); // DNI * AOA Summed by year
var annualDNIdiff = annualDNI[0].sum - annualAngleLoss[0].sum; // DNI - DNIAOI (For pie chart formatting)
var hptxScenario = runHptx(runAngleLoss); // Apply HPTX losses to DNIAOI
var annualHptxScenario = sumBy(hptxScenario, 8760); //Sum HPTX losses by year
var annualHPTXdiff = annualAngleLoss[0].sum - annualHptxScenario[0].sum; // DNIAOI - HPTX (For pie chart formatting)
var annualPie = [{"age":"TMY3 DNI", "population":annualDNIdiff},{"age":"PLANE LIMITED DNI", "population":annualHPTXdiff}, {"age":"HPTX", "population":annualHptxScenario[0].sum}];

// Example of how to run scenario and summaraize results

var dniaoi = getAOIArray (input, lat, lng, hAngle, vAngle);
var runScenario = input.map(function(_,i) {
                    return input[i] * Math.cos(dniaoi[i] * Math.PI / 180);
                  });

var outputByMonth = sumBy(runScenario, "monthly");

//D3 Magic:
var svg = d3.select("#barChart"),
    margin = {top: 220, right: 120, bottom: 130, left: 140},
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
  .data(output)
  .enter().append("rect")
    .attr("class", "dniBar")
    .attr("x", function(d) { return x(d.barName); })
    .attr("y", function(d) { return y(d.sum); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.sum); });

g.selectAll(".outputBar")
  .data(outputByMonth)
  .enter().append("rect")
    .attr("class", "outputBar")
    .attr("x", function(d) { return x(d.barName); })
    .attr("y", function(d) { return y(d.sum); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.sum); });

/*---------*/

//var pieData = thisDataset;
var pieData = annualPie;
var svg1 = d3.select("#pieChart"),
    width = +svg1.attr("width"),
    height = +svg1.attr("height"),
    radius = Math.min(width, height) / 2,
    g = svg1.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.population; });

var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var arc = g.selectAll(".arc")
  .data(pie(pieData))
  .enter().append("g")
    .attr("class", "arc");

arc.append("path")
    .attr("d", path)
    .attr("fill", function(d) { return color(d.index); });

arc.append("text")
    .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
    .attr("dy", "0.35em")
    .text(function(d) { return d.data.age; });
