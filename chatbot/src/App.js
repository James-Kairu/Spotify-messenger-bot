import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ChatBot from 'react-simple-chatbot';


import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class Spotify extends Component{
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' }
    }
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying(){
    console.log("Jumba Jumba");
    spotifyApi.getMyCurrentPlayingTrack()
      .then((response) => {
        this.setState({
          nowPlaying: {
              name: response.item.name,
              albumArt: response.item.album.images[0].url
            }
        });
      })
  }
  render(){
    return(
      <div className="App">
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }
      </div>
    );
  }

}

class App extends Component {
  render() {
    return (
        <ChatBot
            headerTitle="Speech Recognition"
            recognitionEnable={true}
            steps={[
              {
                id: '1',
                message: 'Hi!What is your name?',
                trigger: '2',
              },
              {
                id: '2',
                user: true,
                trigger: '3',
              },
              {
                id: '3',
                message: 'Hi {previousValue}!,Do you want to know what track is playing?',
                trigger: '4',
              },
              {
                id: '4',
                user: true,
                validator: (value) => {
                  if (value==="yes") {
                    return true;
                  }
                  else{
                    return 'value should be yes';
                  }
                },
                trigger: '5',
              },
              {
                id: '5',
                component: <Spotify />,
                trigger: '6',
              },
              {
                id: '6',
                message: 'Hi {previousValue}!,Do you want to know what track is playing?',
                trigger: '7',
              },
              {
                id: '7',
                user: true,
                validator: (value) => {
                  if (value==="yes") {
                    return true;
                  }
                  else{
                    return 'value should be yes';
                  }
                },
                trigger: '5',
              },
              {
                id: '8',
                message: 'Thanks for asking',
                end: true,
              },
            ]}
          />
    );
  }
}



export default App;
