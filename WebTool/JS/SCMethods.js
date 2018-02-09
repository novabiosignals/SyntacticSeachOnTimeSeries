function Amp(thr){
    //threshold in percentage0
    var t = ((maxObject(PPSignal) - minObject(PPSignal))*thr) + (minObject(PPSignal));
    return isHigherThan(PPSignal, t);

}

function AmpDif(thr){

    var t = ((maxObject(PPSignal) - minObject(PPSignal))*thr) + (minObject(PPSignal));
    //start with max or min?
    var SymbolicAmpDif = [];
    var deltaRise;
    var deltaFall;
    //the first is max
    if(isMax(PPSignal)) {
        var maxs = detectPeaks(PPSignal, false);
        console.log(maxs[0]);
        //assuming it start by falling
        deltaRise = maxs[0].y - PPSignal[0].y;
        for (var j = 0; j < maxs[0].x; j++) {
            SymbolicAmpDif.push({x: j, y: deltaRise});
        }
        var min;
        for (var i = 0; i < maxs.length; i++) {

            if(i === maxs.length - 1){
                //find minima between the last maximum and the end of the signal
                min = detectPeaks(PPSignal.slice(maxs[i].x, PPSignal.length), true);
                if (min.length > 0) {
                    deltaFall = min[0].y - maxs[i].y;
                    deltaRise = PPSignal[PPSignal.length - 1].y - min[0].y;

                    for (j = maxs[i].x; j < min[0].x; j++) {
                        SymbolicAmpDif.push({x: j, y: deltaFall});
                    }
                    for (j = min[0].x; j < PPSignal.length; j++) {
                        SymbolicAmpDif.push({x: j, y: deltaRise});
                    }
                }
                else {
                    deltaFall = PPSignal[PPSignal.length].y - maxs[i].y;
                    for (j = maxs[i].x; j < PPSignal.length; j++) {
                        SymbolicAmpDif.push({x: j, y: deltaFall});
                    }
                }
            }
            else{
                //find minimum between maximums
                min = detectPeaks(PPSignal.slice(maxs[i].x, maxs[i + 1].x), true);
                console.log("min: " + "\n");
                console.log(min);
                if (min.length > 0) {
                    // deltaFall = PPSignal[maxs[i].x + min.x].y - PPSignal[maxs[i].x].y;
                    deltaFall = min[0].y - maxs[i].y;
                    // deltaRise = PPSignal[maxs[i + 1].x].y - PPSignal[maxs[0].x + min.x].y;
                    deltaRise = maxs[i+1].y - min[0].y;
                    for (j = maxs[i].x; j < min[0].x; j++) {
                        SymbolicAmpDif.push({x: j, y: deltaFall});
                    }
                    for (j = min[0].x; j < maxs[i + 1].x; j++) {
                        SymbolicAmpDif.push({x: j, y: deltaRise});
                    }
                }
            }
        }
    }
    //the first is min
    else {
        var mins = detectPeaks(PPSignal, true);
        //assuming it start by falling - Find the difference in amplitude with the beggining
        deltaFall = mins[0].y - PPSignal[0].y;
        for (var j = 0; j < mins[0].x; j++) {
            SymbolicAmpDif.push({x: j, y: deltaFall});
        }
        var max;
        //Find differences in amplitudes in the middle of the signal
        for (var i = 0; i < mins.length; i++) {
            if (i === mins.length - 1) {
                //find maximums between the last minimum and the end of the signal
                max = detectPeaks(PPSignal.slice(mins[i].x, PPSignal.length), false);

                if (max.length > 0) {
                    deltaRise = max[0].y - mins[i].y;
                    deltaFall = PPSignal[PPSignal.length - 1].y - max[0].y;
                    console.log("max: " + "\n");
                    console.log(max);
                    for (j = mins[i].x; j < max[0].x; j++) {
                        SymbolicAmpDif.push({x: j, y: deltaRise});
                    }
                    for (j = max[0].x; j < PPSignal.length; j++) {
                        SymbolicAmpDif.push({x: j, y: deltaFall});
                    }
                }
                else {
                    deltaRise = PPSignal[PPSignal.length].y - mins[i].y;
                    for (j = mins[i].x; j < PPSignal.length; j++) {
                        SymbolicAmpDif.push({x: j, y: deltaRise});
                    }
                }
            }
            else {
                //find maxima between minima
                max = detectPeaks(PPSignal.slice(mins[i].x, mins[i+1].x), false);
                console.log("max: " + "\n");
                console.log(max);
                if (max.length > 0) {
                    deltaRise = max[0].y - mins[i].y;
                    console.log("deltaRise\n");
                    console.log(deltaRise);
                    deltaFall = mins[i + 1].y - max[0].y;
                    console.log("deltaFall\n");
                    console.log(deltaFall);
                    for (j = mins[i].x; j < max[0].x; j++) {
                        SymbolicAmpDif.push({x: j, y: deltaRise});
                    }
                    for (j = max[0].x; j < mins[i + 1].x; j++) {
                        SymbolicAmpDif.push({x: j, y: deltaFall});
                    }
                }

            }
        }

    }
    return isAmpDif(SymbolicAmpDif, t);
}

function isMax(a){
    var max;
    for (var i = 1; i < a.length - 1; ++i) {
        if (a[i - 1].y < a[i].y && a[i].y > a[i + 1].y) {
            max = true;
            console.log(max);
            return max;
        }
        else if(a[i - 1].y > a[i].y && a[i].y < a[i + 1].y) {
            max = false;
            console.log(max);
            return max;
        }
    }
}

function detectPeaks(a, valley){
    var maxes = [];
    var mines = [];

    if(!valley) {
        for (var i = 1; i < a.length - 1; ++i) {
            if (a[i - 1].y < a[i].y && a[i].y > a[i + 1].y) {
                maxes.push(a[i]);
            }
        }
        return maxes;
    }
    else{
        for (var j = 1; j < a.length - 1; ++j) {
            if(a[j-1].y > a[j].y && a[j].y < a[j + 1].y) {
                mines.push(a[j]);
            }
        }

        return mines;
    }
}

function Derivative2(thr){
    if(SymbolicSignal.length === 0){

    }
    //thr
    var t = ((maxObject(PPSignal) - minObject(PPSignal))*thr);
    //numpy diff
    var diff = DiffO(PPSignal);
    diff.push(diff[diff.length - 1]);
    //second diff
    diff = DiffO(diff);
    //to have the same size as the original array
    diff.push(diff[diff.length - 1]);

    return isDerivative(diff, t);
}

function Derivative(thr){
    //numpy diff
    var diff = DiffO(PPSignal);
    diff.push(diff[diff.length-1]);
    //thr
    var t = (maxObject(diff) - minObject(diff))*thr;

    return isDerivative(diff, t);
}

function DiffO(arr){
    var diff = [];
    arr.reduce(function (p1, p2, i) {
        diff.push({x: i, y:p2.y - p1.y});
        p1 = p2;
        return p1;
    });
    return diff;
}

function maxObject(arr){
    return d3.max(arr, function(d){
        return d.y;
    });
}

function minObject(arr){
    return d3.min(arr, function(d){
        return d.y;
    });
}

function isHigherThan(arr, value){

    if(SymbolicSignal.length === 0){
        arr.map(function (num, i) {
            if(num.y > value){
                SymbolicSignal.push({x:i, y:"1"});
            }
            else{
                SymbolicSignal.push({x:i, y:"0"});
            }
        });
    }
    else{
        arr.map(function (num, i) {
            if(num.y > value){
                SymbolicSignal[i].y += "1";
            }
            else{
                SymbolicSignal[i].y += "0";
            }
        });
    }

    console.log(SymbolicSignal);
}

function isAmpDif(arr, value){
    if(SymbolicSignal.length === 0){
        arr.map(function (num, i) {
            if(num.y > value || num.y < -value){
                SymbolicSignal.push({x:i, y:"1"});
            }
            else{
                SymbolicSignal.push({x:i, y:"0"});
            }
        });
    }
    else{
        arr.map(function (num, i) {
            if(num.y > value || num.y < -value){
                SymbolicSignal[i].y += "1";
            }
            else{
                SymbolicSignal[i].y += "0";
            }
        });
    }
}

function isDerivative(arr, value){

    if(SymbolicSignal.length === 0){
        arr.map(function (num, i) {
            if(num.y >= value){
                SymbolicSignal.push({x:i,y:"+"});
            }
            else if (num.y <= -value){
                SymbolicSignal.push({x:i,y:"-"});
            }
            else{
                SymbolicSignal.push({x:i,y:"_"});
            }
        });
    }
    else{
        arr.map(function (num, i) {
            if(num.y >= value){
                SymbolicSignal[i].y += "+";
            }
            else if (num.y <= -value){
                SymbolicSignal[i].y += "-";
            }
            else{
                SymbolicSignal[i].y += "_";;
            }
        });
    }


    console.log(SymbolicSignal);
}