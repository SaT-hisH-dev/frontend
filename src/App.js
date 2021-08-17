import {
  Divider,
  Input,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./App.css";
//"https://videocall-be.herokuapp.com/"
const socket = io.connect("http://localhost:5000/");

function App() {
  const [myName, setmyName] = useState("");
  const [message, setmessage] = useState("");
  const [myId, setmyId] = useState("");
  const [error, seterror] = useState("");
  const [senderId, setsenderId] = useState("");
  const [listmessage, setlistmessage] = useState([]);
  useEffect(() => {
    socket.on("self", (arg) => {
      console.log(arg);
      setmyId(arg);
    });

    socket.on("callUser", (arg) => {
      setlistmessage((val) => [...val, arg]);
    });
  }, []);

  const enterName = (e) => {
    setmyName(e.target.value);
  };

  const sendMessage = () => {
    setlistmessage((val) => [...val, { name: "you", message: message }]);

    socket.emit("callUser", { id: senderId, message: message, name: myName });
    setmessage("");
  };

  const onchangemessage = (e) => {
    setmessage(e.target.value);
    seterror("");
  };

  const senderHandle = (e) => {
    setsenderId(e.target.value);
  };

  return (
    <>
      <Input
        placeholder="Enter your name"
        name="myName"
        value={myName}
        type="text"
        onChange={enterName}
      />
      <Input
        placeholder="Enter sender id"
        name="senderId"
        value={senderId}
        type="text"
        onChange={senderHandle}
      />
      <Input
        name="message"
        value={message}
        onChange={onchangemessage}
        placeholder="Enter your message"
        type="text"
      />
      {error}
      <Button onClick={sendMessage}>Send</Button>
      yourId:{myId}
      {listmessage.map((mes) => {
        return (
          <>
            <List component="nav" aria-label="mailbox folders">
              <ListItem button>
                <ListItemText primary={mes.name} secondary={mes.message} />
              </ListItem>
              <Divider light />
            </List>
          </>
        );
      })}
    </>
  );
}

export default App;
