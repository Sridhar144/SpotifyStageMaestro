import React,{useState} from 'react'
import {
    Button,
    Grid,
    Typography,
    TextField,
    FormHelperText,
    FormControl,
    Radio,
    RadioGroup,
    FormControlLabel,
    Collapse
} from '@material-ui/core'
import {Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import Alert from "@material-ui/lab/Alert"
function CreateRoomPage(props){
    const navigate = useNavigate();

    
    const [backData,setBackData]=useState({
        pause: props.pause,
        votes:props.votes,
        successMsg:"",
        errorMsg:"",
        roomcode: props.roomcode
    })

    const handleVotesChange=(e)=>{
        setBackData(data=>({
            ...data,
            votes:e.target.value
        }))
    }

    const handlepauseChange=(e)=>{
        setBackData(data=>({
            ...data,
            pause:e.target.value=='true'?true:false
        }))
    }

    const handleRoomButtonPressed=async()=>{
        const feedBack = await fetch('api/create-room',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                votes:backData.votes,
                pause:backData.pause
            })
        })
        const JsonFeedBack = await feedBack.json()
        console.log(JsonFeedBack)
        fetch("/api/create-room",JsonFeedBack)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            navigate(`/room/${JsonFeedBack.code}`)
        });
        
    }

    const handleUpdateButtonPressed = () => {
        const feedBack = {
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                votes:backData.votes,
                pause:backData.pause,
                code:backData.roomcode
            })
        }
        fetch("/api/update-room",feedBack)
        .then((response) => {
            if (response.ok){
                    setBackData(({
                        successMsg:"Room updated successfully. Hit close and come back again if you want to change settings"
                    }))
                
            }
            else{
                setBackData(({
                    errorMsg:"Room couldnt be updated successfully"
                }))

            }
            props.updateCallback();
        })
        .then((data) => {
            console.log(data);
            // navigate(`/room/${JsonFeedBack.code}`)
        });
        
    }

    const renderCreateButtons=()=>{
        return (
         <Grid container spacing={1}>
            <Grid 
            item
            xs={12}
            align="center"
            >
                <Button
                color="primary"
                variant="contained"
                onClick={
                    handleRoomButtonPressed
                }
                >
                        Create A Room
                </Button>
            </Grid>
            <Grid 
            item
            xs={12}
            align="center"
            >
                <Button
                color="secondary"
                variant="contained"
                to="/" component={Link}
                >
                    Back
                </Button>
            </Grid>
        </Grid>
        );
                
    }
    const renderUpdateButtons=()=>{
        return (
         <Grid container spacing={1}>
            <Grid 
            item
            xs={12}
            align="center">
                <Collapse in ={backData.errorMsg!="" || backData.successMsg!=""}>
                    {backData.successMsg!="" ? (<Alert severity="success">{  backData.successMsg  }</Alert>) : (<Alert severity='error'>{  backData.errorMsg  }</Alert>)}
                </Collapse>
            </Grid>
            <Grid 
            item
            xs={12}
            align="center"
            >
                <Button
                color="primary"
                variant="contained"
                onClick={
                    handleUpdateButtonPressed
                }
                >
                        Update the Room
                </Button>
            </Grid>
            </Grid>
        );
    }
    const title=props.update ? "Update Room" : "Create a Room"
    return (
        <Grid container spacing={1}
        >
            <Grid item xs={12} align="center"
            >
                <Typography component="h4" variant="h4"
                >
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
            <FormControl
            component="fieldset"
            >
                <FormHelperText>
                    <div align="center">
                    Guest control of playback state
                    </div>
                </FormHelperText>
                <RadioGroup
                row
                defaultValue={props.pause.toString()}
                onChange={handlepauseChange}
                >
                    <FormControlLabel value="true"
                    control={
                        <Radio color="primary"/>
                    }
                    label="Play/Pause"
                    labelPlacement="bottom"
                    />
                    <FormControlLabel value="false"
                    control={
                        <Radio color="secondary"/>
                    }
                    label="No Control"
                    labelPlacement="bottom"
                    />
                </RadioGroup>
            </FormControl>
            </Grid>
            <Grid 
            item
            xs={12}
            align="center"
            >
                    <FormControl>
                        <TextField
                        required={true}
                        type="number"
                        onChange={handleVotesChange}
                        defaultValue={backData.votes}
                        inputProps={{
                            min:1,
                            style:{
                                textAlign:"center"
                            }
                        }}
                        />
                        <FormHelperText>
                            <div align="center">
                            Votes required to skip song
                            </div>
                        </FormHelperText>
                    </FormControl>
            </Grid>
            {props.update ? renderUpdateButtons() : renderCreateButtons()}
            </Grid>
    )
}

CreateRoomPage.defaultProps = {
    votes: 10,
    pause: true,
    update:false,
    roomcode:null,
    updateCallback: ()=>{},
  };

 
export default CreateRoomPage
