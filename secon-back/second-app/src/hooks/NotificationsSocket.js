import React, { useContext, useEffect, useRef} from 'react';
import { authContext } from '../contexts/AuthContext';
import { dataRendingContext } from '../contexts/DataRending';
import { liveChatContext } from '../livechart/LiveChatContext';

const  useNotificationSocket = (url) => {
  // useRef to hold the WebSocket instance
  const {refreshHome,setRefreshHome,} = useContext(liveChatContext)
  const {setNotifications,notifications} = useContext(dataRendingContext);

  const {getToken} = useContext(authContext)
  const webSocketRef = useRef(null);

  const setNewNotification = (newNotif) => {
    console.log(newNotif,'new notif');
    setNotifications([newNotif,...notifications] )
  }
    
    const connectSecket = () => {
      // Initialize the WebSocket connection and assign it to webSocketRef.current
    webSocketRef.current = new WebSocket(`${url}?token=${getToken()}`,);

    webSocketRef.current.onopen = () => {
      console.log('notifications  opened');
    };

    webSocketRef.current.onclose = () => {
      console.log('notifications closed closed');
    };

    webSocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    }
    useEffect(() => {
       
    },[]); // Empty dependency array means this effect runs only once

  if (webSocketRef.current) {
    webSocketRef.current.onmessage = async function (e){
        let data = JSON.parse(e.data)
        setNewNotification(data)
    }
  }

  return {connectSecket};
}

export default useNotificationSocket;
