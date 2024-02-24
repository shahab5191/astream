/**
 * @param {ReadableStream} stream
 */
export const playAudioStream = async (stream) => {
  const reader = stream.getReader();
  console.log("playing audio");
  const spectometer = document.getElementById("spect-canv");
  const spectCtx = spectometer.getContext("2d");
  const audioBlobList = [];

  let playing = false;
  let blobNum = 0;

  const playBlobs = async () => {
    if (blobNum >= audioBlobList.length) {
      return;
    }
    const audioURL = URL.createObjectURL(audioBlobList[blobNum]);
    blobNum++;

    const audio = new Audio(audioURL);
    audio.onended = () => {
      playing = false;
      playBlobs();
    };
    playing = true;
    audio.play();
  };

  const processStream = async () => {
    const { value, done } = await reader.read();
    if (done) return;
    const audioBlob = new Blob([value], { type: "audio/mpeg" });
    audioBlobList.push(audioBlob);
    if (!playing) {
      playBlobs();
    }
    processStream();
  };

  await processStream();
};
