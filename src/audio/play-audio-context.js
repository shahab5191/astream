import concatAudioBuffers from "concat-audio-buffers";

/**
 * @var {AudioContext} audioCtx
 */
let audioCtx;

export const PlayAudioStreamCtx = (stream) => {
  audioCtx = new AudioContext()
  const source = audioCtx.createMediaStreamSource(stream)
  source.connect(audioCtx.destination)
  source.start()
}

export const playAudioContext = async (stream) => {
  let concatedBuffer = null;
  if (!audioCtx) {
    audioCtx = new AudioContext();
    const reader = stream.getReader();
    let source;
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      let decodedBuffer
      try {
        decodedBuffer = await audioCtx.decodeAudioData(value.buffer);
      } catch (err) {
        console.log(err);
      }
      if (!concatedBuffer) {
        concatedBuffer = decodedBuffer;
      } else {
        concatAudioBuffers([concatedBuffer, decodedBuffer], 1, playAudio);
      }
      const playAudio = (error, combinedBuffer) => {
        if (error) {
          console.log(error);
          return;
        }
        console.log(combinedBuffer);
        if (!source || source.playbackState === source.FINISHED) {
          source = audioCtx.createBufferSource();
          source.buffer = combinedBuffer;
        }
        source.connect(audioCtx.destination);
        source.start();
      };
    }
  }
};
