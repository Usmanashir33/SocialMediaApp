import { faArrowLeft, faAt, faBackward, faBackwardFast, faBan, faBasketShopping, faCamera, faComment, faCommentSlash, faDeleteLeft, faEdit, faFileImport, faMicrophone, faMultiply, faRightToBracket, faSignOutAlt, faTrash, faUserMinus, faUserPlus, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import useFetchChats from "./FetchFriendChats";
import MessageCard from "./messageCard";
import useSendMessage from "./PostingData";
import useWebSocketHook from "./WebSocketSender";
import { authContext } from "../contexts/AuthContext";
import config from "../hooks/Config";
import { liveChatContext } from "./LiveChatContext";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";
import { uiContext } from "../contexts/UiContext";
import useAddData from "./PostingData";
import useAction from "../hooks/ActionsHooks";
import SearchingCard from "./SearchingCard";
import Camera from "../components/Camera";
import AudioRecorder from "../components/AudioRecorder";
import { dataRendingContext } from "../contexts/DataRending";
import VideoPlayer from "../components/VideoPlayer";

const RoomCommunity = () => {
    const [selecteds,setSelecteds] =useState(null);
    const [fileType,setFileType] = useState();
    const [messageFile,setFile] = useState(null);
    const [camera,setCamera] = useState(false);
    const [audioRecorder,setAudioRecorder] = useState(false);
    const [fileName,setFileName] = useState(null);
    const [lastBox,setLastBox] = useState(false);

    const history = useHistory();
    const [communityName,setCommunityName] = useState('')
    const [addingAction,setAddingAction] = useState('')
    const [communityField,setCommunityField] = useState('')
    const [showComForm,setShowComForm] = useState(false)
    const {id} = useParams()
    const {currentUser} = useContext(authContext)
    const getchatsLink = `livechat/community/${id}/`;
    const socketLink = `${config.WS_URL}/community/${id}/`;
    const {showCardDD} = useContext(uiContext);
    const {fileDisplayer} = useContext(dataRendingContext) ;
    const {empty,chats,setChats,fetchChats} = useFetchChats() ;
    const [message,setMessage] = useState(''); // messsage input
    const [messages,setMessages] = useState(null); // grabed from chats in effect 
    const resetForm = () => {
        setMessage('');
        removeSelected();
    }
    const {sendMessage,connectSecket} = useWebSocketHook(messages,setMessages,resetForm,socketLink,'noform');
    const {doAdd :doUpdate} = useAddData(`livechat/community/${id}/`,communityName,setCommunityName,setShowComForm,"PUT");
    const {doAdd :doAddUser} = useAddData(`livechat/alter-membership/${id}/`,communityName,setCommunityName,setShowComForm,"POST");
    const {doAdd :doDelete} = useAddData(`livechat/community/${id}/`,communityName,setCommunityName,setShowComForm,"DELETE");
    const {sendAction:extitCommunity} = useAction("EXIT","/community");
    const {sendAction:stopChatCommunity} = useAction("ONLYADMIN",``);
    const {setFriendSelected,messageDC,refreshHome} = useContext(liveChatContext);
    const [allowChat,setAllowChat] = useState(true);
    const [admin,setAdmin] = useState(true);
    const [members,setMembers] = useState([]);
    const [manageUsers,setManageUsers] = useState(false);
    const messagesRef = useRef(null);
    
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
   
    const handleSubmit = (e) => {
        e.preventDefault();
        // const newMessage = {message}
        const newMessage = {
            status:"message",
            withFile : messageFile? true:false ,
            message
        }
        if (message || messageFile){
            const filenameD = messageFile? fileName? fileName  :messageFile.name : null
            sendMessage(newMessage,messageFile,filenameD);
        }
    }
    
    const addUser = (e,action) => {
        setAddingAction(action);
        setManageUsers(true);
        
    }
    const handleExit = (e) => {
        extitCommunity(`/livechat/exit-community/${id}/`);
    }
    const handleStopChatCommunity = (e) => {
        stopChatCommunity(`/livechat/stopchat-community/${id}/`);
    }
    const handleDelete = (e) => {
        document.querySelector(".comment-form-dialog").showModal();
    }
    const hideDialog = (e) => {
        document.querySelector(".comment-form-dialog").close();
    }
    const confirmDelete = (e) => {
        document.querySelector(".comment-form-dialog").close();
        doDelete();
    }
    const handleUpdate = (e) => {
        const name = {name:communityField}
        e.preventDefault();
        if (communityField == communityName){
            alert("sorry you can not send same name")
        } else {
            doUpdate(name);
        }
    }
    const handleTextareaChange = (e) => {
        setMessage(e.target.value);
    };
    const scrollToBottom = () => {
        if (messagesRef.current){
            messagesRef.current.scrollIntoView({ behavior: 'smooth',block:"nearest"});
        }
    }
    const handlePopState = (e) => {
        setFriendSelected(false);
    };
    useEffect(() => {
        window.addEventListener("popstate", handlePopState);
        return () => {
            // window.removeEventListener("popstate", handlePopState);
        };
    }, [setFriendSelected]);
    useEffect(() => {
        fetchChats(getchatsLink);
        connectSecket(socketLink);
    },[id,refreshHome])
    useEffect(() => {
        if (chats){
            setMessages(chats.chats)
            setMembers(chats.members)
            setCommunityField(chats.name)
            setCommunityName(chats.name)
            setAdmin(
                chats.admins?chats.admins.find((id) => id == currentUser.id) : []
            )
            if (chats.only_admin_chat){
                setAllowChat(false);
            } else{
                setAllowChat(true);
            }
        }
    },[chats])
    useEffect(() => {scrollToBottom()},[messages]) // effect to show last message
    return ( 
        <div className="chat-room relative">

            <dialog className="comment-form-dialog room-dialog ">
                <form action="" className="flex-center-colum">
                    <div className="dialog-question  room-dialog-text">
                        Are you sure you want permanently<span className="delete"> close and delete</span> this Community?
                    </div>
                    <button type="button" className="cancel-dialog room-dialog-btn" onClick={hideDialog}>no cancel</button>
                    <button type="button" className="confirm-action room-dialog-btn dlt-txt" onClick={confirmDelete}>yes delete!</button>
                </form>
            </dialog>

            <header className="room-header ">
                <div className="haeder-content">
                <div className="back-icon" onClick={() => {setFriendSelected(null)}}>
                    <FontAwesomeIcon icon={faArrowLeft}/>
                </div>

                <div className="">
                    {/* { followedMe && <div className="follow-me">follows you</div>} */}
                    <span className='child-link' onClick={(e) => {e.stopPropagation()}} >
                        <img src={`${config.BASE_URL}${chats?.picture}`} alt="p-pic" className='profile-image' />
                    </span>
                </div>

                <div className="names">
                    <div className="names">
                        <span className="bold name">
                            {chats && communityName}
                        </span>
                    </div>

                    <div className="header-title">
                        <Link to={`/community/${id}/members`} >
                            {(chats && members.length > 1) && `${members.length} members`} 
                            {(chats && members.length <= 1) &&  `${members.length} member`}
                        </Link>
                    </div>
                    
                </div>
                </div>
                <div className="post-dot" onClick={(e) => {showCardDD(e,`community-room-dot`)}}>
                <div className="post-dot-container dropdown hidden hight-index" id={`community-room-dot`}>
                        {(chats && admin ) &&
                            <div className="flex">
                                 <FontAwesomeIcon className="dd-icon" icon={faEdit}/>
                                <span className="" onClick={(e) =>  {setShowComForm(true)}}>
                                changa name
                            </span>
                        </div>}

                        {(chats && chats.creator ==currentUser.id ) &&
                            <div className="flex" >
                                <FontAwesomeIcon className="dd-icon" icon={faTrash}/>
                                <span className="" onClick={(e) => {handleDelete(e)}}> delete</span>
                        </div>}
                        {(chats && admin ) &&
                            <div className="flex">
                                 <FontAwesomeIcon className="dd-icon" icon={allowChat? faCommentSlash : faComment}/>
                            <span className="" onClick={(e) => {handleStopChatCommunity(e)}}>
                                {allowChat? 'suspend chat' : 'allow chats'}
                            </span>
                        </div>}
                        {(chats && admin) &&
                            <div className="flex">
                                 <FontAwesomeIcon className="dd-icon" icon={faUserPlus}/>
                            <span className="" onClick={(e) => {addUser(e,'add')}}>
                                add users
                            </span>
                        </div>}
                        {(chats && admin) &&
                            <div className="flex">
                                 <FontAwesomeIcon className="dd-icon" icon={faUserMinus}/>
                            <span className="" onClick={(e) => {addUser(e,'remove')}}>
                               remove users
                            </span>
                        </div>}
                        {(chats && chats.creator !==currentUser.id ) &&
                        <div className="flex">
                             <FontAwesomeIcon className="dd-icon" icon={faSignOutAlt}/>
                            <span className="red-txt" onClick={(e) => {handleExit(e)}}> exit from community </span>
                        </div>}
                </div>
                    <FontAwesomeIcon icon={faEllipsisV}/>
                </div>
            </header>

            <div className="absolute absolute-camera">
                {camera && <Camera getCameraData ={getCameraData} close ={setCamera}/>}
                {audioRecorder && <AudioRecorder getSoundData ={getSoundData} close ={setAudioRecorder} />}
            </div>

            {manageUsers && <SearchingCard members={members} addMembers = {doAddUser} action={addingAction} close = {setManageUsers}/>}
            {showComForm && <div className="community-form" id={"new-community-form"}>
                <form >
                    <FontAwesomeIcon icon={faMultiply} shake className="canceler-icon" onClick={() => {setShowComForm(false)}}/>
                    <input type="text" name="community" className="community-field" maxLength={"20"} onClick={(e) => {e.stopPropagation()}}
                    autoFocus value={communityField} onChange={(e) => {setCommunityField(e.target.value)}} placeholder="choose community name " />
                    <div className="community-button" onClick={(e) => {e.stopPropagation()}}>
                        <span>avoid changing names regularly</span>
                        <button type="button" onClick={(e) => {handleUpdate(e)}}>update</button>
                    </div>
                </form>
            </div>}

            {/* messages  */}
            <div className="chat-messages custom-overflow" >
                {messages && messages.map((chat) => {
                    const myChat = (chat.chat_community.slice(0,1)) == id;
                    if (myChat) {
                        return <MessageCard chat={chat} group = {true}  key={chat.id}/>
                    }else {
                        return null 
                    }
                    
                })}
            <div  className="shower" ref={messagesRef}></div>
            </div>
        {/* </div> */}
            <div className="room-footer">
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
                { (!allowChat) && <span  className="only-admin">
                    only admin can send message!
                </span>}
                {( allowChat || admin ) && 
                <form  onSubmit={(e) => {handleSubmit(e)}} className="message-form">
                    <div className="left-icons">
                        <label htmlFor="camera">
                            <FontAwesomeIcon icon={faAt} className="add-media-icon gray"
                            onClick={(e) => {setLastBox(!lastBox)}}/>
                        </label>
                        <label htmlFor="recorder">
                            <FontAwesomeIcon icon={faMicrophone} className="add-media-icon gray"
                            onClick={(e) => {setAudioRecorder(!audioRecorder);setCamera(false);setLastBox(false)}}/>
                        </label>
                    </div>
                    <textarea value={message} onChange={((e) => {
                        handleTextareaChange(e)})} name="" id="text-area" autoFocus placeholder="write your message">
                    </textarea>
                     <input type="submit" value='send'  />
                </form>}
                { (lastBox && !selecteds) && <div className="file-selection-section">
                <div className="add-media">
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
 
export default RoomCommunity;