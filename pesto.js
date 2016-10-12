function linspace(start, stop, length) {
    var result = new Array(length);
    var step = (stop-start)/(length-1);
    for (var n=0; n<length; n++) {
        result[n] = start + n*step;
    }
    return result;
}

function split_blocks(data, blocksize, hopsize, samplerate) {
    var length = Math.ceil( (data.length-blocksize) / hopsize );
    var times = new Array(length);
    var blocklist = new Array(length);
    for (var n=0; n<length; n++) {
        idx = n*hopsize;
        times[n] = idx/samplerate;
        blocklist[n] = data.slice(idx, idx+blocksize);
    }
    return [blocklist, times];
}

function hann(length) {
    var result = new Array(length);
    for (var n=0; n<length; n++) {
        result[n] = 0.5 * (1 - Math.cos( (2*Math.PI*n)/(length-1) ));
    }
    return result;
}

function logabsrfft(real, window) {
    var imag = new Array(real.length);
    for (var n=0; n<imag.length; n++) {
        real[n] = real[n]*window[n];
        imag[n] = 0;
    }
    transform(real, imag);
    var result = new Array(real.length/2);
    for (var n=0; n<result.length; n++) {
        result[n] = 20*Math.log10(Math.sqrt(real[n]*real[n] + imag[n]*imag[n])/real.length);
    }
    return result;
}

function display_spectrogram(filename, divname, size) {
    fetch(filename, {method:'GET'}).then(response => {
        response.arrayBuffer().then(arraybuffer => {
            var audioCtx = new AudioContext();
            audioCtx.decodeAudioData(arraybuffer).then(audiobuffer => {
                var data = audiobuffer.getChannelData(0);
                var blocksize = 2048;
                var hopsize = 256;
                var [blocks, time] = split_blocks(data, blocksize, hopsize, audiobuffer.sampleRate);
                var window = hann(blocksize);
                var stft = Array.from(blocks, b => Array.from(logabsrfft(b, window)));
                var frequency = linspace(0, audiobuffer.sampleRate/2, stft[0].length)
                var plotdata = [{
                    x: time,
                    y: frequency,
                    z: stft,
                    type: 'heatmap',
                    colorscale: 'Viridis',
                    zmax: 0,
                    zmin: -60,
                    transpose: true,
                    colorbar: { title: 'level in dB FS',
                                titleside: 'right' }
                }];
                var plotlayout = {
                    xaxis: { autorange: true, title: 'time in s' },
                    yaxis: { range: [0, 4000], title: 'frequency in Hz' },
                    margin: { t:20, r:20, b:50, l:100 }
                };
                if (size) {
                    [plotlayout.width, plotlayout.height] = size;
                }
                Plotly.newPlot(divname, plotdata, plotlayout);
            });
        });
    });
}
