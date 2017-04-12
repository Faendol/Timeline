var width = window.innerWidth - 40;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width);

var first = width * 0.05;
var second = width * 0.95;


//find the largest and smallest date to set the scale
var maxtime = Date.parse(alldata[0]["whenStart"]);
var mintime = Date.parse(alldata[0]["whenStart"]);
var times = [];

for (var i = 1; i < alldata.length; i++) {
    var date = Date.parse(alldata[i ]["whenStart"]);
    if (date > maxtime) {
        maxtime = date;
    }
    if (date < mintime) {
        mintime = date;
    }
    times.push(date);
}

var thing = d3.scaleLinear()
    .domain([mintime, maxtime])
    .range([first, second]);                    

svg.append("line")
    .attr("x1", first)
    .attr("x2", second)
    .attr("y1", 5)
    .attr("y2", 5)
    .attr("stroke-width", 5)
    .attr("stroke", "black");

svg.append("g")
    .selectAll("circle")
    .data(alldata)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) { return thing(Date.parse(d["whenStart"])); })
    .attr("cy", 5)
    .attr("r", 5);