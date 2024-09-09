let currentSong = new Audio();
let playPause = document.querySelector(".play");
let currAlbum;
let songs = [];
async function getSongs() {
  let fetchSongs = await fetch(`http://127.0.0.1:5500/songs/${currAlbum}/`);
  let response = await fetchSongs.text();
  let el = document.createElement("div");
  el.innerHTML = response;
  let songLinks = el.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < songLinks.length; i++) {
    if (songLinks[i].href.endsWith(".mp3")) {
      songs.push(songLinks[i].href);
    }
  }

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

  playMusic(decodeURI(songs[0].split(`/songs/${currAlbum}/`)[1]), true);

  let songList = document.querySelector(".songLib");
  songList.innerHTML = "";
  for (const song of songs) {
    let songItem = document.createElement("div");
    songItem.classList.add("songCard");
    songItem.innerHTML = `<i class="fa-solid fa-music"></i>
              <p class="songName">${decodeURI(
                song.split(`/songs/${currAlbum}/`)[1]
              )}</p>
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

  let seekBar = document.querySelector(".seekBar");

  seekBar.addEventListener("click", (evt) => {
    const elem = seekBar.getBoundingClientRect();
    let x = ((evt.clientX - elem.left) / elem.width) * 100;
    currentSong.currentTime = (x * currentSong.duration) / 100;
    document.querySelector(".circle").style.left = `${x.toFixed(2)}%`;
  });
}

function convertSecondsToTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(Math.floor(remainingSeconds)).padStart(2, "0");
  return `${paddedMinutes}:${paddedSeconds}`;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/songs/${currAlbum}/` + track;
  currentSong.addEventListener("loadeddata", () => {
    document.querySelector(".totalDur").innerText = convertSecondsToTime(
      currentSong.duration
    );
  });
  document.querySelector(".songsInfo").innerText = track.split(".")[0];
  if (playPause.classList.contains("fa-circle-pause")) {
    playPause.classList.remove("fa-circle-pause");
    playPause.classList.add("fa-circle-play");
  }
  if (!pause) {
    currentSong.play(playPause.classList.remove("fa-circle-play"));
    currentSong.play(playPause.classList.remove("fa-circle-pause"));
    console.log();
    if (playPause.classList.contains("fa-circle-play")) {
      playPause.classList.remove("fa-circle-play");
    }
    if (!playPause.classList.contains("fa-circle-pause")) {
      playPause.classList.add("fa-circle-pause");
    }
  }
};

async function getAlbum() {
  let albumsFetch = await fetch("http://127.0.0.1:5500/songs/");
  let response = await albumsFetch.text();
  let el = document.createElement("div");
  el.innerHTML = response;
  let albumLinks = el.getElementsByTagName("a");
  let albums = [];
  for (let i = 0; i < albumLinks.length; i++) {
    if (albumLinks[i].href.startsWith("http://127.0.0.1:5500/songs/")) {
      albums.push(albumLinks[i].href.split("/songs/")[1]);
    }
  }
  return albums;
}
async function main() {
  let albums = await getAlbum();
  currAlbum = albums[0];
  let albumContainer = document.querySelector(".cardContainer");
  albums.forEach((e) => {
    let albumCard = document.createElement("div");
    albumCard.classList.add("card");
    albumCard.setAttribute("data-album", `${e}`);
    albumCard.innerHTML = `<img src="/images/${e}.jpg" alt="${e}" />
              <i class="fa-solid fa-circle-play"></i>
              <p>${e}</p>`;
    albumContainer.append(albumCard);
  });

  await getSongs();

  playPause.addEventListener("click", (evt) => {
    if (currentSong.paused) {
      currentSong.play();
      playPause.classList.toggle("fa-circle-pause");
      playPause.classList.toggle("fa-circle-play");
    } else {
      currentSong.pause();
      playPause.classList.toggle("fa-circle-play");
      playPause.classList.toggle("fa-circle-pause");
    }
  });

  let nextSong = document.querySelector(".next");

  nextSong.addEventListener("click", (evt) => {
    if (songs.indexOf(currentSong.src) + 1 < songs.length) {
      playMusic(
        decodeURI(
          songs[songs.indexOf(currentSong.src) + 1].split(
            `/songs/${currAlbum}/`
          )[1]
        )
      );
    }
  });

  let prevSong = document.querySelector(".prev");

  prevSong.addEventListener("click", (evt) => {
    if (songs.indexOf(currentSong.src) - 1 >= 0) {
      playMusic(
        decodeURI(
          songs[songs.indexOf(currentSong.src) - 1].split(
            `/songs/${currAlbum}/`
          )[1]
        )
      );
    }
  });

  let albumCards = document.querySelectorAll(".card");

  albumCards.forEach((e) => {
    e.addEventListener("click", async (evt) => {
      console.log(evt.currentTarget.dataset.album);
      currAlbum = evt.currentTarget.dataset.album;
      await getSongs();
    });
  });
}

main();
