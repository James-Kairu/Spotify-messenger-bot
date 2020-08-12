import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import ChatBot from 'react-simple-chatbot';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
//var cors = require('cors');
var querystring = require('querystring');
//var cookieParser = require('cookie-parser');

var client_id ='c93bb77526894497a4a68360d72f2503' //Your client id
var client_secret = '7c212fd5a8304b299f4d8aff0cd7bba5' //your secret
var redirect_uri = 'http://localhost:8888/callback'//your redirect uri
/** 
// Authorizes and obtains the access tokens and refresh tokens for the API
function setUpSpotify(){
  var client_id ='c93bb77526894497a4a68360d72f2503' //the client id
  // var client_secret = '7c212fd5a8304b299f4d8aff0cd7bba5' //your secret
  var redirect_uri = 'http://localhost:8888/callback'  //the redirect uri
  var access_token = null;
  var refresh_token = null;
  var params = null;
 
  //requesting authorization
  var app = express();
  var req = require('request');
 

 
  app.get('/login', function(req, res) {
    var scope = 'user-read-private user-read-email';  // set the scopes
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        client_id: client_id,
        response_type: 'code',
        scope: encodeURIComponent(scope),
        redirect_uri: encodeURIComponent(redirect_uri)
      })
    );
  });
  

    //requests refresh and access tokens
  var code = req.query.code || null;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      var access_token = body.access_token,
          refresh_token = body.refresh_token;

      var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };
    }
  });
  return params = {access_token:access_token , refresh_token:refresh_token}
}
  */
 function setUpSpotify(){

var params = {}
var access_token = '';
var refresh_token = '';
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = 'c93bb77526894497a4a68360d72f2503'; // Your client id
var client_secret = '7c212fd5a8304b299f4d8aff0cd7bba5'; // Your secret
var redirect_uri = 'http://localhost:8888/callback/'; // Your redirect uri

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email'; // 
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      redirect_uri: redirect_uri,
      client_id: client_id,
      scope: scope,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
  return params = {access_token:access_token , refresh_token:refresh_token}
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on 8888');
app.listen(8888);

 }
class SearchTracks extends Component{
  constructor(){
    super();
    var params = this.setUpSpotify();
    var token = params.access_token;
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
                id: 'Input_name?',
                message: 'Hi! What is your name?',
                trigger: 'Name_input',
              },
              {
                id: 'Name_input',
                user: true,
                trigger: 'Playing_now?',
              },
              {
                id: 'Playing_now?',
                message: 'Hi {previousValue}!,Do you want to know what track is playing?',
                trigger: 'Playingchoice_input',
              },
              {
                id: 'Playingchoice_input',
                user: true,
                trigger : (input) =>{
                  if((input.value).toLowerCase()==="yes" |(input.value).toLowerCase()==="yap" | (input.value).toLowerCase()==="yeah" ){
                    return "Now_playing";
                  } else if((input.value).toLowerCase()==='no'| (input.value).toLowerCase()==="naah" ){
                    return "Track_search?";
                  } else{
                    return "Input_error";
                  }
                }
              },
              {
                id: 'Input_error',
                message : "Oops! wrong input, Please select yes/no",
                trigger : 'Playing'
              },
              {
                id: 'Now_playing',
                component: <NowPlaying />,
                trigger: 'Track_search?',
              },
              {
                id: 'Track_search?',
                message: 'Do you want to search for a specific track instead?',
                trigger: 'Track_search',
              },
              {
                id: 'Playing',
                options: [
                    { value: 'yes', label: 'yes', trigger: 'Now_playing' },
                    { value: 'no', label: 'no', trigger: 'Track_search?' },
                  ],
              },
              {
                id: 'Track_search',
                options: [
                    { value: 'yes', label: 'Yes', trigger: 'Track_input?' },
                    { value: 'Another day maybe', label: 'No', trigger: 'End_statement' },
                  ],
              },
              {
                id: 'Track_input?',
                message: 'Let me know what track you want to find ...',
                trigger:"Track_input",
              },
              {
                id: 'Track_input',
                user: true,
                trigger:"Search_track",
              },
              {
                id: 'Search_track',
                component: <SearchTracks />,
                //waitAction: true,
                trigger:'Problems',
              },
              {
                id: 'Problems',
                message: 'You need to connect to spotify to continue using Chatify.',
                trigger: 'Options',
              },
              { 
                id: 'Options',
                options: [
                    { value: 'What\'s playing now?', label: 'Now playing', trigger: 'Now_playing' },
                    { value: 'I\'d like to search for a song!', label: 'Song search', trigger: 'Track_input?'},
                    { value: 'Thanks, that\'ll be it for now.', label: 'Quit', trigger: 'End_statement'},
                  ],
              },
              {
                id: 'End_statement',
                message: 'Thanks for using Chatify!',
                end: true,
              },
            ]}
          />
    );
  }
}

export default App;