var myData = require ('./data/tmy725033.js').dni;
//console.log(myData);
var month, day;
month = 7;
day = 8;

// var monthsJulian = [
//   {"name": "Jan", "length": 31},
//   {"name": "Feb", "length": 28},
//   {"name": "Mar", "length": 31},
//   {"name": "Apr", "length": 30},
//   {"name": "May", "length": 31},
//   {"name": "Jun", "length": 30},
//   {"name": "Jul", "length": 31},
//   {"name": "Aug", "length": 31},
//   {"name": "Sep", "length": 30},
//   {"name": "Oct", "length": 31},
//   {"name": "Nov", "length": 30},
//   {"name": "Dec", "length": 31}
// ];

var lat, lng;
lat = 32.73;
lng = -117.17;
var testFlag = false;
var t0 = new Date().getTime();
var runAOI = getAOIArray(myData, lat, lng);
var t1 = new Date().getTime();
if (testFlag) {
  console.log("Execution Time " + (t1 - t0) + " milliseconds.");
}

function getAOIArray (myData, lat, lng) {
  var AOIArray = myData.map( function(x, i) {
    return getAOIFull(i, lat, lng, testFlag);
  });
  return AOIArray;
}

function getAOIFull (i, lat, lng, testFlag) {
  var testDayNo = getDayNo(i)
  var testDec = getDeclination(testDayNo);
  var testB = getB(testDayNo);
  var testEoT = getEquationOfTime(testB);
  var testTZ = getNearestTimeZone(lng);
  var testTime = getTime(i);
  var testClockTime = getClockTime(testTime);
  var testSolarTime = getSolarTime(testClockTime, testEoT, testTZ, lng);
  var testHA = getHourAngle(testSolarTime);
  var testAlt = getAltitude(lat, testHA, testDec);
  var testAzi = getAzimuth(testAlt, testHA, testDec);
  var testAOI = getAOI (lat, testHA, testDec, 0, 0);
  if (testFlag) {
    if (i < 25) {
      console.log({"dayNo":testDayNo, "i":i, "testAOI":testAOI});
    }
  }
  return testAOI;
}

// function getDayNo (uDay, uMonth) {
//   var prevMonths = monthsJulian.filter(function (month, i) { return i < uMonth; });
//   var prevDays = prevMonths.reduce(function (acc, obj) { return acc + obj.length; }, 0);
//   var dayNo = uDay + prevDays;
//
//   return dayNo;
// }

function getDayNo (i) {
  var dayNo = Math.ceil( ( i + 1 ) / 24 );

  return dayNo;
}

function getTime (i) {
  var thisTime = ( i + 1 ) % 24;

  return thisTime;
}

function getDeclination (dayNo) {
  var declination = 23.45 * Math.sin( ( 360 * ( ( 284 + dayNo ) / 365 ) ) * Math.PI / 180 )
  return declination;
}

function getB (dayNo) {
  var thisB = 360 * ( dayNo - 81 ) / 364;
  return thisB;
}

function getEquationOfTime (thisB) {
  var equationOfTime = 9.87 * Math.sin( 2 * thisB * Math.PI / 180 ) -
                       7.53 * Math.cos( thisB * Math.PI / 180 ) -
                       1.5 * Math.sin( thisB * Math.PI / 180 );
  return equationOfTime;
}

function getNearestTimeZone (lng) {
  var nearestTimeZone = Math.round( lng / 15, 0 ) * 15;
  return nearestTimeZone;
}

function getClockTime (uTime) {
  var clockTime = ( ( uTime % 24 ) * 60 ) + 0;
  return clockTime;
}

function getSolarTime (uClockTime, uEOT, uTZ, lng) {
  var solarTime = ( uClockTime + uEOT + ( 4 * ( uTZ - lng ) ) ) / 60;
  return solarTime;
}

function getHourAngle (uSolarTime) {
  var hourAngle = ( uSolarTime * 60 - 720 ) / 4;
  return hourAngle;
}

function getAltitude (lat, uHourAngle, uDec) {
  var altitude = Math.asin(
                  Math.sin( lat * Math.PI / 180 ) *
                  Math.sin( uDec * Math.PI / 180 ) +
                  Math.cos( lat * Math.PI / 180 ) *
                  Math.cos ( uDec * Math.PI / 180 ) *
                  Math.cos( uHourAngle * Math.PI / 180 )
                 ) * 180 / Math.PI;
  return altitude;
}

function getAzimuth (alt, uHourAngle, uDec) {
  var azimuth =  Math.asin(
                  Math.cos( uDec * Math.PI / 180 ) *
                  Math.sin( uHourAngle * Math.PI / 180 ) /
                  Math.cos( alt * Math.PI / 180 )
                 ) * 180 / Math.PI;
  return azimuth;
}

function getAOI (lat, uHourAngle, uDec, altOff, aziOff) {
  var AOI = Math.acos(
    (
      Math.sin( uDec * Math.PI / 180 ) *
      (
        (
          Math.sin( lat * Math.PI / 180 ) *
          Math.cos( ( 90 - altOff ) * Math.PI / 180 )
        ) -
        (
          Math.cos( lat * Math.PI / 180 ) *
          Math.sin( ( 90 - altOff ) * Math.PI / 180 ) *
          Math.cos( aziOff * Math.PI / 180 )
        )
      )
    ) +
    (
      Math.cos( uDec * Math.PI / 180 ) *
      Math.cos( uHourAngle * Math.PI / 180 ) *
      (
        (
          Math.cos( lat * Math.PI / 180 ) *
          Math.cos( ( 90 - altOff ) * Math.PI / 180 )
        ) +
        (
          Math.sin( lat * Math.PI / 180 ) *
          Math.sin( ( 90 - altOff ) * Math.PI / 180 ) *
          Math.cos( aziOff * Math.PI / 180 )
        )
      )
    ) +
    (
      Math.cos( uDec * Math.PI / 180 ) *
      Math.sin( ( 90 - altOff ) * Math.PI / 180 ) *
      Math.sin( aziOff * Math.PI / 180 ) *
      Math.sin( uHourAngle * Math.PI / 180 )
    )
  ) * 180 / Math.PI;
  return AOI;
}
