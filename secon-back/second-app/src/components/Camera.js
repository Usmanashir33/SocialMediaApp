import { faCircleCheck, faCircleDot, faMicrophone, faMicrophoneAltSlash, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-solid-svg-icons/faCircle";
import { faMultiply } from "@fortawesome/free-solid-svg-icons/faMultiply";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type } from "@testing-library/user-event/dist/type";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const Camera = ({getCameraData,close}) => {
    const webCam = useRef(null);
    const webRecorderRef = useRef(null);
    const [sound,setSound] = useState(true);
    const [seconds,setSeconds] = useState(0);
    const [minutes,setMinutes] = useState(0);
    const [recordingMode,setRecordingMode] = useState(false);
    const [vidioMode,setVidioMode] = useState(false);
    const [paused,setPaused] = useState(false);
    const recordingChunks = useRef([]);

    const handleDataAvailable = ({data}) => {
        console.log('data: ', data);
        if (data.size > 0) {
            recordingChunks.current.push(data);
        }
      };
    const closeCamera = (e) => {
        e.stopPropagation();
        close(false);
    }
    const videoReady = () => {
        if (recordingChunks.current.length > 0 ){
            const videoBlob = new Blob(recordingChunks.current,{type:`"video/webm"`,})
            getCameraData(videoBlob,"video/webm",`video.webm`,false);
            recordingChunks.current = [] ;
        }
    }

    const capturePicture = (e) => {
        const picture = webCam.current.getScreenshot(); // this returns the url
        const ext = picture.split("/")[1].split(";")[0]
        const pictureName = `picture.jpg`
        getCameraData(picture,"image",pictureName,false);
    }
    const recordingStart = async (e) => {
        setRecordingMode(true);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true ,audio : {sound}});
        webRecorderRef.current = new MediaRecorder(stream,{ mimeType: 'video/webm'});
        webRecorderRef.current.start();
        webRecorderRef.current.addEventListener("dataavailable",handleDataAvailable);
    }
    const recordingStop = (e) => {
        webRecorderRef.current.stop();
        setPaused(true);
        webRecorderRef.current.removeEventListener("dataavailable",handleDataAvailable);
    }
    const recordingResume = (e) => {
        setPaused(false);
        webRecorderRef.current.start();
        webRecorderRef.current.removeEventListener("dataavailable",handleDataAvailable);
    }
    useEffect(() => {
        if (recordingMode && !paused){
            setTimeout(() => {
                if ((minutes < 4 )) {
                    setSeconds((prev) => prev + 1);
                    if (seconds === 59){
                        setMinutes((prev) => prev + 1);
                        setSeconds(0);
                    }
                }
            }, 1000);
        }
    },[seconds,recordingMode,paused])
    return ( 
        <div className="camera-div">
            <div className="camera-container relative">
                <FontAwesomeIcon icon={faMultiply} className="close-icon" onClick={(e) => {closeCamera(e)}}/>
                { recordingMode && <div className="recording-icons">
                    <div>
                    <FontAwesomeIcon icon={faCircle} shake className="recording-icon"/>
                    </div>
                    {<div className="recording-time">
                    {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</div>}
                </div>}

                <Webcam
                    className ={`camera`}
                    audio={false}
                    ref={webCam}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                    facingMode: 'user',
                    }}
                    onUserMediaError={(error) => console.error(error)}
                    onDataAvailable={handleDataAvailable}
                />
                
                <div className="camera-controls-bottom">
                    <FontAwesomeIcon icon={faSyncAlt} className="camera-icon" onClick={() => {setVidioMode(!vidioMode)}}/>
                    { (!vidioMode) &&
                        <div className="capture"><div className="capture-button"
                        onClick={(e) => {capturePicture(e)}}
                        ></div></div>
                    }
                    { (vidioMode &&!recordingMode) && (recordingChunks.current.length == 0) &&
                        <div className="capture"><div className="capture-button start-record"
                        onClick={(e) => {recordingStart(e)}}
                        >start</div></div>
                    }

                    { ((vidioMode && recordingMode) && (!paused)) &&
                        <div className="capture"><div className="capture-button stop-record"
                        onClick={(e) => {recordingStop(e)}}
                        >stop</div></div>
                    }
                     {((vidioMode && paused) && (recordingChunks.current.length > 0)) &&
                    <div className="ready-mode">
                    { 
                        <div className=" resume-record"
                            onClick={(e) => {recordingResume(e)}}
                        >resume</div>
                    }
                    { 
                        <div className="ready-record"
                            onClick={(e) => {videoReady(e)}}
                        >select</div>
                    }
                </div>}
                    
                    {(sound) && <FontAwesomeIcon icon={faMicrophone} className="camera-icon" onClick={(e) => {setSound(!sound)}} />}
                    {(!sound) && <FontAwesomeIcon icon={faMicrophoneAltSlash} className="camera-icon" onClick={(e) => {setSound(!sound)}} />}
                
                </div>
            </div>
        </div>
     );
}
 
export default Camera;