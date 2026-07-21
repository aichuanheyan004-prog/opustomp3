const fileInput = document.querySelector("#fileInput");
const chooseButton = document.querySelector("#chooseButton");
const convertButton = document.querySelector("#convertButton");
const downloadLink = document.querySelector("#downloadLink");
const bitrateSelect = document.querySelector("#bitrate");
const filenameInput = document.querySelector("#filename");
const dropZone = document.querySelector("#dropZone");
const fileMeta = document.querySelector("#fileMeta");
const statusText = document.querySelector("#status");
const progressBar = document.querySelector("#progressBar");
const previewPlayer = document.querySelector("#previewPlayer");

const maxFileSize = 100 * 1024 * 1024;
let selectedFile = null;
let lastObjectUrl = null;

chooseButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => {
  const file = fileInput.files && fileInput.files[0];
  if (file) {
    setSelectedFile(file);
  }
});

["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-dragging");
  });
});

dropZone.addEventListener("drop", (event) => {
  const file = event.dataTransfer.files && event.dataTransfer.files[0];
  if (file) {
    setSelectedFile(file);
  }
});

convertButton.addEventListener("click", async () => {
  if (!selectedFile) {
    return;
  }

  if (!window.lamejs) {
    setStatus("The MP3 encoder did not load. Check your connection and refresh.", true);
    return;
  }

  convertButton.disabled = true;
  downloadLink.classList.add("is-disabled");
  downloadLink.removeAttribute("href");
  setProgress(4);
  setStatus("Reading audio file...");

  try {
    const arrayBuffer = await selectedFile.arrayBuffer();
    setProgress(14);
    setStatus("Decoding Opus audio...");

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      throw new Error("Your browser does not support Web Audio decoding.");
    }

    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
    setProgress(42);
    setStatus("Encoding MP3...");

    const bitrate = Number(bitrateSelect.value);
    const mp3Blob = await encodeMp3(audioBuffer, bitrate, (progress) => {
      setProgress(42 + progress * 50);
    });

    await audioContext.close();
    setProgress(100);
    makeDownload(mp3Blob);
    setStatus("Done. Your MP3 is ready to download.");
  } catch (error) {
    setProgress(0);
    setStatus(
      `${error.message || "Conversion failed."} Try Chrome, Edge, or Firefox with a valid Opus file.`,
      true,
    );
    convertButton.disabled = false;
  }
});

function setSelectedFile(file) {
  selectedFile = file;
  clearPreviousDownload();

  if (file.size > maxFileSize) {
    selectedFile = null;
    convertButton.disabled = true;
    fileMeta.innerHTML = "<span>File is larger than 100 MB. Try a shorter audio file.</span>";
    setStatus("Large browser-side conversions can run out of memory.", true);
    return;
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "converted-audio";
  filenameInput.value = safeFilename(baseName);
  fileMeta.textContent = `${file.name} - ${formatBytes(file.size)}`;
  convertButton.disabled = false;
  setProgress(0);
  setStatus("Ready to convert.");
}

function encodeMp3(audioBuffer, bitrate, onProgress) {
  return new Promise((resolve) => {
    const sampleRate = audioBuffer.sampleRate;
    const channelCount = audioBuffer.numberOfChannels > 1 ? 2 : 1;
    const encoder = new lamejs.Mp3Encoder(channelCount, sampleRate, bitrate);
    const blockSize = 1152;
    const left = convertFloat32ToInt16(audioBuffer.getChannelData(0));
    const right =
      channelCount === 2
        ? convertFloat32ToInt16(audioBuffer.getChannelData(1))
        : null;
    const chunks = [];
    let offset = 0;

    function encodeChunk() {
      const nextOffset = Math.min(offset + blockSize, left.length);
      const leftChunk = left.subarray(offset, nextOffset);
      let buffer;

      if (channelCount === 2 && right) {
        buffer = encoder.encodeBuffer(leftChunk, right.subarray(offset, nextOffset));
      } else {
        buffer = encoder.encodeBuffer(leftChunk);
      }

      if (buffer.length > 0) {
        chunks.push(buffer);
      }

      offset = nextOffset;
      onProgress(offset / left.length);

      if (offset < left.length) {
        window.setTimeout(encodeChunk, 0);
        return;
      }

      const finalBuffer = encoder.flush();
      if (finalBuffer.length > 0) {
        chunks.push(finalBuffer);
      }

      resolve(new Blob(chunks, { type: "audio/mpeg" }));
    }

    encodeChunk();
  });
}

function convertFloat32ToInt16(samples) {
  const output = new Int16Array(samples.length);
  for (let index = 0; index < samples.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, samples[index]));
    output[index] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return output;
}

function makeDownload(blob) {
  clearPreviousDownload();
  lastObjectUrl = URL.createObjectURL(blob);
  const outputName = `${safeFilename(filenameInput.value || "converted-audio")}.mp3`;
  downloadLink.href = lastObjectUrl;
  downloadLink.download = outputName;
  downloadLink.classList.remove("is-disabled");
  previewPlayer.src = lastObjectUrl;
  previewPlayer.hidden = false;
  convertButton.disabled = false;
}

function clearPreviousDownload() {
  if (lastObjectUrl) {
    URL.revokeObjectURL(lastObjectUrl);
    lastObjectUrl = null;
  }
  downloadLink.classList.add("is-disabled");
  downloadLink.removeAttribute("href");
  previewPlayer.removeAttribute("src");
  previewPlayer.hidden = true;
}

function setStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.classList.toggle("is-error", isError);
}

function setProgress(value) {
  progressBar.style.width = `${Math.max(0, Math.min(100, value))}%`;
}

function formatBytes(bytes) {
  if (bytes === 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / 1024 ** exponent;
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[exponent]}`;
}

function safeFilename(name) {
  return name
    .trim()
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 80);
}
