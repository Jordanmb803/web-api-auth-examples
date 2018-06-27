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
      catergories: [{ id: 'something', name: 'something', icons: [{url: ''}] }]
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
      this.setState({
        nowPlaying: {
          name: res.item.name,
          img: res.item.album.images[0].url
        }
      })
      spotifyWebApi.getCategories().then(res => {
        this.setState({
          catergories: res.categories.items
        })
      })
    })
  }

  render() {
    console.log(this.state.catergories)
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
              <img src={cat.icons[0].url}/>
          </div>
        })}</div>
        <button onClick={() => this.getNowPlaying()}>
          check now playing
        </button>
      </div>
    );
  }
}

export default App;
