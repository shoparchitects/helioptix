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
