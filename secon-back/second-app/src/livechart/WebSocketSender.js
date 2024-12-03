import React, { useContext, useEffect, useRef} from 'react';
import { authContext } from '../contexts/AuthContext';
import { liveChatContext } from './LiveChatContext';
import { dataRendingContext } from '../contexts/DataRending';

const  useWebSocketHook = (messages,setMessages,resetForm,url,frd_id) => {
  // useRef to hold the WebSocket instance
  const {setMessageCome,messageCome,refreshHome,setRefreshHome,} = useContext(liveChatContext)
  const {setAmBlocked} = useContext(dataRendingContext)

  const {getToken} = useContext(authContext);
  const webSocketRef = useRef(null);

  const toggleBlocking = (data) => {
    if (data.user_id == frd_id){ // we are in target friend room
      if (data.action === 'blocked'){
        setAmBlocked(true);
      }else if(data.action === 'unblocked'){
        setAmBlocked(false);
      }
    }
  }
  const setNewMessage = (newMessage) => {
      setMessages([...messages,newMessage]);
      resetForm();
      //setRefreshHome(!refreshHome);
      setMessageCome(!messageCome);
    }
  const setDeleteMessageForAll = (responseData) => {
    const deleted = responseData.response
    setMessages([...messages.map((message) => message.id === deleted.id ? deleted : message)]);
    setRefreshHome(!refreshHome);
    }
  const setReadMessages = () => {
    setMessages([...messages.map((message) => {
      if (!message.read){
        message.read = true;
        return message
      }else{
        return message
      }
    })]);
    
    // console.log(messages);
    setRefreshHome(!refreshHome)
    }
    const connectSecket = () => {

        // Initialize the WebSocket connection and assign it to webSocketRef.current
        webSocketRef.current = new WebSocket(`${url}?token=${getToken()}`,);
        webSocketRef.current.binaryType = 'arraybuffer'; // to handle media data as binary array

        webSocketRef.current.onopen = () => {
          console.log('WebSocket connection opened can read');
          readUnreadMessages();
         
        };

        webSocketRef.current.onclose = () => {
          console.log('WebSocket connection closed');
        };

        webSocketRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
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
        if (data?.status == 'unreadMessages'){
          console.log('data: ', data);
          setReadMessages()
        }else if (data?.status == 'deleteMessageForAll') {
          console.log('data: ', data);
          setDeleteMessageForAll(data)
        }else if (data?.status === 'blocking') { // information am blocked by particular user
          toggleBlocking(data);
        }else{
          setNewMessage(data)
          // console.log('data: ', data);
        }
    }
  }

  const sendMessage = (message,file,filename) => {
    // Use webSocketRef.current to send a message if the connection is open
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      const JsonData = JSON.stringify(message)
      const completeFile = JSON.stringify({
        status:"sent",
        withFile : false,
        filename:filename
      });
      console.log('JsonData: ', JsonData);
      webSocketRef.current.send(JsonData);
      if (file){
        webSocketRef.current.send(file);
        console.log('file: ', file);
        webSocketRef.current.send(completeFile);
      }
    } else {
      console.log('WebSocket is not open. ReadyState:', webSocketRef.current ? webSocketRef.current.readyState : 'N/A');
    }
  };

  const readUnreadMessages = (() => {
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN){
      const info = {
        status : "unreadMessages",
        user_from : frd_id
      }
      const JsonInfo = JSON.stringify(info)
      webSocketRef.current.send(JsonInfo);
    } else {
      console.log('WebSocket failed read unread messages. ReadyState:', webSocketRef.current ? webSocketRef.current.readyState : 'N/A');
    }
  });
  const deleteMessageForAll = ((message_id) => {
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN){
      const info = {
        status : "deleteMessageForAll",
        friend_id : frd_id,
        message_id : message_id
      }
      const JsonInfo = JSON.stringify(info)
      // console.log('JsonInfo delete all: ', JsonInfo);
      webSocketRef.current.send(JsonInfo);
    } else {
      console.log('WebSocket failed delete message for all. ReadyState:', webSocketRef.current ? webSocketRef.current.readyState : 'N/A');
    }
  });

  return {sendMessage,connectSecket,readUnreadMessages,deleteMessageForAll};
}

export default useWebSocketHook;
