onload=function(){ attachHandlers(); };

//should have global Signal
var RawSignal,
    PPSignal;

//should have global String
var SymbolicSignal;

//general timer for actions in the input boxes
var timeout = null;
var dt = 500;

function attachHandlers(){

    //for forms
    var formPP = document.getElementById("formPP");
    formPP.addEventListener('submit', function(){
        getValue('PPfield');
    });
    var formSC = document.getElementById("formSC");
    formSC.addEventListener('submit', function(){
        getValue('SCfield');
    });


    //for inputs
    var inputPP = document.getElementById("PPfield");
    inputPP.addEventListener('click', function(){
        showDiv("keypadPP");
    });

    inputPP.addEventListener("input", function(){
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            InputParser4Methods("ppdisplay", inputPP.value)}
            , dt)
    });

    var inputSC = document.getElementById("SCfield");
    inputSC.addEventListener('click', function() {
        showDiv("keypadSC");
    });
    inputSC.addEventListener("input", function(){
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            InputParser4Methods("scdisplay", inputSC.value)
        }, dt);
        // var screader = document.getElementById("scdisplay");
        // screader.innerText = inSC.value;
    });

    //for input oninput changes
    var inputS = document.getElementById("Sfield");

    inputS.addEventListener("input", function(){
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            Search(inputS.value)}
            , dt)
        // var sreader = document.getElementById("search");
        // sreader.innerText = inS.value;
    });

    //for buttons
    var PPbtns = document.getElementsByName("PP");
    var SCbtns = document.getElementsByName("SC");

    for (var i=0; i < PPbtns.length; i++) {
        PPbtns[i].addEventListener('click', function (d) {
            inputNumbers("PPfield", d.target.value);
            clearTimeout(timeout);
            timeout = setTimeout(function(){
                InputParser4Methods("ppdisplay", inputPP.value)}
                ,dt);
        });
    }

    for (var j=0; j < SCbtns.length; j++) {
        SCbtns[j].addEventListener('click', function (d) {
            inputNumbers("SCfield", d.target.value);
            clearTimeout(timeout);
            timeout = setTimeout(function(){
                InputParser4Methods("scdisplay", inputSC.value)}
                , dt);
        });
    }
}

function inputNumbers(field, value) {
    var the_field = document.getElementById(field);
    console.log(the_field);
    var the_value = value;
    console.log(the_value);
    switch (the_value) {
        case '+/-' :
            the_field.value = Number(the_field.value) * -1;
            break;
        default : the_field.value += the_value;
            break;
    }
    the_field.focus();
    return true;
}

function getValue(field) {
    console.log(document.getElementById(field).value);
    alert(document.getElementById(field).value);
    document.getElementById(field).focus();
    return false;
}

function showDiv(keypad){
// var buttons = document.getElementsByClassName("btns");
// for (var i=0; i<buttons.length; i++){
//     buttons[i].style.display = "inline-block";
// }

    var popup = document.getElementById(keypad);

    popup.classList.toggle("show");
}


function FileLoader(){
    console.log("Hello there");
    var x = document.getElementById("loadFile");
    var txt = "";

    readFile(x.files[0]);


    // if ('files' in x) {
    //     if (x.files.length == 0) {
    //         txt = "Select one or more files.";
    //     } else {
    //         for (var i = 0; i < x.files.length; i++) {
    //             txt += "<br><strong>" + (i+1) + ". file</strong><br>";
    //             var file = x.files[i];
    //             if ('name' in file) {
    //                 txt += "name: " + file.name + "<br>";
    //             }
    //             if ('size' in file) {
    //                 txt += "size: " + file.size + " bytes <br>";
    //             }
    //         }
    //     }
    // }
    // else {
    //     if (x.value == "") {
    //         txt += "Select one or more files.";
    //     } else {
    //         txt += "The files property is not supported by your browser!";
    //         txt  += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead.
    //     }
    // }
    // console.log(txt);

}

var firstRead = 1;

function bouncer(arr) {
    return arr.filter(Boolean);
}

function readFile(fileInput) {
    var fileDisplayArea = document.getElementById('fileDisplay');
    var textype = /text.*/;
    //clean data
    var Data = [];

    if (fileInput.type.match(textype)) {
        var reader = new FileReader();

        reader.onload = function (e) {
            // fileDisplayArea.innerText = reader.result;

            var txt = reader.result;
            var lines = txt.split("\n");

            for (var i=0; i < lines.length;i++){


                if(lines[i].indexOf('#') > -1){
                    console.log(lines[i]);
                    console.log(i);
                    console.log('header');
                }
                else{
                    // console.log(lines[i].split("\t")[2]);
                    line = lines[i].split('\t');
                    if(!isNaN(line[2])){
                        Data.push({
                            x: +line[0],
                            y: +line[2]
                        });
                    }
                }
            }

            if(firstRead){
                plotData(Data, "1");
                plotData(Data, "2");
            }
            else{
                // updateData(Data);
                // console.log(mean(Data));
            }
            RawSignal = Data;
        };

        reader.readAsText(fileInput, "UTF-8");
    }
    else {
        fileDisplayArea.innerText = "File not supported!"
    }
}


function plotData(data, n){
    firstRead = 0;
    var svg = d3.select("#visualisation"+n),
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var parseTime = d3.timeParse("%d-%b-%y");

    var x = d3.scaleLinear()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });

    x.domain(d3.extent(data, function(d) { return d.x; }));
    y.domain(d3.extent(data, function(d) { return d.y; }));

    g.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();

    g.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Amplitude (r.u.)");

    g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line(data));
}

function updateData(data){

    var svg = d3.select("#visualisation2"),
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });

    x.domain(d3.extent(data, function(d) { return d.x; }));
    y.domain(d3.extent(data, function(d) { return d.y; }));

    svg.transition()
        .select(".line")
        .duration(750)
        .attr("d", line(data));

    svg.select(".xaxis")
        .transition()
        .duration(100)
        .call(d3.axisBottom(x));

    svg.select(".yaxis")
        .transition()
        .duration(100)
        .call(d3.axisLeft(y));
}


function mean(array){

    var sumD = array.reduce(addO, 0);

    return sumD/array.length;
}

function addO(a, b) {
    return (a + b.y);
}

function add(a, b) {
    return (a + b);
}



function findpeaks(){
    var maxes = [];
    for (var i = 1; i < a.length - 1; ++i) {
        if (a[i - 1] < a[i] && a[i] > a[i + 1])
            maxes.push(a[i])
    }
}

//Methods for Pre-Processing


function convolve(data, win_size){
    var win = [];
    for(var i = 0; i < win_size; i++){
        win.push(data[i].y * windowing.hann(i, win_size));
    }
    return win.reduce(function (sum, value) {return sum+value; }, 1);
}

function variance(array){
    var mValue = mean(array);
    var varc = array.map(function(num) {
        return Math.pow(num.y - mValue, 2);
    });
    return varc.reduce(add, 0)/varc.length;
}

function std(array){
    return Math.sqrt(variance(array));
}

var windowing={
    hann:		function (n, points) { return 0.5 - 0.5*Math.cos(2*Math.PI*n/(points-1)); },
    hamming:	function (n, points) { return 0.54 - 0.46*Math.cos(2*Math.PI*n/(points-1)); },
    cosine:		function (n, points) { return Math.sin(Math.PI*n/(points-1)); },
    lanczos:	function (n, points) { return Math.sinc((2*n/(points-1))-1); },
    gaussian:	function (n, points, alpha) {
        if (!alpha) { alpha = 0.4; }
        return Math.pow(Math.E, -0.5*Math.pow((n-(points-1)/2)/(alpha*(points-1)/2), 2));
    },
    tukey:		function (n, points, alpha) {
        if (!alpha) { alpha = 0.5; }

        if (n < 0.5*alpha*(points-1)) {
            return 0.5*(1+(Math.cos(Math.PI*((2*n/(alpha*(points-1)))-1))));
        } else if (n < (1-(0.5*alpha))*(points-1)) {
            return 1;
        } else {
            return 0.5*(1+(Math.cos(Math.PI*((2*n/(alpha*(points-1)))+1-(2/alpha)))));
        }
    },
    blackman:	function (n, points, alpha) {
        if (!alpha) { alpha = 0.16; }
        return 0.42 - 0.5*Math.cos(2*Math.PI*n/(points-1)) + 0.08*Math.cos(4*Math.PI*n/(points-1));
    },
    exact_blackman:	function (n, points) {
        return 0.4243801 - 0.4973406*Math.cos(2*Math.PI*n/(points-1)) + 0.0782793*Math.cos(4*Math.PI*n/(points-1));
    },
    kaiser:		function (n, points, alpha) {
        if (!alpha) { alpha = 3; }
        return Math.bessi0(Math.PI*alpha*Math.sqrt(1-Math.pow((2*n/(points-1))-1, 2))) / Math.bessi0(Math.PI*alpha);
    },
    nuttall:	function (n, points) {
        return 0.355768 - 0.487396*Math.cos(2*Math.PI*n/(points-1))
            + 0.144232*Math.cos(4*Math.PI*n/(points-1))
            - 0.012604*Math.cos(6*Math.PI*n/(points-1));
    },
    blackman_harris:function (n, points) {
        return 0.35875 - 0.48829*Math.cos(2*Math.PI*n/(points-1))
            + 0.14128*Math.cos(4*Math.PI*n/(points-1))
            - 0.01168*Math.cos(6*Math.PI*n/(points-1));
    },
    blackman_nuttall:function (n, points) {
        return 0.3635819 - 0.3635819*Math.cos(2*Math.PI*n/(points-1))
            + 0.1365995*Math.cos(4*Math.PI*n/(points-1))
            - 0.0106411*Math.cos(6*Math.PI*n/(points-1));
    },
    flat_top:	function (n, points) {
        return 1 - 1.93*Math.cos(2*Math.PI*n/(points-1))
            + 1.29*Math.cos(4*Math.PI*n/(points-1))
            - 0.388*Math.cos(6*Math.PI*n/(points-1))
            + 0.032*Math.cos(8*Math.PI*n/(points-1));
    }
};

//----------------------------------------------------------------------------------------------------------------------
//Pre Processing Methods
//----------------------------------------------------------------------------------------------------------------------
//in each method it will start with the Pre-Processing Signal
function LowPassFilter(a, b){
    console.log("here");
    console.log("LowPassFilter executing with: " + a + " and " + b);
}

function BandPassFilter(a, b, c){
    console.log("here");
    console.log("BandPassFilter executing with: " + a + " and " + b + " and " + c);
}

function HighPassFilter(a, b){
    console.log("here");
    console.log("HighPassFilter executing with: " + a + " and " + b);
}

function Whitening(){
    var array = PPSignal;

    var mA = mean(array);

    var stdA = std(array);

    PPSignal = array.map(function (num) {
        return {x:num.x, y:(num.y - mA)/stdA}
    });

    updateData(PPSignal);
}

function Modulus(){
    var array = PPSignal;

    PPSignal = array.map(function(num){
        return {x:num.x, y:Math.abs(num.y)}
    });

    updateData(PPSignal);
}

function smooth(win_size){
    var array = PPSignal;
    //create mirrored array:
    var MirArray = [];
    var wS = win_size/2 >> 0;
    MirArray = MirArray.concat(array.slice(0,wS).reverse());
    MirArray = MirArray.concat(array);
    MirArray = MirArray.concat(array.slice(array.length - wS, array.length).reverse());

    var SmArray = [];

    for(var i = wS; i < array.length + wS;i++){

        var smValue = convolve(MirArray.slice(i-wS, i+wS), win_size);
        SmArray.push({x:array[i-wS].x, y:smValue});
    }

    PPSignal = SmArray;

    updateData(PPSignal);

    // return PPSignal;
}


//----------------------------------------------------------------------------------------------------------------------
//  Symbolic Connotation Methods
//----------------------------------------------------------------------------------------------------------------------

function Amp(thr){
    var Symbarray = [{x:0, y:10}, {x:1, y:20}, {x:2, y:100},  {x:3,y:1}, {x:4,y:25}, {x:5,y:45}, {x:6, y:25}];
    //threshold in percentage
    var t = ((maxObject(Symbarray) - minObject(Symbarray))*thr) + (minObject(Symbarray));
    Symbarray = Symbarray.isHigherThan(t);

    console.log(Symbarray);
}

function AmpDif(a){
    console.log("here");
    console.log("AmpDif executing with: " + a);
}

function Derivative2(a){
    console.log("here");
    console.log("Derivative2 executing with: " + a);
}

function Derivative(a){
    console.log("here");
    console.log("Derivative executing with: " + a);
}

function maxObject(arr){
    return arr.reduce(function(a, b){
        return Math.max(a.y, b.y);
    });
}

function minObject(arr){
    return arr.reduce(function(a, b){
        return Math.min(a.y, b.y);
    });
}

function isHigherThan(value){
    return function(element, index, array){
        if(element.y > value){
            return "1";
        }
        else{
            return "0";
        }
    };
}

var globalDict = {
    "PP":{
        "☴":{func: "LowPassFilter", n:2},
        "☲":{func: "BandPassFilter", n:3},
        "☱":{func: "HighPassFilter", n:2},
        "∼": {func: "smooth", n:1},
        "∥":{func: "Modulus", n:0},
        "⊚":{func:"Whitening", n:0}
    },
    "SC":{
        "⇞":{func: "Amp", n:1},
        "↕":{func: "AmpDif", n:1},
        "‡":{func: "Derivative2", n:1},
        "†":{func: "Derivative", n:1}
    }
};

function InputParser4Methods(id, str) {

    /*
    - InputParser4Methods:
        Function that receives the string from one of the text inputs
        and validates what is written.
    - Arguments:
        id - id of the input text, to know if it is the pre-processing or the symbolic connotation symbol
        str - string (value) of the input text object
    */

    var n,
        Valid;
    if(id=="ppdisplay") {

        n = str.match(/([☴☲☱∼](\s\d+)+)|[∥⊚]/g);
        //Validate String n
        if(str.length === 0){
            updateData(RawSignal);
        }
        else{
            Valid = ValidateString(str, n);
            if(Valid){
                ParsePPMethods(n, id);
            }
        }
    }
    else if(id == "scdisplay"){

        n = str.match(/([⇞↕‡†](\s0\.\d+)+)/g);
        //Validate string n
        Valid = ValidateString(str, n);
        if(Valid){
            ParseSCMethods(n, id);
        }
    }
}

function ValidateString(original, n){
    if(n === null){
        return false;
    }
    else{
        var matched = n.join(" ");
        var ss = [];
        for(var i=0; i<n.length; i++){
            ss.push(n[i].match(/\S+/g));
        }

        if(matched == original){
            return true;
            // document.getElementById(id).innerHTML = ss;
        }
        else{
            return false;
            // document.getElementById(id).innerHTML = "not a valid string";
        }
    }

}

function ParsePPMethods(n){
    var ss;
    var methods = [];
    var params;


    //everytime I check for new PP, the pre-processing has to be the same as the raw data.
    PPSignal = RawSignal;

    for(var i=0; i<n.length; i++) {

        //create array with all elements of each i function
        ss = n[i].match(/\S+/g);
        //set of parameters for the function
        params = ss.slice(1,ss.length);

        //run the function with the parameters if it is correct:
        //the first element of ss is the function symbol
        //if function symbol in the dictionary, it's ok
        if (ss[0] in globalDict["PP"]) {
            methods.push(i+": " + globalDict["PP"][ss[0]].func + "\n");
            // if more or less parameters than supposed, it fails
            if(params.length != globalDict["PP"][ss[0]].n){
                methods.push(i + ": " + "not a valid arguments" + "\n");
            }
            // if the same, go on...and test the function
            else{
                var fn = window[globalDict["PP"][ss[0]].func];
                if(typeof fn == "function"){
                    methods.push(ss[0] + ": " + "running " + globalDict["PP"][ss[0]].func + " with parameters: " + params + "\n");
                    fn.apply(null, params);
                }
            }
        }
        else{
            document.getElementById("ppdisplay").innerText = "not a valid method"
        }
    }

    document.getElementById("ppdisplay").innerText = methods.join("\n");

}


function ParseSCMethods(n){

    var ss;
    var methods = [];
    var params;

    //everytime I check for new PP, the pre-processing has to be the same as the raw data.
    SymbolicSignal = PPSignal;

    for(var i=0; i<n.length; i++) {
        //create array with all elements of each i function
        ss = n[i].match(/\S+/g);
        //set of parameters for the function
        params = ss.slice(1,ss.length);

        if (ss[0] in globalDict["SC"]) {
            methods.push(i+": " + globalDict["SC"][ss[0]].func + "\n");
            if(params.length != globalDict["SC"][ss[0]].n){
                console.log("not valid arguments")
            }
            else{
                var fn = window[globalDict["SC"][ss[0]].func];
                if(typeof fn == "function"){
                    methods.push(ss[0] + ": " + " running " + globalDict["SC"][ss[0]].func + " with parameters: " + params + "\n");
                    fn.apply(null, params);
                }
            }
        }
        else {
            methods.push(i +": " + "not a valid method" + "\n");
        }
        document.getElementById("scdisplay").innerHTML = globalDict["SC"][ss[0]].func;
    }
}


function Search(regex){
    document.getElementById("search").innerHTML = regex;

}

