import React, { Component } from 'react';
import './App.css';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify()

const playlistUri = 'spotify:user:spotify:playlist:37i9dQZF1DWVTKDs2aOkxu'
const myAccessToken = 'BQCmA9HPeppiuzF189m3Bm3gcb5icVCiJKXMz5eQU4GPIuCHvWlk50ReCTSTi9dCbRd3NUsWnKiIcEpnmaXSjteY74jaoak7hda6sZRRvQ4L40fk_bcprVAC4NWIXhSNnkUAwEprJFC807zUS8ihYWcR7xOXfkQ2KGWjXPM&refresh_token=AQCRX64Vra7g2htmGOEHvfTTZ70cT8vBpxoP4s_7WrXfWXBy8HvE1tQmiJILnbdK9JhUH1e0C1iJSBnM_12q3X8Xw-4GPmWd6lXyVjcMnbQFgo82QEu6EPkwQ0V2E3z8OYU'

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
      featuredPlaylist: { message: 'message', playlists: { items: [{ images: [{ url: '' }] }] } },
      newReleases: [{ id: '', name: '', images: [{ url: '' }, { url: '' }, { url: '' }] }],
      playList: { tracks: { items: [{ track: { name: '' } }] } }
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
          spotifyWebApi.getNewReleases().then(newReleases => {
            this.setState({
              nowPlaying: {
                name: res.item.name,
                img: res.item.album.images[0].url
              },
              catergories: result.categories.items,
              featuredPlaylist: playlists,
              newReleases: newReleases.albums.items
            })

          })

        })
      })
    })
  }

  getPlayList() {
    spotifyWebApi.getPlaylist('1210621041', '37i9dQZF1DWVTKDs2aOkxu').then(res => {
      console.log(res)
      this.setState({ playList: res })
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
          {this.state.featuredPlaylist.playlists.items.map(plylist => {
            console.log(plylist.uri)
            return <div key={plylist.id}>
              <p>{plylist.name}</p>
              <img src={plylist.images[0].url} style={{ height: plylist.images[0].height, width: plylist.images[0].width }} />
            </div>
          })}
        </div>
        <div>New Releases: {this.state.newReleases.map(newRelease => {
          return (
            <div key={newRelease.id}>
              <p>{newRelease.name}</p>
              <img src={newRelease.images[1].url} />
            </div>
          )
        })}
        </div>
        <button onClick={() => this.getNowPlaying()}>
          check now playing
        </button>
        <div>
          <button onClick={() => this.getPlayList()}>View Playlist</button>
          <h1> Playlist: {this.state.playList.name}</h1>
          {this.state.playList.tracks.items.map(track => {
            return <div key={track.track.id}>

              <p>{track.track.name}</p>
            </div>
          })}
        </div>
      </div>
    );
  }
}

export default App;
