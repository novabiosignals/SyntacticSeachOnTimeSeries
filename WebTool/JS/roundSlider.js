

var circumference_r = 15;

function subject(d){
    return d;
}

function startRoundSlider(){

    var divWrapAll = document.getElementsByClassName("wrapSlider");

    for (var i = 0; i < divWrapAll.length; i++){

        var divWrap = divWrapAll[i];

        var width = divWrap.clientWidth;
        var height = divWrap.clientHeight;



        var drag = d3.drag()
            .subject(subject)
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);

        console.log(divWrap.id);

        var svg = d3.select("#" + divWrap.id + " .roundSlide")
            .append("g")
            .attr("transform", "translate(" + width/ 2 + "," + height/ 2 + ")");

        var container = svg.append("g");

        var circumference = container.append('circle')
            .attr('r', circumference_r)
            .attr('class', 'circumference');

        handle = [{
            x: 0,
            y: -circumference_r
        }];

        handle_circle = container.append("g")
            .attr("class", "dot")
            .selectAll('circle')
            .data(handle)
            .enter().append("circle")
            .attr("r", 3)
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("id", divWrap.id+"dot")
            .call(drag);
    }
}

function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this)
        .classed("dragging", true);
}

var ddsin = 0;
var ddcos = 0;

function findQuadrant(x, y){
    var Q;

    if(x > 0 && y < 0){
        Q = 1;
    }
    else if(x >0 && y > 0){
        Q = 2;
    }
    else if(x < 0 && y > 0){
        Q = 3;
    }
    else if(x < 0 && y < 0){
        Q = 4;
    }

    return Q
}

var x = 0;

function findSliderDirection(the_field, alpha, Q, step, max, min){
    //discover value of the field to be changed
    var begin = the_field.selectionStart;
    var Imin = 10000;
    var re = new RegExp(/\d+\.\d+|\d\.\d+|\d+/, "g");
    var result;
    var finalResult;
    var resultInt;
    var i;
    while (result = re.exec(the_field.value)) {
        console.log(result);
        i = result[0].length + result.index;
        if (Math.abs(i - begin) < Imin) {
            finalResult = result;
            Imin = Math.abs(result.index - begin);
        }
    }
    resultInt = finalResult[0];
    //Find if increase or decrease
    var sin = Math.sin(alpha);
    var cos = Math.cos(alpha);

    var deltaSin = sin - ddsin;
    var deltaCos = cos - ddcos;

    if((deltaSin < 0 && deltaCos > 0) && (Q === 1)){
        resultInt = checkSum(resultInt, step, "Sum", max, min);
    }
    else if((deltaSin > 0 && deltaCos < 0) && (Q === 2)) {
        resultInt = checkSum(resultInt, step, "Sum", max, min);
    }
    else if((deltaSin < 0 && deltaCos < 0) && (Q === 3)) {
        resultInt = checkSum(resultInt, step, "Sum", max, min);
    }
    else if((deltaSin > 0 && deltaCos > 0) && (Q === 4)) {
        resultInt = checkSum(resultInt, step, "Sum", max, min);
    }
    else{
        resultInt = checkSum(resultInt, step, "Sub", max, min);
    }

    console.log(resultInt);

    ddsin = sin;
    ddcos = cos;

    //change value in field
    the_field.value = [the_field.value.slice(0, finalResult.index), Math.round(resultInt*1000)/1000, the_field.value.slice(finalResult.index+finalResult[0].length)].join('');
    the_field.focus();
    the_field.selectionEnd = finalResult.index + 1;
}

function checkSum(value, step, sum, max, min){
    value = parseFloat(value);
    if(sum === "Sum"){
        if((value + step) <= max){
            return value + step;
        }
        else if((value + step) > max){
            return max;
        }
    }
    else if(sum === "Sub"){
        if((value - step) >= min){
            return value - step;
        }
        else if((value - step) < min){
            return min;
        }
    }
    else{
        //error
    }
}

function dragged(d) {

    d_from_origin = Math.sqrt(Math.pow(d3.event.x,2)+Math.pow(d3.event.y,2));

    alpha = Math.acos(d3.event.x/d_from_origin);

    d3.select(this)
        .attr("cx", d.x = circumference_r*Math.cos(alpha))
        .attr("cy", d.y = d3.event.y < 0 ? -circumference_r*Math.sin(alpha) : circumference_r*Math.sin(alpha));



    //find quadrant
    var Q = findQuadrant(d.x, d.y);

    if(this.id === "wrapSliderPPdot"){
        //find direction of sliding
        var the_field = document.getElementById("PPfield");
        findSliderDirection(the_field, alpha, Q, 0.005, 1, 0);
    }
    else if(this.id === "wrapSliderSCdot"){
        var the_field = document.getElementById("SCfield");
        findSliderDirection(the_field, alpha, Q, 0.005, 1, 0);
    }



}

function dragended(d) {
    d3.select(this)
        .classed("dragging", false);
}


