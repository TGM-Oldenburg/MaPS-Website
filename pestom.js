var pestomdata = null;
fetch('pestom.json', {method:'GET'}).then(response => {
    response.json().then(data => {
        pestomdata = data;
        var f0 = document.getElementById('PESTO-M:slider').value;
        drawPESTOM(f0);
    });
});

function drawPESTOM(f0) {
    if (pestomdata === null) {
        return;
    }

    var plotdata = [{
        type: "scatter",
        name: "template",
        x: pestomdata.frequencies,
        y: pestomdata[f0]
    },
    {
        type: "scatter",
        name: "spectrum",
        x: pestomdata.frequencies,
        y: pestomdata.spectrum
    }];
    var plotlayout = {
        height: 200,
        width: 650,
        xaxis: { title: "frequency in Hz" },
        yaxis: { range: [-0.3, 1], title: "amplitude" },
        margin: { t:30, r:20, b:50, l:50 },
        title: "Magnitude Correlation = "
    };
    Plotly.newPlot("pestom", plotdata, plotlayout);

    updatePESTOM(f0);
}

function updatePESTOM(f0) {
    if (pestomdata === null) {
        return;
    }

    var correlation = 0;
    // calculate the log-f correlation of the signal spectrum and the template spectrum
    for (let n=0; n<pestomdata.spectrum.length; n++) {
        // equivalent to 1/diff(logspace( f..fs/2 )):
        var f = n/pestomdata.spectrum.length*22050;
        var log_weight = Math.pow(1/22050, f/22050)
        correlation += pestomdata.spectrum[n] * pestomdata[f0][n] * log_weight;
    }

    plotdiv = document.getElementById('pestom');
    plotdiv.data[0].y = pestomdata[f0];
    plotdiv.layout.title = "Magnitude Correlation = " + correlation.toFixed(2);
    Plotly.redraw('pestom');

    document.getElementById('PESTO-M:value').innerHTML = document.getElementById('PESTO-M:slider').value + '&thinsp;Hz';
    if (f0 == 115) {
        document.getElementById('PESTO-M:value').innerHTML += ' (optimal)';
        document.getElementById('PESTO-M:value').style.color = 'green';
    } else {
        document.getElementById('PESTO-M:value').style.color = '';
    }
}
