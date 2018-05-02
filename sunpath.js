function getAOIArray (myData, lat, lng, hAngle, vAngle) {
  var AOIArray = myData.map( function(x, i) {
    return getAOIFull(i, lat, lng, hAngle, vAngle, testFlag);
  });
  return AOIArray;
}

function getAOIFull (i, lat, lng, hAngle, vAngle, testFlag) {
  var testDayNo = getDayNo(i)
  var testDec = getDeclination(testDayNo);
  var testB = getB(testDayNo);
  var testEoT = getEquationOfTime(testB);
  var testTZ = getNearestTimeZone(lng);
  var testHour = getHour(i);
  var testClockTime = getClockTime(testHour);
  var testSolarTime = getSolarTime(testClockTime, testEoT, testTZ, lng);
  var testHA = getHourAngle(testSolarTime);
  var testAlt = getAltitude(lat, testHA, testDec);
  var testAzi = getAzimuth(testAlt, testHA, testDec);
  var testAOI = getAOI (lat, testHA, testDec, hAngle, vAngle, testAlt, testAzi);
  if (testFlag) {
    if (i < 25) {
      console.log({"dayNo":testDayNo, "i":i, "testAOI":testAOI});
    }
  }
  return testAOI;
}

// var month, day; month = 7; day = 8;
// function getDayNo (uDay, uMonth) {
//   var prevMonths = monthsJulian.filter(function (month, i) { return i < uMonth; });
//   var prevDays = prevMonths.reduce(function (acc, obj) { return acc + obj.length; }, 0);
//   var dayNo = uDay + prevDays;
//
//   return dayNo;
// }

function getDayNo (i) {
  return Math.ceil( ( i + 1 ) / 24 );
}

function getHour (i) {
  return ( i + 1 ) % 24;
}

function getDeclination (dayNo) {
  return 23.45 * Math.PI / 180 * Math.sin( 360 * ( 284 + dayNo ) / 365 * Math.PI / 180 )
}

function getB (dayNo) {
  return 360 * ( dayNo - 81 ) / 364;
}

function getEquationOfTime (thisB) {
  var equationOfTime = 9.87 * Math.sin( 2 * thisB * Math.PI / 180 ) -
                       7.53 * Math.cos( thisB * Math.PI / 180 ) -
                       1.5 * Math.sin( thisB * Math.PI / 180 );
  return equationOfTime;
}

function getNearestTimeZone (lng) {
  return Math.round( lng / 15, 0 ) * 15;
}

function getClockTime (uTime) {
  return ( ( uTime % 24 ) * 60 ) + 0;
}

function getSolarTime (uClockTime, uEOT, uTZ, lng) {
  return ( uClockTime + uEOT + ( 4 * ( uTZ - lng ) ) ) / 60;
}

function getHourAngle (uSolarTime) {
  return ( uSolarTime * 60 - 720 ) / 4;
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

function getAOI (lat, uHourAngle, uDec, altOff, aziOff, thisAlt, thisAzi) {
  //var effectiveAlt = thisAlt - altOff;
  //var effectiveAzi = thisAzi - aziOff;

  //var altLimited = (thisAlt <=0 ? 0 : (-90 < effectiveAlt && effectiveAlt < 90) ? effectiveAlt : 0 );
  //var aziLimited = (-90 < effectiveAzi && effectiveAzi < 90) ? effectiveAzi : 0;

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

  if (AOI >= 90 || thisAlt <= 0) {
    return 90;
  }
  else {
    return AOI;
  }

}
