var width = window.innerWidth - 40;
var y = 32;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width);

var first = width * 0.05;
var second = width * 0.95;

var lines = svg.append("g");
var circles = svg.append("g");
var dates = svg.append("g");

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

var currentYear = parseInt(minyear);
var count = 9;
while (currentYear <= maxyear) {
    if (count === 9) {
        lines.append("line")
            .attr("x1", function () { return thing(Date.parse(currentYear)); })
            .attr("x2", function () { return thing(Date.parse(currentYear)); })
            .attr("y1", y - 10)
            .attr("y2", y + 10)
            .attr("stroke-width", 5)
            .attr("stroke", "black");

        dates.append("text")
            .attr("x", function () { return thing(Date.parse(currentYear)); })
            .attr("y", y - 11)
            .attr("text-anchor", "middle")
            .attr("pointer-events", "none")
            .text(currentYear);
        count = -1;
    }
    else {
        lines.append("line")
            .attr("x1", function () { return thing(Date.parse(currentYear)); })
            .attr("x2", function () { return thing(Date.parse(currentYear)); })
            .attr("y1", y - 5)
            .attr("y2", y + 5)
            .attr("stroke-width", 5)
            .attr("stroke", "#424242");
    }

    count++;
    currentYear += 1;
}

var tooltip = d3.select("body")
    .append("div")
    .classed("tooltip", true)
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "lightsteelblue")
    .style("border-style", "solid")
    .style("padding", "2px")
    .style("border-radius", "8px")
    .style("white-space", "pre-wrap")
    .text("a simple tooltip");

lines.append("line")
    .attr("x1", first)
    .attr("x2", second)
    .attr("y1", y)
    .attr("y2", y)
    .attr("stroke-width", 5)
    .attr("stroke", "black");

circles
    .selectAll("circle")
    .data(alldata)
    .enter()
    .append("g")
    .append("circle")
    .attr("cx", function (d, i) {
        if (d["whenEnd"] !== "") {
            lines.append("line").attr("y1", y).attr("y2", y).attr("x1", function () { return thing(Date.parse(d["whenStart"])); }).attr("x2", function () { return thing(Date.parse(d["whenEnd"])); }).attr("stroke", "white").attr("stroke-linecap", "round").attr("stroke-width", 3);
        }
        return thing(Date.parse(d["whenStart"]));
    })
    .attr("cy", y)
    .attr("r", 5)
    .attr("fill", "white")
    .attr("stroke-width", 2)
    .attr("stroke", "black")
    .each(function (d, i) {
        if (i % 2 === 0) {
            d3.select(this.parentElement)
                .append("path")
                .attr("d", "M 34 29 L 34 10 L 30 10 L 30 28 L 24 42 L 40 42")
                .attr("fill", "#424242")
                .attr("transform", function () { return "translate(" + (thing(Date.parse(d["whenStart"])) - 32) + "," + (y - 6) + ")"; });
        }
        else
        {
            d3.select(this.parentElement)
                .append("path")
                .attr("d", "M 34 24 L 40 10 L 24 10 L 30 24 L 30 42 L 34 42")
                .attr("fill", "#424242")
                .attr("transform", function () { return "translate(" + (thing(Date.parse(d["whenStart"])) - 32) + "," + (y - 46) + ")"; });
        }

        d3.select(this.parentElement)
            .on("mouseover", function (d) {
                var stringz = d["whatTitle"] + "<br/>" + d["whatDesc"] + "<br/>" + d["source"] + "<br/>" + d["whenStart"].substring(0, d["whenStart"].indexOf("T"));


                if (d["whenEnd"] !== "") {
                    stringz += " to " + d["whenEnd"].substring(0, d["whenEnd"].indexOf("T"));
                }

                tooltip.style("visibility", "visible");
                //tooltip.text(stringz);
                tooltip.html(stringz);
            })
            .on("mousemove", function () { tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); tooltip.style("max-width", function () { return (width - d3.event.pageX) + "px";});})
            .on("mouseout", function (d) { tooltip.html(""); tooltip.style("visibility", "hidden");});

    });

//svg.append("g")
//    .selectAll("line")
//    .data(alldata)
//    .enter()
//    .append("line")
//    .attr("x1", function (d, i) { return thing(Date.parse(d["whenStart"])); })
//    .attr("x2", function (d, i) { return thing(Date.parse(d["whenStart"])); })
//    .attr("y1", y)
//    .attr("y2", function (d, i) { return y + 50 + (i * 50);})
//    .attr("stroke-width", 2)
//    .style("stroke", "black");

