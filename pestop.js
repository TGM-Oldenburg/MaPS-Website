var pestopdata = null;
fetch('pestop.json', {method:'GET'}).then(response => {
    response.json().then(data => {
        pestopdata = data;
        var f0 = document.getElementById('PESTO-P:slider').value;
        updatePESTOP(f0);
        document.getElementById('PESTO-P:value').innerHTML = f0 + ' Hz';
    });
});

function updatePESTOP(f0) {
    if (pestopdata === null) {
        return;
    }

    var difference = 0;
    for (let n=0; n<pestopdata.spectrum.length; n++) {
        difference += Math.abs(pestopdata.spectrum[n] - pestopdata[f0][n]);
    }
    difference /= pestopdata.spectrum.length;

    var plotdata = [{
        type: "scatter",
        name: "template",
        x: pestopdata.frequencies,
        y: pestopdata[f0]
    },
    {
        type: "scatter",
        name: "spectrum",
        x: pestopdata.frequencies,
        y: pestopdata.spectrum
    }];
    var plotlayout = {
        height: 200,
        width: 650,
        xaxis: { title: "frequency in Hz" },
        yaxis: { title: "IFD in Hz" },
        margin: { t:30, r:20, b:50, l:50 },
        title: "IFD Difference = " + difference.toFixed(2)
    };
    Plotly.newPlot("pestop", plotdata, plotlayout);

    if (f0 == 115) {
        document.getElementById('PESTO-P:value').innerHTML += ' (optimal)';
        document.getElementById('PESTO-P:value').style.color = 'green';
    } else {
        document.getElementById('PESTO-P:value').style.color = '';
    }
}
