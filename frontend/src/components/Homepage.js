import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoom";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomcode: null,
    };
    this.clearRoomCode = this.clearRoomCode.bind(this);

  }

  async componentDidMount() {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          roomcode: data.code,
        });
      });
  }

  renderHomePage() {

     if (this.state.roomcode){
      console.log(this.state.roomcode) 
     }
      return (
        <Grid container spacing={3}>
          {this.state.roomcode ? 
        <Grid item xs={12} align="center">
        <Typography variant="h6" compact="h6">
          Enter using this code: {this.state.roomcode}
        </Typography>
        <Typography variant="p" compact="p">
         Check if this room exists by joining else create new one or join our existing rooms!
        </Typography>
      </Grid>
        :
        null
          }
          <Grid item xs={12} align="center">
            <Typography variant="h3" compact="h3">
              House Party
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <ButtonGroup disableElevation variant="contained" color="primary">
              <Button color="primary" to="/join" component={Link}>
                Join a Room or Join your previous room entering your code
              </Button>
              <Button color="secondary" to="/create" component={Link}>
                Create a Room
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      );
    
  } 
  clearRoomCode() {
    this.setState({
      roomcode: null,
    });
  }
  render() {

      return (
        <Router>
          <Routes>
          <Route exact path="/" element={this.renderHomePage()}/>
            <Route path="/join" element={<RoomJoinPage />} />
            <Route path="/create" element={<CreateRoomPage />} />
            <Route
            path="/room/:roomcode" element={<Room  leaveRoomCallback={this.clearRoomCode}/>}
            
          />          </Routes>
        </Router>
      );
  }
}