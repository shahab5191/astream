import { Config } from "../config";
import { PlayAudioStreamCtx } from "./play-audio-context";

const fetchTts = async () => {
  const textBox = document.getElementById("tts-text-box");
  const data = textBox.value;
  const res = await fetch(`${Config.apiUrl}/tts`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU4MTYxOWQ0LWJlNTMtNDUzOS1iZTMwLWNmMThlYzU1MmU0OCIsImVtYWlsIjoic2hhaGFiNTE5MUBsaXZlLmNvbSIsImV4cCI6MTcxMDQzNjQ3Mn0.q-dZNP4BQVJ_WRyYop4krRwhkM9PbRc8VPTMZ6h9iDk",
    },
    body: JSON.stringify(
      {
        text: data,
        tts_config: {
          output_format: "mp3_44100_128"
        }
      }
    ),
  });
  const stream = res.body;
  //  await playAudioStream(stream);
  PlayAudioStreamCtx(stream);
};

export const initializeTts = () => {
  const ttsBtn = document.getElementById("tts-button");
  if (!ttsBtn) {
    console.warn("Record button was not found!");
  }
  ttsBtn.onclick = fetchTts;
};
