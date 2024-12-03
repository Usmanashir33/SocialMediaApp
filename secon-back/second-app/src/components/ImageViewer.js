import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import config from "../hooks/Config";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ImageViewer = ({pictureLink,setShowImage}) => {
    return ( 
        <div className="comment-container float-form ">
            <div className="form-header ">
                <div className="cancel inline">
                    <FontAwesomeIcon icon={faXmark} className="comment" onClick={() => {setShowImage(false)}} />
                </div>
                <div className="back inline">
                    <FontAwesomeIcon icon={faXmark} className="comment" onClick={() => {setShowImage(false)}} />
                </div>
            </div>
            <img src={`${pictureLink}`} alt={`${pictureLink}`} className='full-image'/>
        </div>
    );
}
 
export default ImageViewer;