import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ffmpeg from '../src/ffmpeg.js';

test('ffmpeg toWav16kMonoPcm', async () => {
  const oggBuf = await fs.readFile('./test/audio.ogg');
  const wav = await ffmpeg.toWav16kMonoPcm(oggBuf);

  // Basic checks of the WAV header
  assert.equal(wav.slice(0, 4).toString('ascii'), 'RIFF', 'Not RIFF');
  assert.equal(wav.slice(8, 12).toString('ascii'), 'WAVE', 'Not WAVE');

  // fmt chunk
  const audioFormat = wav.readUInt16LE(20);  // 1 = PCM
  const numChannels = wav.readUInt16LE(22);  // 1 = mono
  const sampleRate = wav.readUInt32LE(24);  // 16000 Hz
  assert.equal(audioFormat, 1, 'Audio format must be PCM (1)');
  assert.equal(numChannels, 1, 'Must be mono');
  assert.equal(sampleRate, 16000, 'Sample rate must be 16000 Hz');

  // await fs.writeFile("./test/audio-output.wav", wav);
});
