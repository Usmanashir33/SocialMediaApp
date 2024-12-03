import React, { useContext, useEffect, useRef} from 'react';
import { authContext } from '../contexts/AuthContext';
import { liveChatContext } from './LiveChatContext';
import { dataRendingContext } from '../contexts/DataRending';
import { CallingContext } from './CallingContext';

const  useCallingSocketHook = (url,signalIn) => {
    // useRef to hold the WebSocket instance
    const {getToken} = useContext(authContext);
    const webSocketRef = useRef(null);

    const connectCallSecket = () => {
        // Initialize the WebSocket connection and assign it to webSocketRef.current
        webSocketRef.current = new WebSocket(`${url}?token=${getToken()}`,);

        webSocketRef.current.onopen = () => {
          console.log('call Socket connection opened');
        };

        webSocketRef.current.onclose = () => {
          console.log('call Socket connection closed');
        };

        webSocketRef.current.onerror = (error) => {
          console.error('call Socket error:', error);
        };
    }
    useEffect(() => {
    return () => {
        if (webSocketRef.current) {
            webSocketRef.current.close();
        }}
    },[]); // Empty dependency array means this effect runs only once
  if (webSocketRef.current) {
    webSocketRef.current.onmessage = async function (e){
        let data = JSON.parse(e.data)
        signalIn(data);
    }
  }

  const sendSignal = (sgnl) => {
    // Use webSocketRef.current to send a message if the connection is open
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      const signal = JSON.stringify(sgnl)
     
      webSocketRef.current.send(signal);
      
    } else {
      console.log('calling Socket is not open. ReadyState:', webSocketRef.current ? webSocketRef.current.readyState : 'N/A');
    }
  };

  return {connectCallSecket,sendSignal};
}

export default useCallingSocketHook;
