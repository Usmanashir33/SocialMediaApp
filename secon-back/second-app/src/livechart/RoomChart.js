import { faArrowLeft, faAt, faBan, faCamera, faEllipsisV,  faFileImport, faFlag,  faMicrophone, faMultiply,  faVideoCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min";
import useFetchChats from "./FetchFriendChats";
import MessageCard from "./messageCard";
import useWebSocketHook from "./WebSocketSender";
import { authContext } from "../contexts/AuthContext";
import config from "../hooks/Config";
import { liveChatContext } from "./LiveChatContext";
import VideoPlayer from "../components/VideoPlayer";
import { dataRendingContext } from "../contexts/DataRending";
import Camera from "../components/Camera";
import AudioRecorder from "../components/AudioRecorder";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import CallingUI from "./CallingUI";
import { CallingContext } from "./CallingContext";
import VideoCallUi from "./VideoCallUI";
import { uiContext } from "../contexts/UiContext";
import useDeleteData from "../hooks/DeleteData";
import useBlocking from "../hooks/BlockUser";

const RoomChart = () => {
    const [selecteds,setSelecteds] =useState(null);
    const [fileType,setFileType] = useState();
    const [messageFile,setFile] = useState(null);
    const [camera,setCamera] = useState(false);
    const [audioRecorder,setAudioRecorder] = useState(false);
    const [fileName,setFileName] = useState(null);
    const [lastBox,setLastBox] = useState(false);

    // const history = useHistory();
    const {id} = useParams()
    const {currentUser} = useContext(authContext);
    const getUerLink = `livechat/chatroom/${id}/`;
    //const socketLink = `ws://${window.location.host}/dm/chatroom/${id}/`;
    const socketLink = `${config.WS_URL}/chatroom/dm/${id}/`;
    const {chats,fetchChats} = useFetchChats();
    const [message,setMessage] = useState(''); // messsage input
    const [messages,setMessages] = useState(null); // grabed from chats in effect 
    const {showCardDD} = useContext(uiContext);
    const [isBlocked,setIsBlocked] = useState(null);
    const {toggleBlock} = useBlocking(setIsBlocked);
    const {theme} = useContext(uiContext)
    const cardStyle = {
        backgroundColor : theme.bgColor,
    }
    const textStyle = {
        color : theme.color,
    }
   
    const textStyle2 = {
        color : theme.iconColor2,
        backgroundColor : theme.bgColor,
    }
   
    const iconStyle = {
        color : theme.iconColor,
    }

    const resetForm = () => {
        setMessage('');
        removeSelected();
    }
    const {sendMessage,connectSecket,readUnreadMessages,deleteMessageForAll} = useWebSocketHook(messages,setMessages,resetForm,socketLink,id)
    const {setFriendSelected} = useContext(liveChatContext);
    const {doDelete} = useDeleteData(messages,setMessages);
    const {fileDisplayer,amBlocked,setAmBlocked} = useContext(dataRendingContext);
    const messagesRef = useRef(null);

    // calling parameters 
    const {callType,setCallType,callingMode,setCallingMode,
            floating,setFloating,caller,setCaller,setCalledFriend,
            incoming
        }  = useContext(CallingContext);
    
    const callfriend = () => {
        if (!callingMode ){
            setCalledFriend(chats);
            setCaller(currentUser);
            setFloating(false);
            setCallType('voice');
            setCallingMode(true);
        }
    }
    const vCallfriend = () => {
        if (!callingMode ){
            setCalledFriend(chats);
            setCaller(currentUser);
            setFloating(false);
            setCallType('video');
            setCallingMode(true);
        }
    }
    const checkIfBlocked = () => {
        const isBlocke = currentUser?.blocked_users.find(({id}) => id === chats?.id)
        isBlocke? setIsBlocked(true) : setIsBlocked(false)
    }
    const amIBlocked = () => {
        const imBlocked = chats?.blocked_users.find(({id}) => id === currentUser?.id)
        imBlocked? setAmBlocked(true) : setAmBlocked(false)
    }
    useEffect(() => {
        if (chats){
            checkIfBlocked();
            amIBlocked();
        }
    },[chats,id])

    useEffect(() => { // floating effect 
        if (caller.id == id){
            setFloating(false);
        }else{
            setFloating(true);
        }
        return(() => {
            setFloating(true);
        })
    },[incoming]) 
    const handleFileSelection = async (e) => {
        setFileName(null);
        setLastBox(false);
        const file = e.target.files[0];
        setFile(file);
        // await setBase64(file); // convert it to text 
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setFileType(file.type);
            setSelecteds(fileUrl)
        }
    }
    const removeSelected = (e) => {
        setSelecteds(null);
        setFile(null);
        setFileType();
        setLastBox(false);
    }
    const dataURLToBlob = (dataURL) => {
        const [header, data] = dataURL.split(',');
        const mime = header.match(/:(.*?);/)[1];
        const byteString = atob(data);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
    
        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }
        return new Blob([uint8Array], { type: mime });
    };
    
    const getCameraData = async (cameraFile,cameraFileType,pictureName,camera) => {
        setFileType(cameraFileType);
        setFileName(pictureName);
        setCamera(camera);
        setLastBox(false);
        if (cameraFileType == "image") {
            setSelecteds(cameraFile);
            let image = dataURLToBlob(cameraFile);
            setFile(image);
        } else {
            const videoUrl = URL.createObjectURL(cameraFile);
            setSelecteds(videoUrl);
            setFile(cameraFile);
        }
    }
    const getSoundData = async (files,fileType,fileName,showRecorder) => {
        setFileName(fileName);
        setFileType(fileType);
        setAudioRecorder(showRecorder);
        setLastBox(false);
        const audioUrl = URL.createObjectURL(files); // create url for the blob
        setSelecteds(audioUrl);
        setFile(files);
        
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newMessage = {
            status:"message",
            withFile : messageFile? true:false ,
            message,
            user_to:id,
            user_from:currentUser.id
        }
        if (message || messageFile){
            const filenameD = messageFile? fileName? fileName  :messageFile.name : null
            sendMessage(newMessage,messageFile,filenameD);
        }
    }
    const handleTextareaChange = (e) => {
        setMessage(e.target.value);
    };
    const scrollToBottom = () => {
        if (messagesRef.current){
            // messagesRef.current.scrollIntoView({ behavior: 'smooth'});
            messagesRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
            // messagesRef.current.scrollIntoView();
        }
    }
    useEffect(() => {
        const handlePopState = (e) => {
            setFriendSelected(null);
        };
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [setFriendSelected]);

    const handlePopState = (e) => {
        setFriendSelected(false);
        // if (callingMode){
            setFloating(true);  // if we are in call float the call
        // }
    };

    useEffect(() => {
        window.addEventListener("popstate", handlePopState);
        return () => {
            // window.removeEventListener("popstate", handlePopState);
        };
    }, [setFriendSelected]);

    useEffect(() => {
        fetchChats(getUerLink);
        if (id !== undefined){
            connectSecket();
        }
    },[id])

    useEffect(() => {
        if (chats){
            setMessages(chats.chats)
        }
    },[chats])
    // },[])

    useEffect(() => {
        scrollToBottom();
    },[messages]) // effect to show last message

   
    return ( 
        <div className="chat-room relative chat-background " style={{
            backgroundImage : `url(${process.env.PUBLIC_URL}/image/9.jpg)`,
            backgroundColor: theme.bgColor
        }}>
            {(callingMode && !floating && (callType === "voice")) && <CallingUI />}
            {(callingMode && !floating && (callType === "video")) &&
                <VideoCallUi/>
            }
            <header className="room-header" style={cardStyle}>
                <div className="haeder-content">
                    <div className="back-icon " onClick={() => {setFriendSelected(null)}}>
                        <FontAwesomeIcon icon={faArrowLeft} style={iconStyle}/>
                    </div>

                    <div className="">
                        <Link to={`/main/profile/${id}`} className='child-link' onClick={(e) => {e.stopPropagation()}} >
                            { chats?.picture && <img src={`${config.BASE_URL}${chats.picture}`} alt={`pic`} className='profile-image dm-profile-imag'/>}
                        </Link>
                    </div>

                    <div className="user-details">
                        <div className="user-names">
                            <span className="bold user-name" style={textStyle}>
                                { chats.first_name ? `${chats.first_name} ${chats.last_name}` : 'Anonymous_user'}
                            </span>
                            <span className="post-username"> @ {chats && chats.username}</span>
                        </div>
                        <div className="header-title" style={textStyle2}>
                            {chats && chats.profile.title} 
                        </div>
                    </div>
                    </div>

                    <div className=" calls mr-10 ">
                        {!callingMode &&  <FontAwesomeIcon icon={faVideoCamera} style={iconStyle} className="call-icon " 
                            onClick={(e) => {vCallfriend(e)}}
                        />}
                        {!callingMode &&  <FontAwesomeIcon icon={faPhone} style={iconStyle} className="call-icon" 
                            onClick={(e) => {callfriend(e)}}
                        />}
                        
                        <div className="post-dot ml-10" onClick={(e) => {showCardDD(e,`community-room-dot`)}}>
                                <div className="post-dot-container dropdown hidden hight-index" id={`community-room-dot`}>
                                    {
                                        <div className="flex" >
                                           <FontAwesomeIcon className="dd-icon" icon={faBan}/>
                                           {/* <FontAwesomeIcon className="dd-icon" icon={faUnlock}/> */}
                                            <span className="" onClick={(e) => {
                                                toggleBlock(`/accounts/user/${chats?.id}/block/`)}
                                                }>{isBlocked? "Unblock" : "Block"} </span>
                                    </div>}
                                    {
                                        <div className="flex" >
                                            <FontAwesomeIcon className="dd-icon" icon={faFlag}/>
                                            <span className="" onClick={(e) => {}}>Report</span>
                                    </div>}
                                </div>
                                <FontAwesomeIcon icon={faEllipsisV} className="call-icon "/>
                        </div>
                    </div>
                    
            </header>

            <div className="absolute absolute-camera">
                {camera && <Camera getCameraData ={getCameraData} close ={setCamera}/>}
                {audioRecorder && <AudioRecorder getSoundData ={getSoundData} close ={setAudioRecorder} />}
            </div>

            <div className="chat-messages custom-overflow " >
                {messages && messages.map((chat) => {
                    const grabFriend = (chat.user_to == id || chat.user_from.id == id);
                    if (grabFriend) {
                        return <MessageCard chat={chat}  group={null} key={chat.id}
                         messageReader = {readUnreadMessages}
                        deleteMessage = {doDelete} deleteMessageForAll ={deleteMessageForAll}/>
                    }else {
                        return null 
                    }
                })}
                <div  className="shower-1"></div>
                <div  className="shower" ref={messagesRef}></div>
               
            </div>

            <div className="room-footer" >
                {isBlocked && <div  className="blocked-text" on onClick={(e) => {
                    toggleBlock(`/accounts/user/${chats?.id}/block/`)
                }}> Blocked Friend! Click to Unblock</div>}
                
                <div className="file-previewer">
                            { selecteds &&
                            <div className="relative">
                                { fileDisplayer(fileType)[0] === 'image' &&
                                    <div  className="relative">
                                        <img src={selecteds} alt="preview image" className="preview-file" />
                                    </div>}
                                { fileDisplayer(fileType)[0] === 'audio' &&
                                    <div  className="relative">
                                        <audio id ='audio-player' src={selecteds} controls>
                                            media not supported 
                                        </audio>
                                    </div>}
                                { fileDisplayer(fileType)[0] === 'video' && 
                                    <div  className="relative">
                                        <VideoPlayer 
                                            filepath = {`${selecteds}`}
                                            videotype = {`video/${fileDisplayer(fileType)[1]}`}
                                            className={'preview-file wide'}
                                            controls={true}
                                            autoPlay={false}
                                        />
                                    </div>
                                }
                                <FontAwesomeIcon icon={faMultiply} className="selected-remover" onClick={(e) => {removeSelected(e)}}/>
                            </div>
                             }
                </div>

                {!amBlocked && <form  onSubmit={(e) => {handleSubmit(e)}} className="message-form" style={cardStyle}>
                <div className="left-icons">
                    <label htmlFor="camera">
                        <FontAwesomeIcon icon={faAt}style={iconStyle} className="add-media-icon gray" onClick={(e) => {setLastBox(!lastBox)}}/>
                    </label>
                    <label htmlFor="recorder">
                        <FontAwesomeIcon icon={faMicrophone}style={iconStyle} className="add-media-icon gray" onClick={(e) => {setAudioRecorder(!audioRecorder);setCamera(false);setLastBox(false)}}/>
                    </label>
                </div>
                    <textarea value={message} onChange={((e) => {handleTextareaChange(e)})}
                        name="" id="text-area"
                        placeholder="write your message ">
                    </textarea>
                    <input type="submit" value='send'  />
                </form>}
                {amBlocked && <div className="amblocked-txt">
                    you are blocked contact the <b>friend</b> to unblock you!
                    </div>}

                { (lastBox && !selecteds) && <div className="file-selection-section">
                <div className="add-media ">
                            <span>
                                <label htmlFor="camera">
                                    <FontAwesomeIcon icon={faCamera} className=" big-icon" onClick={(e) => {setCamera(!camera);setLastBox(false);setAudioRecorder(false)}}/>
                                </label>
                            </span>

                            <span>
                                <label htmlFor="file">
                                    <FontAwesomeIcon icon={faFileImport} className="big-icon" />
                                </label>
                                <input type="file" name="file" id="file" className="hidden" onChange={(e) => {
                                    handleFileSelection(e);
                                }} />
                            </span>
                    </div>
                </div>}
            </div>
        </div>

     );
}
 
export default RoomChart;