const baseURL = 'https://www.apitutor.org/spotify/simple/v1/search';

const audioFile = 'https://p.scdn.co/mp3-preview/bfead324ff26bdd67bb793114f7ad3a7b328a48e?cid=9697a3a271d24deea38f8b7fbfa0e13c';
const audioPlayer = AudioPlayer('.player', audioFile);

const search = (ev) => {
    const term = document.querySelector('#search').value;
    console.log('search for:', term);
    getTracks(term);
    getAlbums(term);
    getArtist(term);
    if (ev) {
        ev.preventDefault();
    }
}

const getTracks = (term) => {
    let url = `https://www.apitutor.org/spotify/simple/v1/search?type=track&q=${term}&limit=5`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length < 1) {
                document.querySelector('#tracks').innerHTML = `<h3>No Results Found</h3>`;
            }
            for (const track of data) {
                trackartistname = track.artist.name
                if (track.preview_url < 1) {
                    trackartistname = trackartistname + " (No Preview Available)";
                }
                const template = `
                <section class="track-item preview" data-preview-track="${track.preview_url}" onclick="playTrack(event);">
                    <img src="${track.album.image_url}">
                    <i class="fas play-track fa-play" aria-hidden="true"></i>
                    <div class="label">
                        <h3>${track.name}</h3>
                        <p>
                            ${trackartistname}
                        </p>
                    </div>
                </section>`;
                document.querySelector('#tracks').innerHTML += template;
                console.log(track); 
            }    
        })
};



const getArtist = (term) => {
    const elem = document.querySelector('#artist');
    elem.innerHTML = "";
    fetch(baseURL + '?type=artist&q=' + term)
    .then(response => response.json())
    .then((data) => {
        if (data.length > 0) {
            const firstArtist = data[0];
            elem.innerHTML += getArtistHTML(firstArtist);
         }
        else {
            const template = `<h3>No Results Found</h3>`;
            elem.innerHTML += template;
         }
    });
};

const getAlbums = (term) => {
    let url = baseURL + '?type=album&q=' + term + '&limit=10';
    fetch(url)
        .then(response => response.json())
        .then((data) => {
            if (data.length < 1) {
                document.querySelector('#albums').innerHTML = `<h3>No Results Found</h3>`;
            }
            for (const album of data) {
                const template = `
                <section class="album-card" id="${album.id}">
                    <div>
                        <img src="${album.image_url}">
                        <h3>${album.name}</h3>
                        <div class="footer">
                            <a href="${album.spotify_url}" target="_blank">
                                view on spotify
                            </a>
                        </div>
                    </div>
                </section>`; 
                if (data.length > 0){
                    document.querySelector('#albums').innerHTML += template;
                    console.log(album);
                }
                else {
                    document.querySelector('#albums').innerHTML += `<h3>No Results Found</h3>`;
                }
            }
        });
};

const getArtistHTML = (data) => {
    if (!data.image_url) {
        data.image_url = 'https://thehappypuppysite.com/wp-content/uploads/2016/09/The-Maltese-HP-long.jpg';
    }
    return `<section class="artist-card" id="${data.id}">
        <div>
            <img src="${data.image_url}">
            <h3>${data.name}</h3>
            <div class="footer">
                <a href="${data.spotify_url}" target="_blank">
                    view on spotify
                </a>
            </div>
        </div>
    </section>`;
};
    

const playTrack = (ev) => {
    if (audioPlayer.isPaused() == true) {
        console.log(ev.currentTarget);
        const currentsong = ev.currentTarget;
        const preview_url = currentsong.getAttribute("data-preview-track");
        audioPlayer.setAudioFile(preview_url);
        document.querySelector('footer .track-item').innerHTML = currentsong.innerHTML;
         audioPlayer.play();
    }
    else {
        audioPlayer.pause();
    }
};

document.querySelector('#search').onkeyup = (ev) => {
    console.log(ev.keyCode);
    if (ev.keyCode === 13) {
        ev.preventDefault();
        search();
    }
};