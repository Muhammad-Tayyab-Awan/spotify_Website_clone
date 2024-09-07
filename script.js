async function getSongs() {
  let fetchSongs = await fetch("http://localhost:3000/songs/");
  let response = await fetchSongs.text();
  console.log(response);
}
getSongs();
