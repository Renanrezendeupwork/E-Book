var audio_element = false;
var intent = 0;
var max_intent = 5;
var intent_lapse = 1000; ///one second
var playing_interval;

function findAudio() {
  audio_element = document.getElementsByTagName("audio")[0];
  if (!audio_element) {
    setTimeout(() => {
      if (intent >= max_intent) {
        findAudio();
      }
    }, intent_lapse);
    return false;
  }
  audio_element.onplay = () => {
    if (!playing_interval) {
      playing_interval = setInterval(updatePlayTimer, 1000);
    }
  };
  audio_element.onpause = () => {
    clearInterval(playing_interval);
  };
  var tottime = Math.round(audio_element.duration);
  var totminutes = Math.floor(tottime / 60);
  var totseconds = tottime - totminutes * 60;
  var totshowtime = totminutes + ":" + ("0" + totseconds).slice(-2);
  var i = 0;
  var newaudiostring = "";

  if (audio_element.getAttribute("class")) {
    audio_element.setAttribute(
      "class",
      audio_element.getAttribute("class") + " audiohold"
    );
  } else {
    audio_element.setAttribute("class", "audiohold");
  }
  audio_element.setAttribute("id", "audiohold" + i);
  audio_element.setAttribute("ontimeupdate", "updateProgress(" + i + ")");
  audio_element.setAttribute("ondurationchange", "initializeAudio(this)");
  audio_element.setAttribute("data-aid", i);

  newaudiostring +=
    '<div id="ap' +
    i +
    '" class="audioplayer ' +
    audio_element.getAttribute("class") +
    '" style="' +
    audio_element.getAttribute("style") +
    '" data-aid="' +
    i +
    '">';
  newaudiostring +=
    '<div class="audioctrlbtn" onclick="playAudioCustom(this)" data-src="' +
    audio_element.currentSrc +
    '">';
  newaudiostring += '<i class="fas fa-play"></i>';
  newaudiostring += "</div>";
  newaudiostring +=
    '<div name="progressholder" class="progressholder" style="width:auto;" onclick="progressClick(event, this)">';
  newaudiostring += '<div class="progressbar"></div>';
  newaudiostring += "</div>";
  newaudiostring += '<div class="audiotimer">';
  if (totshowtime === "NaN:aN") {
    newaudiostring +=
      '<i class="fa fa-spinner fa-pulse fa-fw"></i><span class="sr-only">Loading...</span>';
  } else {
    newaudiostring += '<span class="curtime">0:00</span> / ' + totshowtime;
  }

  newaudiostring += "</div>";
  newaudiostring += '<div class="audioctrlbtn">';
  newaudiostring +=
    '<i class="fas fa-volume-up" onclick="toggleVolume(' + i + ')"></i>';
  newaudiostring += '<div class="audiovolume">';
  newaudiostring +=
    '<input class="volumeslider" type="range" min="0" max="100" oninput="volumeChange(this,' +
    i +
    ')"/>';
  newaudiostring += "</div>";
  newaudiostring += "</div>";
  newaudiostring += '<div class="audioctrlbtn">';
  newaudiostring +=
    '<i class="fas fa-tachometer-alt" onclick="toggleSpeed(' + i + ')"></i>';
  newaudiostring += '<div class="audiospeed">';
  newaudiostring +=
    '<input class="speedslider" type="range" min="50" max="120" oninput="speedChange(this,' +
    i +
    ')"/>';
  newaudiostring += "</div>";
  newaudiostring += "</div>";
  newaudiostring += "</div>";

  audio_element.insertAdjacentHTML("afterend", newaudiostring);
  audio_element.style.display = "none";
}

function resizeAudio(aid) {
  var curplayer = document.getElementById("ap" + aid);
  var setwidth = 0;
  setwidth += curplayer.getElementsByClassName("audiotimer")[0].offsetWidth;
  setwidth +=
    curplayer.getElementsByClassName("audioctrlbtn")[0].offsetWidth * 3;
  setwidth += 40;
  curplayer.getElementsByClassName("progressholder")[0].style.width =
    "calc(100% - " + setwidth + "px)";
}

function speedChange(e, aid) {
  document.getElementById("audiohold" + aid).playbackRate = e.value / 100;
}

function toggleSpeed(aid) {
  var curplayer = document.getElementById("ap" + aid);
  var curholder = document.getElementById("audiohold" + aid);
  if (
    !curplayer.getElementsByClassName("audiospeed")[0].style.display ||
    curplayer.getElementsByClassName("audiospeed")[0].style.display == "none"
  ) {
    curplayer.getElementsByClassName("audiovolume")[0].style.display = "none";
    curplayer.getElementsByClassName("audiospeed")[0].style.display = "block";
    curplayer.getElementsByClassName("speedslider")[0].value =
      curholder.playbackRate * 100;
  } else {
    curplayer.getElementsByClassName("audiospeed")[0].style.display = "none";
  }
}

function volumeChange(e, aid) {
  document.getElementById("audiohold" + aid).volume = e.value / 100;
}

function toggleVolume(aid) {
  var curplayer = document.getElementById("ap" + aid);
  var curholder = document.getElementById("audiohold" + aid);
  if (
    !curplayer.getElementsByClassName("audiovolume")[0].style.display ||
    curplayer.getElementsByClassName("audiovolume")[0].style.display == "none"
  ) {
    curplayer.getElementsByClassName("audiospeed")[0].style.display = "none";
    curplayer.getElementsByClassName("audiovolume")[0].style.display = "block";
    curplayer.getElementsByClassName("volumeslider")[0].value =
      curholder.volume * 100;
  } else {
    curplayer.getElementsByClassName("audiovolume")[0].style.display = "none";
  }
}

function initializeAudio(e) {
  var aid = e.id;
  aid = aid.replace("audiohold", "");
  var tottime = Math.round(e.duration);
  var totminutes = Math.floor(tottime / 60);
  var totseconds = tottime - totminutes * 60;
  var totshowtime = totminutes + ":" + ("0" + totseconds).slice(-2);
  document
    .getElementById("ap" + aid)
    .getElementsByClassName("audiotimer")[0].innerHTML =
    '<span class="curtime">0:00</span> / ' + totshowtime;
  resizeAudio(aid);
}

function playAudioCustom(e) {
  var aid = e.parentNode.getAttribute("data-aid");
  var curholder = document.getElementById("audiohold" + aid);
  if (curholder.paused === true) {
    curholder.play();
    e.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    curholder.pause();
    e.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function updateProgress(aid) {
  var curholder = document.getElementById("audiohold" + aid);
  if (!curholder) return;
  var curplayer = document.getElementById("ap" + aid);

  var pos = curholder.currentTime / curholder.duration;
  curplayer.getElementsByClassName("progressbar")[0].style.width =
    pos * 100 + "%";

  var time = Math.round(curholder.currentTime);
  var minutes = Math.floor(time / 60);
  var seconds = time - minutes * 60;
  if (curplayer.getElementsByClassName("curtime")[0]) {
    curplayer.getElementsByClassName("curtime")[0].innerHTML =
      minutes + ":" + ("0" + seconds).slice(-2);
  }
  if (pos == 1) {
    curplayer.getElementsByClassName("audioctrlbtn")[0].innerHTML =
      '<i class="fas fa-play"></i>';
  }
}

function progressClick(e, t) {
  var rect = e.target.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var pct =
    x / document.getElementsByClassName("progressholder")[0].offsetWidth;

  var aid = t.parentNode.getAttribute("data-aid");
  var curholder = document.getElementById("audiohold" + aid);
  if (!curholder) return;
  curholder.currentTime = curholder.duration * pct;
  updateProgress(aid);
}

function updatePlayTimer() {
  let playing_time = localStorage.getItem("playing_time")
    ? parseInt(localStorage.getItem("playing_time"))
    : 0;
  playing_time++;
  localStorage.setItem("playing_time", playing_time);
}
