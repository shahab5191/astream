export const playAudioStream = async (stream) => {
  const reader = stream.getReader();
  console.log("playing audio");
  const spectometer = document.getElementById("spect-canv");
  const spectCtx = spectometer.getContext("2d");

  // const processStream = async () => {
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const audioBlob = new Blob([value], { type: "audio/mpeg" });
    const audioURL = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioURL);
    console.log(value);
    audio.play();

    await new Promise((resolve) => {
      audio.onended = resolve;
    });
  }
  // };
};
