import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faCamera, faFile, faFileImport, faMicrophone, faMultiply, faXmark } from "@fortawesome/free-solid-svg-icons";
import { dataRendingContext } from "./contexts/DataRending";
import usePostData from "./hooks/postData";
import VideoPlayer from "./components/VideoPlayer";
import Camera from "./components/Camera";
import AudioRecorder from "./components/AudioRecorder";
import config from "./hooks/Config";
import { authContext } from "./contexts/AuthContext";

const CommentForm = ({data,setData}) => {
    const [selectedFiles,setSelectedFiles] =useState(null);
    const [fileType,setFileType] = useState()
    const [file,setFile] = useState(null);
    const [camera,setCamera] = useState(false);
    const [audioRecorder,setAudioRecorder] = useState(false);
    const [picName,setPicName] = useState(null)
    const {clickedObjectId,commentFormType,setCommentFormType,setShowCForm} = useContext(dataRendingContext);
    const commentInput = document.querySelector('#comment');
    const  {post,fetchPost} = useContext(dataRendingContext);
    const  {currentUser} = useContext(authContext);
    const  {comment,fetchComment,fileDisplayer,setAlert} = useContext(dataRendingContext);
    const url = commentFormType == 'post'? `/posts/post/${clickedObjectId}/comments/` : `/posts/comment/${clickedObjectId}/replies/`
    const {doPost:sendData} =  usePostData(url,data,setData);
    const [textarea,setTextArea] = useState('');
    
    const displayDialog = () => {
        if (commentInput.value){
            document.querySelector("#comment-form-dialog-1").showModal();
            return true;
        }
        setShowCForm(false);
    }
    const hideDialog = (e) => {
        document.querySelector("#comment-form-dialog-1").close();
    }
    const clearForm = (e) => {
        setTextArea('');
        document.querySelector("#comment-form-dialog-1").close();
        setShowCForm(false);
        setFile();
    }
    const removeSelected = (e) => {
        setSelectedFiles();
        setFile();
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!textarea && !file){
            setAlert("reply message not found");
            return
        }
        const cFData = new FormData();
        cFData.append("body",textarea);
        if (picName){
            cFData.append("file",file,picName);
            // formData.append("file",file,"picName.jpg");
        }else{
            cFData.append("file",file );
        }
        sendData(cFData);
    }
    const handleSelectedFiles = (e) => {
        const file = e.target.files[0];
        console.log('file: ', file);
        
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setSelectedFiles(fileUrl)
            setFileType(file.type)
        }
        setFile(file);
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
        setPicName(pictureName);
        setFileType(cameraFileType);
        setCamera(camera);
        if (cameraFileType == "image") {
            setSelectedFiles(cameraFile);
            let image = dataURLToBlob(cameraFile);
            setFile(image);
        } else {
            const videoUrl = URL.createObjectURL(cameraFile)
            setSelectedFiles(videoUrl);
            setFile(cameraFile);
            console.log('cameraFile: ', cameraFile);
        }
    }
    const getSoundData = async (File,FileType,fileName,showRecorder) => {
        setPicName(fileName);
        setFileType(FileType);
        setAudioRecorder(showRecorder);
        const audioUrl = URL.createObjectURL(File); // create url for the blob
        setSelectedFiles(audioUrl);
        setFile(File);
    }
    useEffect(() => {
        if (commentFormType == 'post' && clickedObjectId ){
            fetchPost(`/posts/post/${clickedObjectId}/`);
        }else{
            fetchComment(`/posts/post/${clickedObjectId}/comment/`);
        }
    },[])
   
    const parent = commentFormType == 'post'? post : comment;
    const {first_name,last_name,username,picture} = parent? parent.user:'';
    // console.log(parent);
    return ( 
        <div className="add-comment-form custom-overflow">
            {/* dialog "" */}
            <dialog className="comment-form-dialog" id="comment-form-dialog-1">
            <form action="" className="flex-center-colum">
                <div className="dialog-question">
                     Are you sure you want Discard?
                </div>
                {/* <button type="button"onClick='cancelDialog()' className="cancel-dialog">Cancel</button>
                <button type="button"onClick='confirmDialog()' className="confirm-action">Confirm</button> */}
                <button type="button" className="cancel-dialog" onClick={hideDialog}>Cancel</button>
                <button type="button" className="confirm-action" onClick={clearForm}>Confirm</button>
            </form>
            </dialog>
            {/* form starts */}
             <div className = {`comment-container custom-overflow float-form`}>
                <form onSubmit={(e) => {handleSubmit(e)}} className="comment-form relative" id="comment-form">
                    <div className="form-header">
                        <button type="submit" id="reply-button" className="small-txt right-top ">Reply</button>
                        <div className="cancel" onClick={displayDialog}>
                            <FontAwesomeIcon icon={faXmark} className="comment" />
                        </div>
                        <div className="back " onClick={displayDialog}>
                            <FontAwesomeIcon icon={faArrowLeft} className="comment" />
                        </div>
                    </div>
                     
                     <div className="post-card borderless post-in-form">
                         <div className="post-col1 flex-center-colum">
                             <div className="post-in-form-image">
                                {/* <img src={process.env.PUBLIC_URL+`/image/GQhQqaiWcAAvVlx.jpeg`} className='profile-image' /> */}
                                <img src={`${config.BASE_URL}${picture}`} className='profile-image' />
                            </div>
                             <div className="v-line"></div>
                         </div>
                         <div className="post-col2">
                             <div className="post-header">
                                 <div className="user-data">
                                    <span className="post-name in-form-name"> 
                                    { first_name ? `${first_name} ${last_name}` : 'Anonymous_user'}
                                        
                                    </span>
                                    <span className="post-username in-form-username">@{username}</span>
                                    <span className="post-date in-form-date"> {parent && parent.user.date_joined}</span>
                                 </div>
                             </div>
                             <div className="post-txt in-form-txt">{parent && parent.body}</div>
                             <div className="replying-to">
                                 <span className="small-txt muted-txt">Replaying to </span><span className="in-form-username-link">
                                     <Link to={`profile/${parent && parent.user.id}/`} className="simple-link small-txt">@{username} </Link>
                                 </span>
                             </div>
                         </div>
                     </div>
 
                     <div className="post-card borderless post-in-form">
                         <div className="post-col1 ">
                            <div className="image">
                                <img src={`${config.BASE_URL}${currentUser?.picture}`} className='profile-image' />
                            </div>
 
                         </div>
                         <div className="post-col2">
                            {camera &&<Camera getCameraData ={getCameraData} close={setCamera}/>}
                            {audioRecorder && <AudioRecorder getSoundData ={getSoundData}/>}
                            <textarea name="comment" className='custom-overflow ' id="comment" autoFocus cols="30" rows="4" 
                             value={textarea} onChange={(e) => {setTextArea(e.target.value)}} placeholder="Post your reply"></textarea>
                         </div>
                     </div>

                    <div className="form-footer">
                        <div className="add-media">
                            <span>
                                <label htmlFor="camera">
                                    <FontAwesomeIcon icon={faCamera} className="add-media-icon" onClick={(e) => {setCamera(!camera)}}/>
                                </label>
                            </span>
                            <span>
                                <label htmlFor="comment-file">
                                <FontAwesomeIcon icon={faFileImport} className="add-media-icon" />
                                </label>
                                <input type="file" name="" id="comment-file" className="hidden" onChange={(e) => {
                                    handleSelectedFiles(e);
                                }} />
                            </span>
                            <span>
                                <label htmlFor="recorder">
                                    <FontAwesomeIcon icon={faMicrophone} className="add-media-icon" onClick={(e) => {setAudioRecorder(!audioRecorder)}}/>
                                </label>
                            </span>
                        </div>
                    </div>
                    
                    <div className="file-previewer">
                            { selectedFiles &&
                            <div className="relative">
                                { fileDisplayer(fileType)[0] === 'image' &&
                                    <div  className="relative">
                                        <img src={selectedFiles} alt="preview image" className="preview-file" />
                                    </div>}
                                { fileDisplayer(fileType)[0] === 'audio' &&
                                    <div  className="relative">
                                        <audio src={selectedFiles} controls id="audio-player" />
                                    </div>}
                                { fileDisplayer(fileType)[0] === 'video' && 
                                    <div  className="relative">
                                        <VideoPlayer
                                            filepath = {`${selectedFiles}`}
                                            videotype = {`video/${fileDisplayer(fileType)[1]}`}
                                            // videotype = {`video/mp4`}
                                            className={'preview-file wide'}
                                            controls={false}
                                            // autoPlay={true}
                                        />
                                    </div>
                                }
                                <FontAwesomeIcon icon={faMultiply} className="selected-remover" onClick={(e) => {removeSelected(e)}}/>
                            </div>
                             }
                    </div>
                 </form>
            </div>
        </div>
     );
}
 
export default CommentForm;