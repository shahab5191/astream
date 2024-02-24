import { playAudioStream } from "./audio/play-stream";
import { initializeTts } from "./audio/tts";
import { Config } from "./config";

initializeTts();

//tts-pipline
const mediaRecorderOptions = {
  mimeType: "audio/webm",
};
let audioChunks = [];
const recordBtn = document.getElementById("record-btn");

const onSuccess = (stream) => {
  const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/ogg" });

  recordBtn.onclick = () => {
    if (recordBtn.innerText === "Record") {
      mediaRecorder.start();
      console.log("Recorder State", mediaRecorder.state);
      console.log("Recorder Started");
      recordBtn.innerText = "Stop";
    } else {
      mediaRecorder.stop();
      recordBtn.innerText = "Record";
    }
  };

  mediaRecorder.onstop = async (event) => {
    const formData = new FormData();
    const blob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
    audioChunks = [];
    const emotion_offset = { arousal: -0.2, valence: -0.1 };
    formData.append("audio", blob);
    formData.append("emotion_offset", JSON.stringify(emotion_offset));
    formData.append("session_id", "c250eb3d-c019-4968-a95a-e0f433ec5274");
    formData.append(
      "tts_config",
      JSON.stringify({ output_format: "mp3_44100_64" })
    );
    const response = await fetch(`${Config.apiUrl}/tts-pipeline/`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU4MTYxOWQ0LWJlNTMtNDUzOS1iZTMwLWNmMThlYzU1MmU0OCIsImVtYWlsIjoic2hhaGFiNTE5MUBsaXZlLmNvbSIsImV4cCI6MTcxMDQzNjQ3Mn0.q-dZNP4BQVJ_WRyYop4krRwhkM9PbRc8VPTMZ6h9iDk",
      },
    });

    if (!response.ok) {
      console.log("error");
    }
    const stream = response.body;
    await playAudioStream(stream);
  };

  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };
};

const onError = (e) => {
  console.log(e);
};

navigator.mediaDevices.getUserMedia({ audio: true }).then(onSuccess, onError);
