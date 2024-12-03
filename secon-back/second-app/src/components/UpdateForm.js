import { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faCamera, faFile, faFileImport, faMicrophone, faMultiply, faXmark } from "@fortawesome/free-solid-svg-icons";
import { dataRendingContext } from "../contexts/DataRending";
import usePostData from "../hooks/postData";
import useUpdateData from "../hooks/UpdateData";
import VideoPlayer from "./VideoPlayer";
import config from "../hooks/Config";
import AudioRecorder from "./AudioRecorder";
import Camera from "./Camera";

const UpdateForm = ({data,setData}) => {
    const {clickedObjectId,commentFormType,setShowUForm} = useContext(dataRendingContext);
    const commentInput = document.querySelector('#comment');
    const  {post,fetchPost,fileDisplayer} = useContext(dataRendingContext);
    const  {comment,fetchComment,filetypeChecker} = useContext(dataRendingContext);
    const url = commentFormType == 'post'? `/posts/post/${clickedObjectId}/` : `/posts/post/${clickedObjectId}/comment/`
    const {doUpdate:updateData} =  useUpdateData(url,data,setData);
    const [parent,setParent] = useState(null);
    const [textarea,setTextArea] = useState('');
    const {first_name,last_name,username,id,picture} = parent? parent.user:'';
    const body = parent? parent.body : '' ;
    const [choosedFile,setChoosedFile] =useState(null);
    const [fileType,setFileType] = useState('');
    const [seleting,setSelecting] = useState(false);
    const [availableFile,setAvailableFile] = useState(null);
    const [camera,setCamera] = useState(false);
    const [audioRecorder,setAudioRecorder] = useState(false);
    const [picName,setPicName] = useState(null)
    
    useEffect(() => {
        if (commentFormType == 'post' && clickedObjectId ){
            fetchPost(`/posts/post/${clickedObjectId}/`);
        }else{
            fetchComment(`/posts/post/${clickedObjectId}/comment/`);
        }
    },[clickedObjectId])

    useEffect(() => {
        if(post &&  commentFormType == 'post'){
            setParent(post);
            setTextArea(post.body);
            setAvailableFile(post.file);
        }
        if (comment &&  commentFormType == 'comment'){
            setParent(comment);
            setTextArea(comment.body);
            setAvailableFile(comment.file);
        }
    },[post,comment])

    const displayDialog = () => {
        if (( commentInput && commentInput.value) && !(commentInput.value == parent.body)){
            document.querySelector(`#form-${id}-clear`).showModal();
            return true;
        }
        setShowUForm(false);
    }
    const hideDialog = (e) => {
        document.querySelector(`#form-${id}-clear`).close();
    }
    const clearForm = (e) => {
        setTextArea('')
        setChoosedFile(null);
        setAvailableFile(null);
        document.querySelector(`#form-${id}-clear`).close();
        setShowUForm(false)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const cFData = new FormData();
        cFData.append("body",textarea);
        if (picName){
            cFData.append("file",availableFile,picName);
        }else{
            cFData.append("file",availableFile);
        }
        updateData(cFData);
    }
    const handleSelectedFile = (e) => {
        const thefile = e.target.files[0];
        if (thefile) {
            setFileType(thefile.type);
            const FileDisplayer =URL.createObjectURL(thefile);
            setChoosedFile(FileDisplayer);
            setAvailableFile(thefile);
        }
    }
    const removeSelected = (e) => {
        setChoosedFile(null);
        setAvailableFile(null);
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
    const getCameraData = async (cameraFile,cameraFileType,pictureName,display) => {
        setPicName(pictureName);
        setFileType(cameraFileType);
        setCamera(display);
        if (cameraFileType == "image") {
            setChoosedFile(cameraFile);
            let image = dataURLToBlob(cameraFile);
            setAvailableFile(image);
        } else {
            const videoUrl = URL.createObjectURL(cameraFile)
            setChoosedFile(videoUrl);
            setAvailableFile(cameraFile);
        }
    }
    const getSoundData = async (File,FileType,fileName,showRecorder) => {
        setPicName(fileName);
        setFileType(FileType);
        setAvailableFile(File);
        setAudioRecorder(showRecorder);
        const audioUrl = URL.createObjectURL(File); // create url for the blob
        console.log('audioUrl: ', audioUrl);
        setChoosedFile(audioUrl);
    }
    return ( 
        <div className="add-comment-form custom-overflow">
            {/* dialog "" */}
            <dialog className="comment-form-dialog" id={`form-${id}-clear`}>
            <form action="" className="flex-center-colum">
                <div className="dialog-question">
                     Are you sure you want Discard?
                </div>
                <button type="button" className="cancel-dialog" onClick={hideDialog}>Cancel</button>
                <button type="button" className="confirm-action" onClick={clearForm}>Confirm</button>
            </form>
            </dialog>
            {/* form starts */}
             <div className = {`comment-container float-form custom-overflow`}>
                <form onSubmit={(e) => {handleSubmit(e)}} className="comment-form relative" id="comment-form">
                 <button type="submit" id="reply-button" className="small-txt right-top ">Update</button>
                    <div className="form-header ">
                         <div className="cancel inline" onClick={displayDialog}>
                         <FontAwesomeIcon icon={faXmark} className="comment" />
                         </div>
                         <div className="back inline" onClick={displayDialog}>
                            <FontAwesomeIcon icon={faArrowLeft} className="comment" />
                         </div>
                    </div>
                     
                     <div className="post-card borderless post-in-form">
                         <div className="post-col1 flex-center-colum">
                             <div className="post-in-form-image">
                             <img src={`${config.BASE_URL}${picture}`} className='profile-image' />
                                {/* <img src={process.env.PUBLIC_URL+`/image/GQhQqaiWcAAvVlx.jpeg`} alt='image-' className='profile-image' /> */}
                            </div>
                             <div className="v-line"></div>
                         </div>
                         <div className="post-col2 ">
                             <div className="post-header">
                                 <div className="user-data">
                                    <span className="post-name in-form-name"> 
                                    { first_name ? `${first_name} ${last_name}` : 'Anonymous_user'}
                                    </span>
                                     <span className="post-username in-form-username">@{username}</span>
                                    <span className="post-date in-form-date"> {parent && parent.user.date_joined}</span>
                                 </div>
                             </div>
                                {camera && <Camera getCameraData ={getCameraData} close={setCamera}/>}
                                {audioRecorder && <AudioRecorder getSoundData ={getSoundData}/>}
                             <div className="custom-overflow">
                               <textarea name="comment" id="comment" autoFocus cols="30" rows="4" className="custom-overflow"
                                 value={textarea} onChange={(e) => {setTextArea(e.target.value)}} placeholder="Update your data"></textarea>
                            </div>
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
                                    handleSelectedFile(e);
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
                            { (choosedFile || availableFile) &&
                            <div className="relative">
                                {(availableFile && !choosedFile) && 
                                    filetypeChecker(availableFile)[0] === 'image' &&
                                    <div  className="relative">
                                        <img src={`${config.BASE_URL}${availableFile}`} alt="preview image" className="preview-file" />
                                    </div>
                                }
                                { (choosedFile) && fileDisplayer(fileType)[0] === 'image' &&
                                    <div  className="relative">
                                        <img src={choosedFile} alt="preview image" className="preview-file" />
                                    </div>}
                                {/* audio section  */}
                                {(availableFile && !choosedFile) && 
                                    filetypeChecker(availableFile)[0] === 'audio' &&
                                    <div  className="relative">
                                        <audio src={`${config.BASE_URL}${availableFile}`} controls id="audio-player" />
                                    </div>
                                }
                                { (choosedFile) &&
                                 fileDisplayer(fileType)[0] === 'audio' &&
                                    <div  className="relative">
                                        <audio src={choosedFile} controls id="audio-player" />
                                    </div>}
                                {
                                (availableFile && !choosedFile) && 
                                    filetypeChecker(availableFile)[0] === 'video' &&
                                    <div  className="relative">
                                        <VideoPlayer 
                                            filepath = {`${config.BASE_URL}${availableFile}`}
                                            videotype = {`video/${filetypeChecker(availableFile)[1]}`}
                                            className={'preview-file wide'}
                                            controls={false}
                                            // autoPlay={true} 
                                        />
                                    </div>
                                }
                                {(choosedFile) &&  fileDisplayer(fileType)[0] === 'video' && 
                                    <div  className="relative">
                                        <VideoPlayer
                                            filepath = {`${choosedFile}`}
                                            videotype = {`video/${fileDisplayer(fileType)[1]}`}
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
 
export default UpdateForm;