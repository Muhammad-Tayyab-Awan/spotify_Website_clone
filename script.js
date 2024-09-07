async function getSongs() {
  let fetchSongs = await fetch("http://localhost:5500/songs/");
  let response = await fetchSongs.text();
  let el = document.createElement("div");
  el.innerHTML = response;
  let songLinks = el.getElementsByTagName(a);
  let songs = [];
  for (let i = 0; i < songLinks.length; i++) {
    if (songLinks[0].href.endsWith(".mp3")) {
      songs.push(songLinks[0]);
    }
  }
  console.log(songs);
}
getSongs();
