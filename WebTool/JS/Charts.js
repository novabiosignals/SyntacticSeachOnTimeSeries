//general graph properties
var graphs = {graph0:{}, graph1:{}, graph2:{}, graph3:{}};
const bisectDate = d3.bisector(function(d){return d.x}).left;

function loadGraphs(){

    var Mwidth = document.getElementById("vis1").clientWidth;
    var Mheight = document.getElementById("vis1").clientHeight;

    var margin = {top: 10, right: 20, bottom: 10, left: Mwidth/8};

    var width = 0.75*Mwidth - margin.right,
        height = 0.8*Mheight - margin.top - margin.bottom;
    //select margins, size and append g to each
    //select scale
    var x = d3.scaleLinear()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    //define line
    var line = d3.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });

    var area = d3.area()
        .x(function(d) {return x(d.x); })
        .y1(function(d) {return y(d.y);});

    for (var i=0; i <= 3; i++){

        //svg object
        graphs["graph"+i].svg = d3.select("#visualisation"+i);
        graphs["graph"+i].margin = margin;
        graphs["graph"+i].width = width;
        graphs["graph"+i].height = height;
        graphs["graph"+i].g = graphs["graph"+i].svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        graphs["graph"+i].x = x;
        graphs["graph"+i].y = y;
        graphs["graph"+i].line = line;
        graphs["graph"+i].area = area;

        // g.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x).tickSize(-height))
//         .append("text")
//         .attr("class", "label")
//         .attr("fill", "#747474")
//         .attr("x", 925)
//         .attr("y", -5)
//         .attr("text-anchor", "end")
//         .text("Time (s)");

        graphs["graph"+i].xaxis = graphs["graph"+i].g.append("g");

        graphs["graph"+i].xtext = graphs["graph"+i].xaxis.attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .append("text")
            .attr("class", "label")
            .attr("fill", "#747474")
            .attr("x", 925)
            .attr("y", -5)
            .attr("text-anchor", "end");


        graphs["graph"+i].yaxis = graphs["graph"+i].g.append("g");


        graphs["graph"+i].ytext = graphs["graph"+i].yaxis.attr("class", "y axis")
            .append("text")
            .attr("class", "label")
            .attr("fill", "#747474")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.75em")
            .attr("text-anchor", "end");


        graphs["graph"+i].path = graphs["graph"+i].g.append("path")
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5);

    }

    addFocusPlot2(margin);
    addGradPlot2();
}

function addGradPlot2(){
    graphs["graph2"].grad = graphs["graph2"].svg.append("defs")
        .append("linearGradient")
        .attr("id", "grad");
}

function addFocusPlot2(margin){

    graphs["graph2"].focus = graphs["graph2"].svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    graphs["graph2"].focusCircle = graphs["graph2"].focus.append("circle")
        .attr("r", 4.5);

    graphs["graph2"].focusText = graphs["graph2"].focus
        .append("text")
        .attr("x", 9)
        .attr("dy", ".35em");
        // .attr("fill", "#7386d5")
        // .attr('font-family', "Lato")
        // .attr('font-weight', 'bold')
        // .attr('background-color', 'black');


    graphs["graph2"].focusRect = graphs["graph2"].svg.append("rect")
        .attr("class", "overlay")
        .attr("width", graphs["graph2"].width)
        .attr("height", graphs["graph2"].height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .on("mouseover", function() { graphs["graph2"].focus.style("display", null); })
        .on("mouseout", function() { graphs["graph2"].focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = graphs["graph2"].x.invert(d3.mouse(this)[0]);
        var i = bisectDate(SymbolicSignal, x0, 1),
            d0 = SymbolicSignal[i - 1],
            d1 = SymbolicSignal[i],
            d = x0 - d0.x > d1.x - x0 ? d1 : d0;
        var x = graphs["graph2"].x(d.x) + margin.left;
        var y = graphs["graph2"].y(PPSignal[d.x].y);
        graphs["graph2"].focus.attr("transform", "translate(" + x + "," + y + ")");
        graphs["graph2"].focusText.text(d.y);
    }
}



function plotData(data, i, alpha){

    //set axis values with RawValues (this will have to be changed dependent of each plot)
    graphs["graph"+i].x.domain(d3.extent(data, function(d) { return d.x; }));
    graphs["graph"+i].y.domain(d3.extent(data, function(d) { return d.y; }));

    //define axis
    graphs["graph"+i].xaxis.call(d3.axisBottom(graphs["graph"+i].x).tickSize(-graphs["graph"+i].height));
    graphs["graph"+i].xtext.text("Time(s)");

    graphs["graph"+i].yaxis.call(d3.axisLeft(graphs["graph"+i].y).ticks(6).tickSize(-graphs["graph"+i].width));
    graphs["graph"+i].ytext.text("Amplitude(r.u)");

    var line = graphs["graph"+i].line;

    graphs["graph"+i].path.attr("opacity", alpha)
        .attr("d", line(data));
}

function updateData(data, i, alpha){

    //set axis values with RawValues (this will have to be changed dependent of each plot)
    graphs["graph"+i].x.domain(d3.extent(data, function(d) { return d.x; }));
    graphs["graph"+i].y.domain(d3.extent(data, function(d) { return d.y; }));

    //define axis
    graphs["graph"+i].xaxis.transition()
        .duration(450)
        .call(d3.axisBottom(graphs["graph"+i].x).tickSize(-graphs["graph"+i].height));

    graphs["graph"+i].yaxis.transition()
        .duration(450)
        .call(d3.axisLeft(graphs["graph"+i].y).ticks(6).tickSize(-graphs["graph"+i].width));


    var line = graphs["graph"+i].line;

    graphs["graph"+i].svg.transition()
        .selectAll("path.line")
        .style("stroke-opacity", alpha)
        .duration(750)
        .attr("d", line(data));

    graphs["graph"+i].xtext.text("Time(s)");
    graphs["graph"+i].ytext.text("Amplitude(r.u)");
}

function addData(data, i, alpha){

    //define axis
    graphs["graph"+i].xaxis.transition()
        .duration(450)
        .call(d3.axisBottom(graphs["graph"+i].x).tickSize(-graphs["graph"+i].height));

    graphs["graph"+i].yaxis.transition()
        .duration(450)
        .call(d3.axisLeft(graphs["graph"+i].y).ticks(6).tickSize(-graphs["graph"+i].width));

    graphs["graph"+i].xtext.text("Time(s)");
    graphs["graph"+i].ytext.text("Amplitude(r.u)");

    graphs["graph"+i].area.y0(graphs["graph"+i].height);

    var line = graphs["graph"+i].line;
    var area = graphs["graph"+i].area;

    graphs["graph"+i].g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("opacity", alpha)
        .attr("stroke-width", 1.5)
        .attr("d", line(data));


    graphs["graph"+i].g.append("path")
        .attr("class", "area")
        .attr("fill", "steelblue")
        .attr("opacity", 0.5)
        .attr("d", area(data));
}

function addAreaData(data, i){

    //define axis
    graphs["graph"+i].xaxis.transition()
        .duration(450)
        .call(d3.axisBottom(graphs["graph"+i].x).tickSize(-graphs["graph"+i].height));

    graphs["graph"+i].yaxis.transition()
        .duration(450)
        .call(d3.axisLeft(graphs["graph"+i].y).ticks(6).tickSize(-graphs["graph"+i].width));

    graphs["graph"+i].xtext.text("Time(s)");
    graphs["graph"+i].ytext.text("Amplitude(r.u)");

    graphs["graph"+i].area.y0(graphs["graph"+i].height);

    var line = graphs["graph"+i].line;
    var area = graphs["graph"+i].area;

    graphs["graph"+i].g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "url(#grad)")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("opacity", 1)
        .attr("stroke-width", 2.5)
        .attr("d", line(data));


    //
    graphs["graph"+i].g.append("path")
        .attr("class", "area")
        .attr("fill", "url(#grad)")
        .attr("opacity", 0.5)
        .attr("d", area(data));
}

function resetData(i, alpha){

    graphs["graph"+i].svg.selectAll("path.line").remove();
    graphs["graph" + i].svg.selectAll("path.area").remove();

    //define line
    var line = d3.line()
        .x(function(d) { return graphs["graph"+i].x(d.x); })
        .y(function(d) { return graphs["graph"+i].y(d.y); });

    graphs["graph"+i].x.domain(d3.extent(PPSignal, function(d) { return d.x; }));
    graphs["graph"+i].y.domain(d3.extent(PPSignal, function(d) { return d.y; }));

    graphs["graph"+i].g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("opacity", alpha)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line(PPSignal));
}

function resetAreaData(i) {

    graphs["graph" + i].svg.selectAll("path.line").remove();
    graphs["graph" + i].svg.selectAll("path.area").remove();
    graphs["graph2"].grad.selectAll("stop").remove();

    //set axis values with RawValues (this will have to be changed dependent of each plot)
    graphs["graph"+i].x.domain(d3.extent(PPSignal, function(d) { return d.x; }));
    graphs["graph"+i].y.domain(d3.extent(PPSignal, function(d) { return d.y; }));
}

function SymbolicAreaGeneration(SymbolicSignal, PPSignal){
    var colors = ["#668FE3", "#4E69A0",  "#46A25A", "#3A7646", "#911f1e", "#D93A46", "#E98E95"];
    var SymbArray = [];
    var SymbStr = "";
    var result;
    var re;
    var TempSymbolicSignal = JSON.parse(JSON.stringify(SymbolicSignal));
    var grad = [];

    TempSymbolicSignal.map(function(num){
        SymbArray.push(num.y);
        SymbStr = SymbStr.concat(num.y);
    });
    var unique = {};
    unique.x = SymbArray.filter( onlyUnique );
    for(var j=0; j < unique.x.length; j++){
        console.log(unique.x[j]);
        if(unique.x[j].indexOf('+') > -1){
            unique.x[j] = unique.x[j].replace('+', '\\+');
        }
    }
    unique.color = colors.slice(0, unique.x.length);
    resetAreaData("2", 1);
    for(var i =0; i < unique.x.length; i++){
        re = new RegExp(unique.x[i]+"+", "g");
        while(result = re.exec(SymbStr)){
            grad.push({offset:(result.index/CmethodsLen)/SymbolicSignal.length, color:unique.color[i]});
            grad.push({offset:(re.lastIndex/CmethodsLen)/SymbolicSignal.length - 0.000001, color:unique.color[i]});
            // graphs["graph2"].grad.append("stop")
            //     .attr("offset",(result.index/CmethodsLen)/SymbStr.length)
            //     .attr('stop-color', unique.color[i]);
            // graphs["graph2"].grad.append("stop")
            //     .attr("offset",(re.lastIndex/CmethodsLen)/SymbStr.length)
            //     .attr('stop-color', unique.color[i]);
        }
    }

    graphs["graph2"].grad.selectAll("stop")
        .data(grad.sort(function(a,b){
            return a.offset - b.offset;
        }))
    .enter().append("stop")
        .attr("offset", function(d){return d.offset;})
        .attr("stop-color", function(d){return d.color;});

    addAreaData(PPSignal, "2");
}

function plotSC(PPSignal, SCSignal){
    var element = document.getElementById("toggleText");
    if(element.className === "active"){
        SymbolicAreaGeneration(SCSignal, PPSignal);
    }
    else{
        resetData("2", 1);
        updateData(PPSignal, "2", 1);
    }

}

function addGradient(){


}