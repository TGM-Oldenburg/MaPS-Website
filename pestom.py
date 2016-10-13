import pesto
import numpy as np
import json
import soundfile

freqs = np.arange(80, 451, 5)
data = pesto.synthetic_magnitude(44100, 1024, freqs)
signal, fs = soundfile.read('Mann_short.wav')
spectrum = np.abs(pesto.stft(pesto.SignalBlocks(signal, fs))[50])
spectrum = spectrum / np.max(spectrum)
frange = np.linspace(0, 22050, 1024)

with open('pestom.json', 'w') as outfile:
    json.dump(dict({str(f):list(d)[:100] for f, d in zip(freqs,data)},
                   spectrum=spectrum.tolist()[:100],
                   frequencies=list(frange)[:100]), outfile)