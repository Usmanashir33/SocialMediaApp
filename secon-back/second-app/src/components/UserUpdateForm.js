import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { faCamera, faFile, faFileImport, faMultiply, faXmark } from "@fortawesome/free-solid-svg-icons";
import { dataRendingContext } from "../contexts/DataRending";
import useUpdateUser from "../hooks/UpdateUser";
import config from "../hooks/Config";
import Camera from "./Camera";

const UserUpdateForm = ({data,setData}) => {
    // const {username,first_name,last_name,profile} = data;
    const [username,setUsername] = useState(data.username)
    const [email,setEmail] = useState(data.email)
    const [last_name,setLastname] = useState(data.last_name)
    const [first_name,setFirstname] = useState(data.first_name)
    const [title,setTitle] = useState(data.profile.title?data.profile.title:'')
    const [address,setAddress] = useState(data.profile.address?data.profile.address:'')
    const {error,user:updatedUser,updateUser} = useUpdateUser(setData);

    const [choosedFile,setChoosedFile] =useState(null);
    const [fileType,setFileType] = useState('');
    const [availableFile,setAvailableFile] = useState(null);
    const [camera,setCamera] = useState(false);
    const [picName,setPicName] = useState(null)
    
    const {showUserForm,setShowUserForm,fileDisplayer,filetypeChecker} = useContext(dataRendingContext);
    const filesInput = document.querySelector('.comment-file-input');
    const commentInput = document.querySelector('#comment');
    // const {user,fetchUser} = useGetUser();
    const sameData = () => {
        if ((first_name == data.first_name) && (last_name == data.last_name) && 
        (title == data.profile.title) && (address == data.profile.address)
    ){
        return true
    }else{return null}
    }
    useEffect(() => {
        if (data){
            setAvailableFile(data.picture)
        }
    },[])
    const displayDialog = () => {
        // if (commentInput.value){
        if (!sameData()){
            document.querySelector(".comment-form-dialog").showModal();
            return true;
        }
        setShowUserForm(false);
    }
    const hideDialog = (e) => {
        document.querySelector(".comment-form-dialog").close();
    }
    const clearForm = (e) => {
        document.querySelector(".comment-form-dialog").close();
        setShowUserForm(false)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        // const updatedData = {first_name,last_name,title,address}

        const updatedData = new FormData();
        updatedData.append("first_name",first_name);
        updatedData.append("last_name",last_name);
        updatedData.append("title",title);
        updatedData.append("address",address);
        if (picName){
            updatedData.append("picture",availableFile,picName);
        }else{
            updatedData.append("picture",availableFile);
        }
        updateUser(updatedData,data.id);
    }
    const handleSelectedFile = (e) => {
        const thefile = e.target.files[0];
        if (thefile && fileDisplayer(thefile.type)[0] === 'image') {
            setFileType(thefile.type);
            const FileDisplayer =URL.createObjectURL(thefile);
            setChoosedFile(FileDisplayer);
            setAvailableFile(thefile);
        }else{
            alert('sorry you can only choose image ');
            return ; 
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
        if (cameraFileType == "image") {
            setChoosedFile(cameraFile);
            setPicName(pictureName);
            setFileType(cameraFileType);
            setCamera(display);
            let image = dataURLToBlob(cameraFile);
            setAvailableFile(image);
        } else {
            alert("sorry you can only set Image here ");
            return 
        }
    }
    return ( 
        <div className="add-comment-form">
            {/* dialog "" */}
            <dialog className="comment-form-dialog">
            <form action="" className="flex-center-colum">
                <div className="dialog-question">
                     Are you sure you want discard changes?
                </div>
                <button type="button" className="cancel-dialog" onClick={hideDialog}>Cancel</button>
                <button type="button" className="confirm-action" onClick={clearForm}>Confirm</button>
            </form>
            </dialog>
            {/* form starts */}
             <div className = {`comment-container float-form`}>
                <form  className="comment-form float-form relative" id="comment-form">
                <button type="submit" onClick={(e) => {handleSubmit(e)}} id="reply-button" className="small-txt right-top reply-button">Update</button>
                <div className="form-header">
                    <div className="cancel inline" onClick={displayDialog}>
                    <FontAwesomeIcon icon={faXmark} className="comment" />
                    </div>
                    <div className="back inline" onClick={displayDialog}>
                       <FontAwesomeIcon icon={faArrowLeft} className="comment" />
                    </div>
                </div>
                {camera && <Camera getCameraData ={getCameraData} close={setCamera}/>}

                <div className="user-form-body custom-overflow">
                    {<section>
                        <label htmlFor="username" > username:</label>
                        <input  type="text" name="username" id="username" 
                        disabled value={username} onChange={(e) => {setUsername(e.target.value)}}  placeholder=" username" />
                    </section>}
                    <section>
                        <label htmlFor="email">email :</label>
                        <input type="email" name="email" id="email" 
                        disabled value={email} onChange={(e) => {setEmail(e.target.value)}}  placeholder=" email (e.g parson@gmail.com)" />
                    </section>
                    
                     {<section>
                        <label htmlFor="first name">fist name :</label>
                        <input type="text" name="first_name" id="first_name" 
                         value={first_name} onChange={(e) => {setFirstname(e.target.value)}}  placeholder=" first name" />
                    </section>}
                     {<section>
                        <label htmlFor="last_name">last name</label>
                        <input type="text" name="last_name" id="last_name" 
                         value={last_name} onChange={(e) => {setLastname(e.target.value)}}  placeholder=" last name" />
                    </section>}

                     {<section>
                        <label htmlFor="title">title</label>
                        <input type="text" name="title" id="title" 
                         value={title} onChange={(e) => {setTitle(e.target.value)}}  placeholder=" title" />
                    </section>}

                     {<section>
                        <label htmlFor="address">address :</label>
                        <input type="text" name="address" id="address" 
                         value={address} onChange={(e) => {setAddress(e.target.value)}}  placeholder=" address" />
                    </section>}
                </div>
                    
                    <div className="form-footer">
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
                                <FontAwesomeIcon icon={faMultiply} className="selected-remover" onClick={(e) => {removeSelected(e)}}/>
                            </div>
                             }
                    </div>
                        <div className="add-media ">
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
                        </div>
                     </div>
                 </form>
            </div>
        </div>
     );
}
 
export default UserUpdateForm;