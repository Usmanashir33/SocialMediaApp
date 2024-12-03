import { useContext, useEffect, useState } from "react";
import { authContext } from "../contexts/AuthContext";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import usePostData from "../hooks/postData";
import { dataRendingContext } from "../contexts/DataRending";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraAlt, faFile, faFileImport, faMicrophone, faMultiply} from "@fortawesome/free-solid-svg-icons";
import VideoPlayer from "./VideoPlayer";
import config from "../hooks/Config";
import { faCamera } from "@fortawesome/free-solid-svg-icons/faCamera";
import Camera from "./Camera";
import AudioRecorder from "./AudioRecorder";
import { uiContext } from "../contexts/UiContext";
import { width } from "@fortawesome/free-solid-svg-icons/faSignOut";

const PostForm = () => {

    const {success,setError,setFailed,currentUser} = useContext(authContext) ;
    // const history = useHistory();
    const [selecteds,setSelecteds] =useState(null);
    const [fileType,setFileType] = useState();
    const [file,setFile] = useState(null);
    const [camera,setCamera] = useState(false);
    const [audioRecorder,setAudioRecorder] = useState(false);
    const [picName,setPicName] = useState(null)
    const {posts,setPosts,fileDisplayer,setAlert} = useContext(dataRendingContext);
    const [post ,setPost] = useState('');
    const posts_url = `/posts/posts/` ;
    const {doPost} = usePostData(posts_url,posts,setPosts);
    const {theme} = useContext(uiContext)
    const cardStyle = {
        backgroundColor : theme.bgColor,
    }
    const textStyle = {
        color : theme.color,
    }
    const areaStyle = {
        backgroundColor : theme.bgColor,
        color:theme.color,
        width:"100vw",
    }
    const textStyle2 = {
        color : theme.color2,
    }
    const btnStyle = {
        backgroundColor :  theme.iconColor,
        color : theme.color2,
    }
    const iconStyle = {
        color : theme.iconColor,
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!post && !file){
            setAlert("post data not found")
            return
        }
        const formData = new FormData() ;
        formData.append("body",post);
        if (picName){
            console.log('picName: ', picName);
            formData.append("file",file,picName);
            // formData.append("file",file,"picName.jpg");
        }else{
            formData.append("file",file );
        }
        // const new_post = {body:post} ;
        console.log(formData.get('file'));
        doPost(formData);
    }
    const handleFileSelection = (e) => {
        setPicName(null);
        const file = e.target.files[0];
        setFile(file);
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
        setPicName(fileName);
        setFileType(fileType);
        setAudioRecorder(showRecorder);
        const audioUrl = URL.createObjectURL(files); // create url for the blob
        console.log('audioUrl: ', audioUrl);
        // const newFile = new File (files,'audioss.wav',{type : "audio/wav"})
        setSelecteds(audioUrl);
        setFile(files);
        
    }
    useEffect(() => {
        setPost('');
        setFile(null);
        setSelecteds(null);
        setPicName(null);
    },[posts])
    return ( 
        <div className="post-form " >
            
        <div className="post-card post-home-form " style={cardStyle} >
            <div className="post-col1">
                <img src={`${config.BASE_URL}${currentUser.picture}`} alt={`${currentUser.picture}`} className='profile-image'/>
            </div>
            <div className="post-col2">
            {camera && <Camera getCameraData ={getCameraData} close ={setCamera}/>}
            {audioRecorder && <AudioRecorder getSoundData ={getSoundData}/>}
                <form onSubmit={(e) => {handleSubmit(e)}}>
                     <textarea rows="4" name="post-message" style={areaStyle} placeholder={`whats in your mind ${currentUser.username}`}
                     className='custom-overflow' value={post} onChange={(e) => {setPost(e.target.value)}}
                    ></textarea>
                    <div className="post-form-footer" >
                        <div className="add-media">
                            <span>
                                <label htmlFor="camera"  >
                                <FontAwesomeIcon icon={faCamera} className="add-media-icon" style={iconStyle} onClick={(e) => {setCamera(!camera)}}/>
                                </label>
                            </span>
                            <span>
                                <label htmlFor="file">
                                <FontAwesomeIcon icon={faFileImport} style={iconStyle} className="add-media-icon" />
                                </label>
                                <input type="file" name="file" id="file" className="hidden" onChange={(e) => {
                                    handleFileSelection(e);
                                }} />
                            </span>
                            <span>
                                <label htmlFor="recorder">
                                <FontAwesomeIcon icon={faMicrophone} style={iconStyle} className="add-media-icon" onClick={(e) => {setAudioRecorder(!audioRecorder)}}/>
                                </label>
                            </span>
                        </div>
                        <div className="buttons">
                            { success && <button disabled type="submit" id="add-post" style={btnStyle} >posting...</button>}
                            { !success && <button  type="submit" id="" style={btnStyle} >Post</button>}
                        </div>
                    </div>
                    
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

                </form>
            </div>
        </div>
        </div>
     );
}
 
export default PostForm;