var width = window.innerWidth - 40;
var y = 10;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width);

var first = width * 0.05;
var second = width * 0.95;


//find the largest and smallest date to set the scale
var maxtime = Date.parse(alldata[0]["whenStart"]);
var maxyear = alldata[0]["whenStart"].substring(0, alldata[0]["whenStart"].indexOf("-"));
var mintime = Date.parse(alldata[0]["whenStart"]);
var minyear = alldata[0]["whenStart"].substring(0, alldata[0]["whenStart"].indexOf("-"));

var times = [];

for (var i = 1; i < alldata.length; i++) {
    var date = Date.parse(alldata[i ]["whenStart"]);
    if (date > maxtime) {
        maxtime = date;
        maxyear = alldata[i]["whenStart"].substring(0, alldata[i]["whenStart"].indexOf("-"));
    }
    if (date < mintime) {
        mintime = date;
        minyear = alldata[i]["whenStart"].substring(0, alldata[i]["whenStart"].indexOf("-"));
    }
    times.push(date);
}

maxyear = Math.ceil(parseInt(maxyear) / 10) * 10;
minyear = Math.floor(parseInt(minyear) / 10) * 10;

var thing = d3.scaleLinear()
    .domain([Date.parse(minyear), Date.parse(maxyear)])
    .range([first, second]);                    



svg.append("line")
    .attr("x1", first - 20)
    .attr("x2", second + 20)
    .attr("y1", y)
    .attr("y2", y)
    .attr("stroke-width", 5)
    .attr("stroke", "black");

var currentYear = parseInt(minyear);
while (currentYear <= maxyear) {
    svg.append("line")
        .attr("x1", function () { return thing(Date.parse(currentYear)); })
        .attr("x2", function () { return thing(Date.parse(currentYear)); })
        .attr("y1", 2)
        .attr("y2", 18)
        .attr("stroke-width", 5)
        .attr("stroke", "black");

    currentYear += 10;
}

svg.append("g")
    .selectAll("circle")
    .data(alldata)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) { return thing(Date.parse(d["whenStart"])); })
    .attr("cy", y)
    .attr("r", 5)
    .attr("fill", "white")
    .attr("stroke", "black");

