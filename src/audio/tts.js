import { playAudioContext } from "./play-audio-context";

const fetchTts = async () => {
  const textBox = document.getElementById("tts-text-box");
  const data = textBox.value;
  const res = await fetch("http://localhost:5000/api/tts", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU4MTYxOWQ0LWJlNTMtNDUzOS1iZTMwLWNmMThlYzU1MmU0OCIsImVtYWlsIjoic2hhaGFiNTE5MUBsaXZlLmNvbSIsImV4cCI6MTcxMDQzNjQ3Mn0.q-dZNP4BQVJ_WRyYop4krRwhkM9PbRc8VPTMZ6h9iDk",
    },
    body: JSON.stringify({ text: data }),
  });
  const stream = res.body;
  //  await playAudioStream(stream);
  await playAudioContext(stream);
};

export const initializeTts = () => {
  const ttsBtn = document.getElementById("tts-button");
  if (!ttsBtn) {
    console.warn("Record button was not found!");
  }
  ttsBtn.onclick = fetchTts;
};
