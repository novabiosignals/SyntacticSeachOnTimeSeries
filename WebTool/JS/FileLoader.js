function readTxt(){

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
            if(lines[0] === "# OpenSignals Text File Format"){
                var header = JSON.parse(lines[1].slice(1,lines[1].length));
                console.log(header)

            }

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

            RawSignal = Data;
            plotData(Data, "1");
            // plotData(Data, "2");
            // plotData(0, "3");

        };

        reader.readAsText(fileInput, "UTF-8");
    }
    else {
        fileDisplayArea.innerText = "File not supported!"
    }
}

//TODO: make all this file types readable
// function readH5{}

// function readMat{}

// function readCsv{}


function readFile(fileInput) {
    var fileDisplayArea = document.getElementById('fileDisplay');
    var textype = /text.*/;
    //clean data
    var Data = [];

    if (fileInput.type.match(textype)) {
        readTxt(fileInput);
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

            RawSignal = Data;
            plotData(Data, "1");
            // plotData(Data, "2");
            // plotData(0, "3");

        };

        reader.readAsText(fileInput, "UTF-8");
    }
    else {
        fileDisplayArea.innerText = "File not supported!"
    }
}