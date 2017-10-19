/* global d3 */

//Hier declareer ik de waardes voor de linker grafiek

var svgLeft = d3.select("#SVGleft"),
    marginL = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    widthL = +svgLeft.attr("width") - marginL.left - marginL.right,
    heightL = +svgLeft.attr("height") - marginL.top - marginL.bottom;

var xL = d3.scaleBand().rangeRound([0, widthL]).padding(0.1),
    yL = d3.scaleLinear().rangeRound([heightL, 0]);

var gL = svgLeft.append("g")
    .attr("transform", "translate(" + marginL.left + "," + marginL.top + ")");


//Hier declareer ik de waardes van de rechter grafiek

var svgRight = d3.select("#SVGright"),
    marginR = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    widthR = +svgRight.attr("width") - marginR.left - marginR.right,
    heightR = +svgRight.attr("height") - marginR.top - marginR.bottom;

var xR = d3.scaleBand().rangeRound([0, widthR]).padding(0.1),
    yR = d3.scaleLinear().rangeRound([heightR, 0]);

var gR = svgRight.append("g")
    .attr("transform", "translate(" + marginR.left + "," + marginR.top + ")");

var data = d3.text('data.csv')
    .get(onload);

function onload(err, doc) {
    if (err) {
        throw err
    }

    var header = doc.indexOf('65 jaar');
    var end = doc.indexOf('Centraal Bureau voor de Statistiek') - 3;
    doc = doc.substring(header, end).trim();
    doc = doc.replace(/;+/g, ',')
    doc = doc.replace(/ +/g, ',')
    doc = doc.replace(/2014,/g, '')
    var data = d3.csvParseRows(doc, map).slice(0, 12);


    function map(d) {
        return {
            Maand: (d[2]),
            Totaal: Number(d[3]),
            Noord: Number(d[4]),
            Oost: Number(d[5]),
            West: Number(d[6]),
            Zuid: Number(d[7])
        }
    }


    //Hier vertel ik welke data grafiek 1 moet laten zien

    xL.domain(data.map(function (d) {
        return (d.Maand );
    }));
    yL.domain([0, d3.max(data, function (d) {
        return d.Totaal;
    })]);

//    gL.append("g")
//        .attr("class", "axis axis--x")
//        .attr("transform", "translate(0," + heightL + ")")
//        .call(d3.axisBottom(xL));
    
    gL.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + heightL + ")")
        .call(d3.axisBottom(xL).ticks(data.length))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "2em")
        .attr("dy", "1em");

    gL.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yL).ticks(20))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 12)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")

    gL.selectAll(".bar1")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar1")
        .attr("x", function (d) {
            return xL(d.Maand);
        })
        .attr("width", xL.bandwidth())
        .attr("y", heightL)
        .attr("height", 0)
//        .style('fill', 'blue')
        .transition()
        .duration(750)
        .delay(function (d, i) {
            return i * 100;
        })
        .attr("y", function (d) {
            return yL(d.Totaal);
        })

        .attr("height", function (d) {
            return heightL - yL(d.Totaal);
        });

//Hier maak ik een data2 variabel waar ik de data voor de rechtergrafiek in ga stoppen 
//in variabelen totalCountry 
    
    var data2 = [];
    var totalCountry = [];
    var country = '';
    data.forEach(function (d) {
        totalCountry.push(d.Maand);
    })

    country = totalCountry[0];
    data2 = data.filter(filterCountry);

    //Hieronder zoek ik binnen mijn data.csv file en pak ik de waardes die ik nodig heb voor mijn rechter grafiek
    
    var noordObject = {};
    var zuidObject = {};
    var oostObject = {};
    var westObject = {};
    var newData = [];
    noordObject["name"] = 'Noord-Nederland';
    noordObject["number"] = data2[0].Noord;
    zuidObject["name"] = 'Zuid-Nederland';
    zuidObject["number"] = data2[0].Zuid;
    oostObject["name"] = 'Oost-Nederland';
    oostObject["number"] = data2[0].Oost;
    westObject["name"] = 'West-Nederland';
    westObject["number"] = data2[0].West;
    newData.push(noordObject);
    newData.push(zuidObject);
    newData.push(oostObject);
    newData.push(westObject);

    console.log(newData);


//Hieronder vertel ik dat newData in grafiek 2 laten zien moet worden

    //    svgRight
    xR.domain(newData.map(function (d) {
        return d.name;
    }));
    yR.domain([0, d3.max(data, function (d) {
        return d.Totaal;
    })]);

    //  gR.append("g")
    //      .attr("class", "axis axis--x")
    //      .attr("transform", "translate(0," + heightR + ")")
    //      .call(d3.axisBottom(xR));

    //    gR.append("g")
    //        .attr("class", "axis axis--x")
    //        .attr("transform", "translate(0," + heightL + ")")
    //        .call(d3.axisBottom(xL))
    //        .selectAll("text")
    //        .style("text-anchor", "end")
    //        .attr("dx", "2em")
    //        .attr("dy", "1em");

//    gR.append("g")
//        .attr("class", "axis axis--y")
//        .call(d3.axisLeft(yL).ticks(5))
//        .append("text")
//        .attr("transform", "rotate(-90)")
//        .attr("y", 3)
//        .attr("dy", "0.71em")
//        .attr("text-anchor", "end")
//        .attr("transform", "rotate(-90)")
//        .text("Overledenen");
//
//    gR.append("g")
//        .attr("class", "axis axis--y")
//        .call(d3.axisLeft(yR).ticks(10))
//        .append("text")
//        .attr("transform", "rotate(-90)")
//        .attr("y", 6)
//        .attr("dy", "0.71em")
//        .attr("text-anchor", "end")
//        .text("Frequency");
    
    gR.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yR).ticks(5))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
    
    gR.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + heightR + ")")
        .call(d3.axisBottom(xR))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "1em")
        .attr("dy", "1em");


    gR.selectAll(".bar2")
        .data(newData)
        .style('fill', 'red')
        .enter().append("rect")
        .attr("class", "bar2")
        .attr("x", function (d) {
            return xR(d.name);
        })
        .attr("y", function (d) {
            return yR(d.number);
        })
        .attr("width", xR.bandwidth())
        .attr("height", function (d) {
            return heightR - yR(d.number);
        });

    //  gR.selectAll(".bar")
    //    .data(data)
    //    .enter().append("rect")
    //      .attr("class", "bar")
    //      .attr("x", function(d) { return xR(d.Maand); })
    //      .attr("y", function(d) { return yR(d.Totaal); })
    //      .attr("width", xR.bandwidth())
    //      .attr("height", function(d) { return heightR - yR(d.Totaal); });


    // hieronder maak ik een click event aan die er voor gaat zorgen dat als ik op een bar klik, dat de data van Noord, Zuid, Oost en West wordt laten zien.

    d3.selectAll(".bar1").on('click', onChange);

    // In de function hieronder wordt er een class active toegevoegd die er voor zorgt dat de data uit de geklikte bar 'active' wordt en getoond wordt.

    function onChange(e) {
        country = e.Maand;
        this.classList.add("active");
        data2 = [];
        newData = [];
        data2 = data.filter(filterCountry);
        noordObject["name"] = "Noord-Nederland";
        noordObject["number"] = data2[0].Noord;
        zuidObject["name"] = "Zuid-Nederland";
        zuidObject["number"] = data2[0].Zuid;
        oostObject["name"] = "Oost-Nederland";
        oostObject["number"] = data2[0].Oost;
        westObject["name"] = "West-Nederland";
        westObject["number"] = data2[0].West;
        newData.push(noordObject);
        newData.push(zuidObject);
        newData.push(oostObject);
        newData.push(westObject);


        var barElement = gR.selectAll(".bar2")
            .data(newData);
        barElement.transition().duration(750)
            .attr("class", "bar2")
            .attr("x", function (d) {
                return xR(d.name);
            })
            .attr("y", function (d) {
                return yR(d.number);
            })
            .attr("width", xR.bandwidth())
            .attr("height", function (d) {
                return heightR - yR(d.number);
            });
    }

    function filterCountry(d) {
        return (d.Maand === country);
    };
    
    
    
     d3.select("input").on("change", change);

  var sorteer = (function() {
    d3.select("input").property("checked", true).each(change);
  });

  function change() {
    clearTimeout(sorteer);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = xL.domain(data.sort(this.checked
        ? function(a, b) { return b.Totaal - a.Totaal; }
        : function(a, b) { return d3.ascending(a.Maand, b.Maand); })
        .map(function(d) { return d.Maand; }))
        .copy();
      

    svgLeft.selectAll(".bar1")
        .sort(function(a, b) { return x0(a.Maand) - x0(b.Maand); });

    var transition = svgLeft.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar1")
        .delay(delay)
        .attr("x", function(d) { return x0(d.Maand); });
      

    transition.selectAll(".axis--x")
        .call(d3.axisBottom(xL))
      .selectAll("g")
        .delay(delay);
  }
};

    
    