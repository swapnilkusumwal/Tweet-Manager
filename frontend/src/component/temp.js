import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const Loggedin = () => {
  const [yourID, setYourID] = useState();

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('http://localhost:3000/');

    socketRef.current.on("your id", id => {
      setYourID(id);
    })

    socketRef.current.on("message", (message) => {
      console.log("here");
    })
  }, []);

  return (
    <div>
    </div>
  );
};

export default Loggedin;