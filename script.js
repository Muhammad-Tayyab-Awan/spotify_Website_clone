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

async function main() {
  let songs = await getSongs();
  let songList = document.querySelector(".songLib");
  for (const song of songs) {
    let songItem = document.createElement("div");
    songItem.classList.add("songCard");
    songItem.innerHTML = `<i class="fa-solid fa-music"></i>
              <p class="songName">${
                song.split("/songs/")[1].replaceAll("%20", " ").split(".")[0]
              }</p>
              <p class="playNow"><i class="fa-solid fa-circle-play"></i></p>`;
    songList.prepend(songItem);
  }
  
}
main();
