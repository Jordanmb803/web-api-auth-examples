import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify()

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token ? true : false,
      nowPlaying: {
        name: 'Not Checked',
        img: '',
      },
      catergories: [{ id: 'something', name: 'something', icons: [{ url: '' }] }],
      featuredPlaylist: { message: 'message', playlists: { items: [{images: [{url: ''}]}] } },
    }
    if (params.access_token) {
      spotifyWebApi.setAccessToken(params.access_token)
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  getNowPlaying() {
    spotifyWebApi.getMyCurrentPlaybackState().then(res => {
      spotifyWebApi.getCategories().then(result => {
        spotifyWebApi.getFeaturedPlaylists().then(playlists => {
          console.log(playlists)
          this.setState({
            nowPlaying: {
              name: res.item.name,
              img: res.item.album.images[0].url
            },
            catergories: result.categories.items,
            featuredPlaylist: playlists
          })

        })
      })
    })
  }

  render() {
    console.log(this.state.featuredPlaylist)
    return (
      <div className="App">
        <a href='http://localhost:8888'><button>Login with Spotify</button></a>
        <div> Now Playing: {this.state.nowPlaying.name}</div>
        <div>
          <img src={this.state.nowPlaying.img} style={{ width: 100 }} />
        </div>
        <div> Catergories: {this.state.catergories.map(cat => {
          return <div key={cat.id}>
            <p>{cat.name}</p>
            <img src={cat.icons[0].url} />
          </div>
        })}
        </div>
        <div>Featured Playlist:
          <h3>{this.state.featuredPlaylist.message}</h3>
          {this.state.featuredPlaylist.playlists.items.map(plylist=> {
            return <div key={plylist.id}>
              <p>{plylist.name}</p>
              <img src={plylist.images[0].url} style={{height: plylist.images[0].height, width: plylist.images[0].width}} />
            </div>
          })}

        </div>
        <button onClick={() => this.getNowPlaying()}>
          check now playing
        </button>
      </div>
    );
  }
}

export default App;
