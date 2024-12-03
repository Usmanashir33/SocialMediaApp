import { faMicrophoneLines, faMultiply, faPaperPlane, faPlay, faStar, faStarHalfStroke, faStop, faWaveSquare, faWheelchairMove } from "@fortawesome/free-solid-svg-icons";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons/faBasketShopping";
import { faFileWaveform } from "@fortawesome/free-solid-svg-icons/faFileWaveform";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons/faMicrophone";
import { faMicrophoneLinesSlash } from "@fortawesome/free-solid-svg-icons/faMicrophoneLinesSlash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

const AudioRecorder = ({getSoundData,close}) => {
    const [isRecording,setIsRecording] = useState(false);
    const [minutes ,setMinutes] = useState(0);
    const [seconds ,setSeconds] = useState(0);
    const [canResume,setCanResume] = useState(false);
    const voiceChunks = useRef([]);
    const recorderRef = useRef(null);

    const startRecording = async () => {
        const recorderStreem = await navigator.mediaDevices.getUserMedia({ audio: true });
        recorderRef.current = new MediaRecorder(recorderStreem);
        recorderRef.current.ondataavailable = (event) => {
            voiceChunks.current.push(event.data);
        }
        recorderRef.current.start();
        setIsRecording(!isRecording);
    }
    const sendRecording = () => {
        setIsRecording(false);
        setMinutes(0);
        setSeconds(0);
        setCanResume(false);
        const audioBlobs = new Blob(voiceChunks.current,{ type : 'audio/wav' });
        // const audioBlob = new File([...audioChunks.current],'audio.wav',{ type : 'audio/wav' });
        console.log('audioBlob: ', audioBlobs);
        getSoundData(audioBlobs,'audio','audio.wav',false);
        voiceChunks.current = [];
    }
    const stopRecording = (e) => {
        setIsRecording(!isRecording);
        setCanResume(true);
        recorderRef.current.stop();
    }
    const resumeRecording = (e) => {
        setIsRecording(!isRecording);
        setCanResume(false);
        recorderRef.current.start();
        recorderRef.current.ondataavailable = ({data}) => {
            voiceChunks.current.push(data);
        }
    }
    const discardRecord = () => {
        setIsRecording(false);
        setMinutes(0);
        setSeconds(0);
        setCanResume(false);
        voiceChunks.current = [];
    }
    useEffect(() => {
        if (isRecording){
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
    },[seconds,isRecording])
        // return (time < 100 && isRecording) ? setTiming() : null
    return ( 
        <div className="recorder-container relative">
            <FontAwesomeIcon icon={faMultiply} className="close-icon" onClick={(e) => {close(false)}}/>

            <div className="recorder-head">
                <div className="sound-time">
                    {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
                </div> 
                
            </div>
            <div className= {` recorder-icon ${isRecording? "recording" : canResume ? "can-resume" : ""}`}>
                <FontAwesomeIcon icon={faMicrophone} className="voice-recorder-icon " />
            </div>
            <div className="recorder-foot">
            <div className="rec-right">
            <       FontAwesomeIcon icon={faBasketShopping} className="sound-icon discarder" onClick={() => {discardRecord()}}/>

                    {(!isRecording && !canResume) && <div className="sound-icon " onClick={startRecording}>
                        <FontAwesomeIcon icon={faPlay}/>
                    </div>}
                    {(isRecording) && <div className="sound-icon" onClick={stopRecording}>
                        <FontAwesomeIcon icon={faStop}/>
                    </div>}
                    {(!isRecording && canResume) && <div className="sound-icon" onClick={(e) => {resumeRecording(e)}}>
                        <FontAwesomeIcon icon={faPlay}/>
                    </div>}
                    {(!isRecording && canResume) && <div className="sound-icon " onClick={(e) => {sendRecording(e)}}>
                        <FontAwesomeIcon icon={faPaperPlane}/>
                    </div>}
                </div>
            </div>
        </div>
    );
}
 
export default AudioRecorder;