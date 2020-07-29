import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import ChatBot from 'react-simple-chatbot';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

class SearchTracks extends Component{
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      query:{name:null},
      Trackname:{name:null},
    }
  }
  componentWillMount() {
  //console.log(this.props.previousStep["value"]);
  var workingvalue=this.props.previousStep["value"];
  //const { steps } = this.props.previousStep["value"];
  //const { parameter } = this.props.previousStep["value"];
  console.log(workingvalue);

  this.setState({ query:{name:workingvalue} });
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

  searchTracks(query){
    spotifyApi.searchTracks(query)
  .then((response) => {
    this.setState({
      Trackname: {
          name: response.tracks.items[0].name,
        }
    });
    //console.log(this.state.query.name);
    console.log('Search by "Love"', response.tracks.items[0].name);
  }, function(err) {
    console.error(err);
  });

  }

  render(){
    return(
      <div className="App">
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          Track Name: { this.state.Trackname.name }
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.searchTracks(this.state.query.name)}>
            Check Track Name
          </button>
        }
      </div>
    );
  }

}

SearchTracks.propTypes = {
  steps: PropTypes.object,
};

SearchTracks.defaultProps = {
  steps: undefined,
};


class NowPlaying extends Component{
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
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
                trigger : (input) =>{
                  if((input.value).toLowerCase()==="yes"){
                    return "5";
                  } else if((input.value).toLowerCase()==="no"){
                    return "12";
                  } else{
                    return "erroneous_input";
                  }
                }
              },
              {
                id: 'erroneous_input',
                message : "Oops wrong input, yes or no",
                trigger : '4'
              },
              {
                id: '5',
                component: <NowPlaying />,
                trigger: '6',
              },
              {
                id: '6',
                message: 'Hi {previousValue}!,Do you want to know what track is playing?',
                trigger: '7',
              },
              {
                id: '7',
                options: [
                    { value: 'yes', label: 'yes', trigger: '5' },
                    { value: 'no', label: 'no', trigger: 'tracksearch' },
                  ],
              },
              {
                id: 'tracksearch',
                options: [
                    { value: 'yes', label: 'Yes', trigger: '9' },
                    { value: 'no', label: 'No', trigger: '12' },
                  ],
              },
              {
                id: '9',
                message: 'Let me know what track you want to find?',
                trigger:10,
              },
              {
                id: '10',
                user: true,
                trigger:11,
              },
              {
                id: '11',
                component: <SearchTracks />,
                waitAction: true,
                trigger:12,
              },
              {
                id: '12',
                message: 'Thanks for asking',
                end: true,
              },
            ]}
          />
    );
  }
}

export default App;

