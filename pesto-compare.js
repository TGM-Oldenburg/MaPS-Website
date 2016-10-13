fetch('pesto-compare-fpe.json', {method:'GET'}).then(response => {
    response.json().then(data => {
        update_pesto_compare('pesto-fpe', data, 'Fine Pitch Error in f/f<sub>0</sub>', [0, 0.2]);
    });
});

fetch('pesto-compare-gpe.json', {method:'GET'}).then(response => {
    response.json().then(data => {
        update_pesto_compare('pesto-gpe', data, 'Gross Pitch Error in %', [0, 100]);
    });
});

function update_pesto_compare(divname, data, ylabel, ylim) {
    var snrs = [-20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40];
    var plotdata = [{
        type: 'scatter',
        name: 'PESTO',
        x: snrs,
        y: Array.from(snrs, snr => data.PESTO[snr])
    }, {
        type: 'scatter',
        name: 'PEFAC',
        x: snrs,
        y: Array.from(snrs, snr => data.PEFAC[snr])
    }, {
        type: 'scatter',
        name: 'YIN',
        x: snrs,
        y: Array.from(snrs, snr => data.YIN[snr])
    }, {
        type: 'scatter',
        name: 'RAPT',
        x: snrs,
        y: Array.from(snrs, snr => data.RAPT[snr])
    }];

    var plotlayout = {
        xaxis: {
            title: 'SNR in dB',
            tickmode: 'array',
            tickvals: snrs
               },
        yaxis: { title: ylabel, range: ylim },
        margin: { t:20, r:20, b:50, l:100 },
        width: 600,
        height: 200
    };

    Plotly.newPlot(divname, plotdata, plotlayout);
}
