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

const playMusic = (track) => {
  currentSong.src = "/songs/" + track;
  currentSong.play();
  document.querySelector(".songsInfo").innerText = track.split(".")[0];
  // document.querySelector(".totalDur").innerText = currentSong.duration;
  currentSong.addEventListener("timeupdate", () => {
    console.log(
      (Math.floor(currentSong.duration) / 60).toString().split(".")[1]
    );
  });
  playPause.classList.remove("fa-circle-play");
  playPause.classList.add("fa-circle-pause");
};

async function main() {
  let songs = await getSongs();
  let songList = document.querySelector(".songLib");
  for (const song of songs) {
    let songItem = document.createElement("div");
    songItem.classList.add("songCard");
    songItem.innerHTML = `<i class="fa-solid fa-music"></i>
              <p class="songName">${song
                .split("/songs/")[1]
                .replaceAll("%20", " ")}</p>
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
      console.log(playPause.outerHTML);
      playPause.classList.toggle("fa-circle-pause");
      playPause.classList.toggle("fa-circle-play");
      console.log(playPause.outerHTML);
      currentSong.play();
    } else {
      currentSong.pause();
      playPause.classList.toggle("fa-circle-play");
      playPause.classList.toggle("fa-circle-pause");
    }
  });
}
main();
