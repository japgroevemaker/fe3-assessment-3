# Assesment 3
Voor assesment 3 heb ik deze bar chart gekozen van de d3 gallery op github [Barchart](https://bl.ocks.org/mbostock/3885304)
Vervolgens ben ik op het CBS gaan zoeken naar een bruikbare dataset. Dat is deze geworden [Link naar dataset](http://statline.cbs.nl/statweb/publication/?vw=t&dm=slnl&pa=37506wwm&d1=0-4&d2=0&d3=0&d4=(l-24)-l&hd=080402-1211&hdr=t&stb=g1,g2,g3)

Voor de sort functie heb ik code gepakt van deze barchart [Link naar sort barchart](https://bl.ocks.org/mbostock/3885705)

Daarnaast heb ik veel hulp gehad van Bjorn Volkers en Dennis Spierenburg

## Werkwijze
Omdat ik 2 barcharts wil laten zien, ben ik eerst begonnen met het declareren van beide. In de HTML heb ik beide een id gegeven en daarna ben ik ze binnen de javascript gaan aanroepen.

```js
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
    ````
    
Toen heb ik de code getypt die mijn dataset aanroept

```js
var data = d3.text('data.csv')
    .get(onload);
    ```

Daarna ben ik bezig gegaan met het opschonen van de data. Dit heb ik gedaan door dit stuk code toe te voegen.

```js
var header = doc.indexOf('65 jaar');
    var end = doc.indexOf('Centraal Bureau voor de Statistiek') - 3;
    doc = doc.substring(header, end).trim();
    doc = doc.replace(/;+/g, ',')
    doc = doc.replace(/ +/g, ',')
    doc = doc.replace(/2014,/g, '')
    var data = d3.csvParseRows(doc, map).slice(0, 12);
    ```
    
Ik heb de ```.slice``` gebruikt om de data van het jaar 2014 er tussenuit te halen.

Daarna heb ik gedeclareerd wat voor soort data er uit de ```data.csv``` file gehaald moet worden

```js
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
    ```
    
    Hier vertel ik welke data er in mijn rechter grafiek getoond moet worden
    
    ```js
    xL.domain(data.map(function (d) {
        return (d.Maand );
    }));
    yL.domain([0, d3.max(data, function (d) {
        return d.Totaal;
    })]);
    ```
    
Daarna ben ik mijn grafiek verder gaan bouwen
    ```js
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
        ```

Vervolgens heb ik een variabelen ```data2``` aangemaak waar ik de data voor grafiek 2 in ga stoppen. Daarna heb ik er voor gezorgd dat de benodigde data uit mijn data.csv file gepakt gaat worden.


```js
var data2 = [];
    var totalCountry = [];
    var country = '';
    data.forEach(function (d) {
        totalCountry.push(d.Maand);
    })
    
    country = totalCountry[0];
    data2 = data.filter(filterCountry);
    
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
    ```
    
Vervolgens heb ik er voor gezorgd dat als men op de linker grafiek bij het totaal klikt, dat er dan in de rechtergrafiek de waardes per landdeel worden laten zien.

```js
d3.selectAll(".bar1").on('click', onChange);
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
    ```
    
Daarna heb ik er ook nog voor gezorgd dat de bars van de linker grafiek gesorteerd kunnen worden

```js
d3.select("input").on("change", change);

  var sorteer = (function() {
    d3.select("input").property("checked", true).each(change);
  });
function change() {
    clearTimeout(sorteer);
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
  ```
    
    
