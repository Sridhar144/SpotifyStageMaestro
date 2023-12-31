import React, { useState, useEffect } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import { useParams, useNavigate } from "react-router-dom"; // Updated imports
import CreateRoomPage from "./CreateRoom";
import MusicPlayer from "./MusicPlayer";
function Room(props) {
  const { roomcode } = useParams();
  const navigate = useNavigate();

  const [roomDetails, setRoomDetails] = useState({
    votes: 2,
    pause: false,
    ishost: false,
    showsettings: false,
    spotifyAuthenticated: false,
    song: {},
  });

  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    getRoomDetails();
    const id = setInterval(getCurrentSong, 13000);
    console.log(id);
    setIntervalId(id);

    // Clear the interval when the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);
  const getRoomDetails = () => {
    fetch("/api/get-room" + "?code=" + roomcode)
      .then((response) => {
        if (!response.ok) {
          props.leaveRoomCallback();
          navigate("/");
        }

        return response.json();
      })
      .then((data) => {
        if ('Room Not Found' in data) {
          console.log('message found');
        }
        setRoomDetails((prevRoomDetails) => ({
          ...prevRoomDetails,
          votes: data.votes,
          pause: data.pause,
          ishost: data.is_host,
        }));
        if (data.is_host) {
          authenticateSpotify();
          getCurrentSong();
        }
      });
  };

  const authenticateSpotify = () => {
    fetch('/spotify/is-authenticated')
      .then((response) => response.json())
      .then((data) => {
        if (!data.status) {
          fetch('/spotify/get-auth-url')
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  };
  


  const renderSettings = () =>{
    console.log("is shit");
    return(
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <CreateRoomPage update={true} 
        votes= {roomDetails.votes} 
        pause={roomDetails.pause}
        roomcode={roomcode}
        updateCallback={getRoomDetails}
        />
      </Grid>
      <Grid container spacing={1}>
      <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowsettings(false)}
        >
          close
        </Button>
      </Grid>      
    </Grid>);
  }

  const getCurrentSong = () => {
    fetch('/spotify/current-song')
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setRoomDetails((prevRoomDetails) => ({
          ...prevRoomDetails,
          song: data,
        }));
        console.log(data);
      });
  };
  
  const leaveButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      props.leaveRoomCallback;
      navigate("/");
    });
  };
  const updateShowsettings=(value)=>{
    setRoomDetails({
      votes: roomDetails.votes,
          pause: roomDetails.pause,
          ishost: roomDetails.ishost,
      showsettings:value,
    });
  };

  const renderSettingsButton=()=>{
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => updateShowsettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  };
  if (roomDetails.showsettings) {
    console.log("this");
    console.log(roomDetails.votes);
    console.log(roomDetails.pause);
    console.log(roomDetails.ishost);
    
    console.log(roomcode);
    
    return (renderSettings());
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Code: {roomcode}
        </Typography>
      </Grid>
      <MusicPlayer {...roomDetails.song}
      style={{
            backgroundColor:"beige",
          }}/>
      {roomDetails.ishost ? renderSettingsButton() : null}

      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={leaveButtonPressed}
        >
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}

export default Room;
