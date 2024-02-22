/**
 * @var {AudioContext} audioCtx
 */
let audioCtx;
export const playAudioContext = async (stream) => {
  let decodedBuffer;
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
      decodedBuffer = await audioCtx.decodeAudioData(value.buffer);
//      if(!concatedBuffer){
//        concatedBuffer = decodedBuffer
//      } else {
//        concatedBuffer = concatenateBuffer(concatedBuffer, decodedBuffer)
//      }
      if (!source || source.playbackState === source.FINISHED) {
        source = audioCtx.createBufferSource();
        source.buffer = concatedBuffer;
      }
      source.connect(audioCtx.destination);
      source.start();
    }
  }
}
