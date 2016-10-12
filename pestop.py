import pesto
import numpy as np
import json
import soundfile

freqs = np.arange(80, 451, 5)
data = pesto.synthetic_ifd(44100, 1024, freqs)
signal, fs = soundfile.read('Mann_short.wav')
spectrum = pesto.ifd(pesto.SignalBlocks(signal, fs))[50]
frange = np.linspace(0, 22050, 1024)

with open('pestop.json', 'w') as outfile:
    json.dump(dict({str(f):list(d)[:100] for f, d in zip(freqs,data)},
                   spectrum=spectrum.tolist()[:100],
                   frequencies=list(frange)[:100]), outfile)
