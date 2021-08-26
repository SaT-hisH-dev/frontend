import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Input,
  List,
  ListItem,
  ListItemText,
  Typography,
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
const live = "https://videocall-be.herokuapp.com/";
const local = "http://localhost:5000/";
const socket = io.connect(live);
const TYPING_TIMER_LENGTH = 400; // ms
function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  let typing = false;
  let lastTypingTime;
  const [messageFlag, setmessageFlag] = useState(true);
  const [receiveMessage, setreceiveMessage] = useState([]);
  useEffect(() => {
    socket.on("user joined", (username, number) => {
      console.log(username, number, "check");
    });

    // socket.on("typing", (data) => {
    //   setreceiveMessage((v) => [...v, data]);
    // });

    socket.on("new message", (data) => {
      setreceiveMessage((v) => [...v, data]);
    });
  }, []);

  const nameHandle = (e) => {
    setName(e.target.value);
  };
  const saveName = () => {
    socket.emit("add user", name);
    setmessageFlag(false);
  };

  const messageHandle = (e) => {
    updateTyping();
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    socket.emit("new message", message);
    setreceiveMessage((v) => [...v, { username: "You", value: message }]);
    setMessage("");
  };
  const updateTyping = () => {
    if (!typing) {
      typing = true;
      socket.emit("typing");
    }
    lastTypingTime = new Date().getTime();

    setTimeout(() => {
      const typingTimer = new Date().getTime();
      const timeDiff = typingTimer - lastTypingTime;
      if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
        socket.emit("stop typing");
        typing = false;
      }
    }, TYPING_TIMER_LENGTH);
  };

  console.log(receiveMessage, "receiveMessage");
  return (
    <>
      {messageFlag ? (
        <>
          {" "}
          <Input
            type="text"
            value={name}
            placeholder="Enter your name"
            onChange={nameHandle}
          />
          <Button onClick={saveName}>Save</Button>
        </>
      ) : (
        <>
          {receiveMessage.map((val) => {
            console.log(val);
            return (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {val.username}
                  </Typography>
                  <Typography color="textSecondary">{val.value}</Typography>
                </CardContent>
              </Card>
            );
          })}
          <Input
            type="text"
            placeholder="Enter your message"
            value={message}
            onChange={messageHandle}
          />
          <Button onClick={sendMessage}>Send</Button>
        </>
      )}
    </>
  );
}

export default App;
