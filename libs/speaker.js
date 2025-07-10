
const synth = window.speechSynthesis;
let voices = [];
//let voice;

function populateVoiceList() {
  voices = synth.getVoices();
  voices = voices.filter(a => a.lang.includes("ru") && a.name.includes("Google"));
  //if not exists Google voices
   if (voices.length == 0) {
     voices = voices.filter(a => a.lang.includes("ru"));
  }
  console.log(voices);
}

//voices=synth.getVoices();



setTimeout(() => {

  //populateVoiceList();
}, 1000);

if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoiceList;
}

function log() {
  //console.log("SpeechSynthesisUtterance.onend");
}

function speak(text, delay = 250, callback = log) {
  if (synth.speaking) {
    console.error("speechSynthesis.speaking");
    return;
  }
  
  synth.cancel();

  setTimeout(() => {
    const utterThis = new SpeechSynthesisUtterance(text);

    utterThis.onend = function (event) {
      //console.log('speak end');
      callback('speak end');
    };

    utterThis.onerror = function (event) {
      console.error("SpeechSynthesisUtterance.onerror");
    };
    utterThis.voice = voices[0]
    //alert(voices)
    utterThis.pitch = 1;
    utterThis.rate = 1.02;
    utterThis.lang = "ru-RU";
    
    synth.speak(utterThis);
  }, delay);

}


function playSoundAndCallFunction(soundFile, callback, delay = 250) {

  setTimeout(() => {
    const audio = new Audio(soundFile);

    audio.onended = function () { callback(); };

    audio.play();
  }, delay);
}

function playSoundSayTextAndPlaySoundAgain(soundFile, text, callback1) {
  const audio = new Audio(soundFile);

  audio.onended = function () {
    speak(text, 0, function () {
      const audioAgain = new Audio(soundFile);

      audioAgain.onended = function () {
        callback1();
      };

      audioAgain.play();
    });
  };

  audio.play();
}

