function testCalcPage () {
   var t0 = new Date().getTime();
   calcPage();
   var t1 = new Date().getTime();
   if (testFlag) {
     console.log("Execution Time " + (t1 - t0) + " milliseconds.");
   }
}

function calcPage () {
  // 0 - Clear Previous Running, get new inputs
    document.getElementById('output').innerHTML = "";
    document.getElementById('barChart').innerHTML = "";
    document.getElementById('pieChart').innerHTML = "";
    vAngle = document.getElementById("ctrlVER").value;
    hAngle = document.getElementById("ctrlHOR").value;
    var incLine = document.getElementById('incLine');
    incLine.setAttribute('transform', "rotate(" + vAngle + " 100 100)");
    var horLine = document.getElementById('horLine');
    horLine.setAttribute('transform', "rotate(" + hAngle + " 200 100)");

  // 1 - Example of a single day of DNI
    var sampleInput = input.slice(0, 24);
    document.getElementById('output').innerHTML += "1 - Example of a single day of DNI <br>";
    document.getElementById('output').innerHTML += JSON.stringify(sampleInput);
    document.getElementById('output').innerHTML += "<br>---------<br>";

  // 2 - Example of how to run scenario
    var output = runHptx(sampleInput);
    document.getElementById('output').innerHTML += "2 - Sample Output <br>";
    document.getElementById('output').innerHTML += JSON.stringify(runHptx(sampleInput));
    document.getElementById('output').innerHTML += "<br>---------<br>";

  // 3 - Example of how to summarize input DNI monthly-ish
    var output = sumBy(input, "monthly");
    document.getElementById('output').innerHTML += "3 - Sample Output Summed by Month <br>";
    document.getElementById('output').innerHTML += JSON.stringify(output);
    document.getElementById('output').innerHTML += "<br>---------<br>";

  // 4 - Example of how to run scenario and summarize results (No visual Output)
    var runScenario = runHptx(input);
    var outputByMonth = sumBy(runScenario, "monthly");

  // 5 - Example of how calculate AOI, summarize plane-limited results monthy, and make a bar chart
    var anglesAOI = getAOIArray (input, lat, lng, hAngle, vAngle);
    var dniAOI = input.map(function(_,i) {
                        return input[i] * Math.cos(anglesAOI[i] * Math.PI / 180);
                      });
    var outputByMonth = sumBy(dniAOI, "monthly");
    //D3 Magic:
    makeBarChart(output, outputByMonth);

  // 6 - Example of how to summarize results annually and make a pie chart
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
    var annualPie = [
      {"age":"TMY3 DNI", "population":annualDNIdiff, "colorKey":"DNI"},
      {"age":"PLANE LIMITED DNI", "population":annualHPTXdiff, "colorKey":"AOI"},
      {"age":"HPTX", "population":annualHptxScenario[0].sum, "colorKey":"HPTX"}
    ];
    //D3 Magic:
    makePieChart(annualPie, pieColor2);

}
