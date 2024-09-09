let currentSong = new Audio();
let playPause = document.querySelector(".play");
async function getSongs() {
  let fetchSongs = await fetch("http://localhost:5500/songs/");
  let response = await fetchSongs.text();
  let el = document.createElement("div");
  el.innerHTML = response;
  let songLinks = el.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < songLinks.length; i++) {
    if (songLinks[i].href.endsWith(".mp3")) {
      songs.push(songLinks[i].href);
    }
  }
  return songs;
}

function convertSecondsToTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(Math.floor(remainingSeconds)).padStart(2, "0");
  return `${paddedMinutes}:${paddedSeconds}`;
}

const playMusic = (track, pause = false) => {
  currentSong.src = "/songs/" + track;
  currentSong.addEventListener("load", () => {
    document.querySelector(".totalDur").innerText = convertSecondsToTime(
      currentSong.duration
    );
  });
  document.querySelector(".songsInfo").innerText = track.split(".")[0];
  if (!pause) {
    currentSong.play();
    playPause.classList.remove("fa-circle-play");
    playPause.classList.add("fa-circle-pause");
  }
};

async function main() {
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".totalDur").innerText = convertSecondsToTime(
      currentSong.duration
    );
    document.querySelector(".currTime").innerText = convertSecondsToTime(
      currentSong.currentTime
    );
    document.querySelector(".circle").style.left = `${
      (currentSong.currentTime / currentSong.duration) * 100
    }%`;
  });
  let songs = await getSongs();
  playMusic(decodeURI(songs[0].split("/songs/")[1]), true);
  let songList = document.querySelector(".songLib");
  for (const song of songs) {
    let songItem = document.createElement("div");
    songItem.classList.add("songCard");
    songItem.innerHTML = `<i class="fa-solid fa-music"></i>
              <p class="songName">${decodeURI(song.split("/songs/")[1])}</p>
              <p class="playNow"><i class="fa-solid fa-circle-play"></i></p>`;
    songList.append(songItem);
  }
  Array.from(
    document.querySelector(".songLib").querySelectorAll(".songCard")
  ).forEach((e) => {
    let songToPlay = e.querySelector(".songName");
    songToPlay.parentElement.addEventListener("click", (evt) => {
      playMusic(songToPlay.innerHTML);
    });
  });
  playPause.addEventListener("click", (evt) => {
    if (currentSong.paused) {
      currentSong.play();
      playPause.classList.add("fa-circle-pause");
      playPause.classList.remove("fa-circle-play");
    } else {
      currentSong.pause();
      playPause.classList.add("fa-circle-play");
      playPause.classList.remove("fa-circle-pause");
    }
  });
}
main();
