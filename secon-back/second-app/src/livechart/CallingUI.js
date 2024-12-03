import { faAdd, faFileInvoice, faMessage, faMicrophone, faMicrophoneSlash, faPhone, faUpDown, faVideoCamera, faVolumeHigh, faVolumeMute, faVolumeOff } from "@fortawesome/free-solid-svg-icons";
import { faVoicemail } from "@fortawesome/free-solid-svg-icons/faVoicemail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect } from "react";
import { CallingContext } from "./CallingContext";
import config from "../hooks/Config";
import { authContext } from "../contexts/AuthContext";

const CallingUI = ({}) => {
    const {currentUser} = useContext(authContext);
    const {incoming,setIncoming,callType,callAccepted,callingMode,setCallAccepted,sendSignal,setFloating,
        callRejected,setCallRejected,imcaller,caller,calledFriend} = useContext(CallingContext);
        
    const {first_name,last_name,picture,id:friendId} = calledFriend? calledFriend : null;
    useEffect(() => {
        if (callingMode && caller.id === currentUser.id && !callAccepted){
            const sgnl ={
                signalType : "request",
                signal:"Accept audio player pls",
                callSender : caller.id, // id from caller
                friend : friendId, // id from calledFriend
                requestType : callType
            }
            // console.log('caller : ' , caller.id);
            // console.log('friend : ' , friendId);
            sendSignal(sgnl);
        }
    },[])
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
    const approveCall = () => {
         const Asignal = {
            signalType : 'approvecall',
            friend : caller.id ?? caller  ,
        }
        sendSignal(Asignal);
    }
    const addFloating =(e) => {
        setFloating(true);
    }
    return ( 
        <div className ='call-container hidde'>
             <div className="incoming-container">
                {/* <!-- not in call  --> */}
                {(incoming && !callAccepted) && <span className="incoming-text">incoming call</span>}
                <FontAwesomeIcon icon={faUpDown} className="cicon floating-icon" onClick={(e) => {addFloating(e)}} />
                
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

                    <div className="call-duration ">
                        {(callAccepted) && <span>11:20</span> }
                    </div>.

                    {(!callAccepted && !incoming) && <div className="incoming-text">CALLING...</div>}
                    {(!callAccepted && incoming) && <div className="incoming-text call-type-text"> {`${callType}`} Call </div>}

                  <div className="">
                  {(!callAccepted) &&  <div className="calling-controls"></div>}
                  {(callAccepted) && <span className="calling-controls">
                        <div className="call-contrl" onClick={(e) => {}}>
                            <FontAwesomeIcon icon={faMicrophone}  className="contrl-icon"/>
                            {/* <FontAwesomeIcon icon={faMicrophoneSlash}  className="contrl-icon"/> */}
                        </div>
                        <div className="call-contrl" onClick={(e) => {}}>
                            <FontAwesomeIcon icon={faMessage}  className="contrl-icon"/>
                        </div>
                        <div className="call-contrl" onClick={(e) => {}}>
                            <FontAwesomeIcon icon={faVolumeHigh}  className="contrl-icon"/>
                            {/* <FontAwesomeIcon icon={faVolumeMute}  className="contrl-icon"/> */}
                        </div>
                        <div className="call-contrl" onClick={(e) => {}}>
                            <FontAwesomeIcon icon={faAdd}  className="contrl-icon"/>
                        </div>
                        <div className="call-contrl" onClick={(e) => {}}>
                            <FontAwesomeIcon icon={faVideoCamera}  className="contrl-icon"/>
                        </div>
                        <div className="call-contrl" onClick={(e) => {}}>
                            <FontAwesomeIcon icon={faVolumeOff}  className="contrl-icon"/>
                        </div>
                    </span>}
                    </div>
                </div>
                <div className="container-bottom ">
                   { (!callAccepted && !(currentUser.id === caller.id )) && <span className="small-textb">
                        <div className="reject-call call-IF">
                        <FontAwesomeIcon icon={faPhone} shake className="cicon"  onClick={(e) => {rejectCall()}}/>
                        </div>
                        decline
                    </span>}
                   { (callAccepted || (currentUser.id === caller.id )) && <span className="small-textb">
                        <div className="reject-call call-IF">
                        <FontAwesomeIcon icon={faPhone} className="cicon" onClick={(e) => {endcall()}} />
                        </div>
                    </span>}
                    {/* <!-- <div className="message-caller">BB</div> -- */}
                    { (!callAccepted && !(currentUser.id === caller.id )) &&<span className="small-textb">
                        <div className="answer-call call-IF"> 
                            <FontAwesomeIcon icon={faPhone} shake className="cicon" onClick={(e) => {approveCall()}}/>
                        </div>
                        accept
                    </span>}
                </div>
           </div>
        </div>
    );
}
 
export default CallingUI;