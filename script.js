async function getSongs() {
  let fetchSongs = await fetch("http://localhost:5500/songs/");
  let response = await fetchSongs.text();
  let el = document.createElement("div");
  el.innerHTML = response;
    let songLinks = div.getElementByTagName("a");
    let songs = [];
    for (let i = 0; i < songLinks.length; i++) {
        const element = array[i];
        
    }
}
getSongs();
