function LowPassFilter(fc){
    var arr = [];
    PPSignal.map(function(num){
        arr.push(num.y);
    });
    var iirCalculator = new Fili.CalcCascades();

    var availableFilters = iirCalculator.available();
    var iirFilterCoeffs = iirCalculator.lowpass({
        order:2,
        characteristic: 'butterworth',
        Fs: FS,
        Fc: fc,
        BW: 1,
        gain: 0,
        preGain: false
    });

    var iirFilter = new Fili.IirFilter(iirFilterCoeffs);
    console.log(iirFilter);

    arr = iirFilter.multiStep(arr);

    console.log(arr);

    arr.map(function(num, i){
        PPSignal[i].y = num;
    });


}

function BandPassFilter(fc1, fc2){
    var arr = [];
    PPSignal.map(function(num){
        arr.push(num.y);
    });

    var Wc = ((fc2 - fc1)/2)+ fc1*1.0;

    var iirCalculator = new Fili.CalcCascades();

    var availableFilters = iirCalculator.available();
    var iirFilterCoeffs = iirCalculator.bandpass({
        order:2,
        characteristic: 'butterworth',
        Fs: FS,
        Fc: Wc,
        F1: fc1,
        F2: fc2,
        BW: 1,
        gain: 0,
        preGain: false
    });
    console.log(iirFilterCoeffs);
    var iirFilter = new Fili.IirFilter(iirFilterCoeffs);


    arr = iirFilter.multiStep(arr);

    console.log(arr);

    arr.map(function(num, i){
        PPSignal[i].y = num;
    });

}

function HighPassFilter(fc){
    var arr = [];
    PPSignal.map(function(num){
        arr.push(num.y);
    });
    var iirCalculator = new Fili.CalcCascades();

    var availableFilters = iirCalculator.available();
    var iirFilterCoeffs = iirCalculator.highpass({
        order:2,
        characteristic: 'butterworth',
        Fs: FS,
        Fc: fc,
        BW: 1,
        gain: 0,
        preGain: false
    });

    var iirFilter = new Fili.IirFilter(iirFilterCoeffs);
    console.log(iirFilterCoeffs);

    arr = iirFilter.multiStep(arr);

    console.log(arr);

    arr.map(function(num, i){
        PPSignal[i].y = num;
    });

}

function Whitening(){
    var array = PPSignal;

    var mA = mean(array);

    var stdA = std(array);

    PPSignal = array.map(function (num) {
        return {x:num.x, y:(num.y - mA)/stdA}
    });

}

function Modulus(){
    var array = PPSignal;

    PPSignal = array.map(function(num){
        return {x:num.x, y:Math.abs(num.y)}
    });

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

    // return PPSignal;
}