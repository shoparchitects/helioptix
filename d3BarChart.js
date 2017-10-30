function makeBarChart (thisData1, thisData2) {
  var svg = d3.select("#barChart"),
      margin = {top: 220, right: 120, bottom: 130, left: 140},
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(thisData2.map(function(d) { return d.barName; }));
  y.domain([0, d3.max(thisData2, function(d) { return d.sum; })]);

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
    .data(thisData1)
    .enter().append("rect")
      .attr("class", "dniBar")
      .attr("x", function(d) { return x(d.barName); })
      .attr("y", function(d) { return y(d.sum); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.sum); });

  g.selectAll(".outputBar")
    .data(thisData2)
    .enter().append("rect")
      .attr("class", "outputBar")
      .attr("x", function(d) { return x(d.barName); })
      .attr("y", function(d) { return y(d.sum); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.sum); });
}
