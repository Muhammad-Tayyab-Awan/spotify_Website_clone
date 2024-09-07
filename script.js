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
  var s1 = new Audio(songs[0]);
  s1.play();
}
