import { faFileArrowDown, faFileArrowUp, faMicrophone, faMicrophoneSlash, faMultiply, faPhone, faPhotoVideo, faSterlingSign, faUpDown, faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { faDotCircle } from "@fortawesome/free-solid-svg-icons/faDotCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { authContext } from "../contexts/AuthContext";
import { CallingContext } from "./CallingContext";
import { faVideoCamera } from "@fortawesome/free-solid-svg-icons/faVideoCamera";
import { faFileVideo } from "@fortawesome/free-solid-svg-icons/faFileVideo";
import Peer from "simple-peer";
import config from "../hooks/Config";


const VideoCallUi = () => {
    const webCamRef = useRef(null);
    const userCameraRef = useRef(null);
    const [cameraStreaming,setCameraStreaming] = useState();
    const videoRef = useRef(null);
    const [muting,setSpeaker] = useState(false);
    const [mic,setMic] = useState(true);
    const callPeer = useRef(null);


    const {currentUser} = useContext(authContext);
    const {incoming,setCameraStreem,callType,callAccepted,sdp,
        setCallAccepted,callingMode,setPeerSignal,sendSignal,setFloating,
        remoteVideoRef,cameraStreem,setIncoming,caller,calledFriend,peerSignal} = useContext(CallingContext);
        
    const {first_name,last_name,picture,id:friendId} = calledFriend? calledFriend : null;
    const [showCamera,setShowCamera] = useState(currentUser.id === caller.id ? true : false);
    const [showUserCamera,setShowUserCamera] =useState(currentUser.id === caller.id ? true : false);
    
    useEffect(() => {
        if(callPeer && sdp){
            // callPeer.signal(sdp);
        } 
        startCamera();
        return () => {
            // if (cameraStreaming){
            //     cameraStreaming.getTracks().forEach((track) => track.stop());
            //     setCameraStreaming(null );
            //     userCameraRef.current = null ;
            // }
            // if (callPeer.current) {
            //     callPeer.current.destroy();
            //     callPeer.current = null;
            // }
        }
    },[callPeer,sdp])
    
    const toggleUserCamera = () => {
        setShowUserCamera(!showUserCamera);
        setShowCamera(true);
    }
    const capturePicture = (e) => {
        const picture = webCamRef.current.getScreenshot(); // this returns the url
        const ext = picture.split("/")[1].split(";")[0]
        const pictureName = `picture.jpg`
    }
    const startCamera = async () => {
        //const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true})
        const stream = await webCamRef?.current?.stream
        // setCameraStreaming(stream);
        //userCameraRef.current.srcObject = stream;
        callPeer.current  = new Peer({
            initiator: caller.id === currentUser.id? true : false, // check initiator 
            trickle: true,
            stream: stream
        });
  
        callPeer.current.on('signal', dataSignal => { 
            //initiate signal and wait for another signal
            // Send the signal data to the other peer via your server
            
            // USER A initiate the peer connection
            if (caller.id === currentUser.id && !callAccepted){
                const sgnl ={
                    signalType : "request",
                    signal:dataSignal,
                    callSender : caller.id, // id from caller
                    friend : friendId, // id from calledFriend
                    requestType : callType
                }
                sendSignal(sgnl);
                // console.log('sgnl: ', sgnl);
            }

            // User B Want accept the call  will send back sdf to his caller
            if (caller.id !== currentUser.id && callAccepted){
                const Asignal = {
                    signalType : 'approvecall',
                    signal:dataSignal,
                    friend : caller.id ?? caller
                }
                sendSignal(Asignal);
            }
          });
  
        callPeer.current.on('stream', remoteStream => { // ready to communicate
            remoteVideoRef.current.srcObject = remoteStream;
          });
    };
     
    const toggleMic = () => {
        const stream = webCamRef.current?.video?.srcObject;  // Get the current stream
        if (stream) {
          const audioTracks = stream.getAudioTracks();  // Get all audio tracks
          if (mic) {
            audioTracks.forEach(track => track.enabled = false);  // Disable audio tracks
          } else {
            audioTracks.forEach(track => track.enabled = true);   // Re-enable audio tracks
          }
          setMic(!mic);  // Toggle the state
        }
      };
    const toggleSpeaker = (e) => {
        setSpeaker(!muting);
    }
    const endcall = () => {
        const Esignal = {
            signalType : 'endcall',
            friend : calledFriend.id ,
        }
        sendSignal(Esignal);
    }
    const rejectCall = () => {
        const Rsignal = {
            signalType : 'rejectcall',
            friend : caller.id ?? caller  ,
        }
        sendSignal(Rsignal);
    }
   
    const approveCall = async () => {
        setIncoming(false);
        setCallAccepted(true); // will set the camera on to generate cameraStreem
    } 

    return ( 
        <div className="call-container">
             <div className="video-call-ui relative">
                    { !showUserCamera && <div className="hide-user-camera">
                        <FontAwesomeIcon icon={faFileArrowDown} shake className="" onClick={(e) => {toggleUserCamera()}} />
                        show Camera
                    </div>}
               {(showCamera || callAccepted) &&  <div className={`user-camera-space ${showUserCamera? "":"hidden"}`}>
                    <div className="hide-user-camera">
                        <FontAwesomeIcon icon={faMultiply} className="cicon user-camera-floater" onClick={(e) => {toggleUserCamera()}} />
                    </div>

                    <Webcam
                        ref={webCamRef}
                        className ={`user-camera`}
                        audio= {true}
                        muted
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                        facingMode: 'user',
                        }}
                        onUserMediaError={(error) => console.error(error)}
                        // onDataAvailable={handleDataAvailable}
                        onUserMedia={startCamera}
                    />
                   <div className="camera-buttons ucb">
                            <FontAwesomeIcon icon={faDotCircle} className="user-camera-btn" onClick={(e) => {}} />
                    </div>
                </div>}
                 <div className="main-screen-space">
                    {!callAccepted && <div className="main-screen">
                    {(incoming && !callAccepted) &&
                        <div className="incoming-text">incoming call</div>
                    }
                    <div className="container-top">
                    <div className="caller-image-div">
                        {!incoming && <img src={`${config.BASE_URL}${picture}`} alt={``} className="caller-image"/>}
                        {incoming && <img src={`${config.BASE_URL}${caller?.picture}`} alt={``} className="caller-image"/>}
                    </div>
                    
                    {!incoming && <div className="caller-name">
                        { (first_name) ? `${first_name} ${last_name}` : 'Anonymous_user'}
                    </div>}
                    {incoming && <div className="caller-name">
                        { `${caller?.first_name} ${caller?.last_name}`}
                    </div>}

                    {(!callAccepted && !incoming) && <div className="incoming-text">CALLING...</div>}
                    {<div className="incoming-text call-type-text"> {`${callType}`} Call </div>}
                </div>
                    </div>}
                    { callAccepted && <video 
                        ref={remoteVideoRef}
                        className={'main-screen'}
                        autoPlay
                        muted ={muting}
                        onClick ={(e) => {e.stopPropagation()}}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', // Ensure video content fills the area
                          }}
                    >
                        not supported vedio type
                    </video>}
                   <div className="camera-buttons">
                   <div className="call-contrl" onClick={(e) => {}}>
                            {(!incoming && mic) &&   
                             <span className="small-textb b-title">
                                Mic-On
                                <FontAwesomeIcon icon={faMicrophone}  className="contrl-icon" onClick={(e) => {toggleMic()}} />
                            </span>
                            }
                            {(!incoming && !mic) && 
                            <span className="small-textb b-title">
                                Mic-Off
                                <FontAwesomeIcon icon={faMicrophoneSlash}  className="contrl-icon" onClick={(e) => {toggleMic()}} />
                            </span>
                            }
                        </div>

                        {!incoming  && <span className="small-textb">
                            <div className="reject-call call-IF">
                                <FontAwesomeIcon icon={faPhone} className="cicon" onClick={(e) => {endcall()}} />
                            </div>
                        </span>}

                        {incoming  && <span className="small-textb">
                            <div className="reject-call call-IF">
                                <FontAwesomeIcon icon={faPhone}  shake  className="cicon" onClick={(e) => {rejectCall()}} />
                            </div>
                            reject
                        </span>}

                        {incoming && <span className="small-textb">
                            <div className="answer-call call-IF">
                                <FontAwesomeIcon icon={faPhone} shake   className="cicon" onClick={(e) => {approveCall()}} />
                            </div>
                            accept
                        </span>}
                        
                        <div className="call-contrl" onClick={(e) => {}}>
                            {(!incoming  && !muting) && 
                                <span className="small-textb b-title">
                                    Spk-On
                                    <FontAwesomeIcon icon={faVolumeHigh}  className="contrl-icon" onClick={(e) => {toggleSpeaker()}}/>
                                </span>
                            }
                            {(!incoming  && muting) && 
                            <span className="small-textb b-title">
                               Spk-Off
                                <FontAwesomeIcon icon={faVolumeMute}  className="contrl-icon" onClick={(e) => {toggleSpeaker()}}/>
                            </span>
                            }
                        </div>
                    </div>
                 </div>
            </div>
        </div>
     );
}
 
export default VideoCallUi;