import { faPhone, faUpDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { CallingContext } from "./CallingContext";
import { authContext } from "../contexts/AuthContext";
import config from "../hooks/Config";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const CallingUIFloat = () => {
    const history = useHistory();
    const {currentUser} = useContext(authContext);
    const {incoming,callType,callAccepted,callingMode,setCallAccepted,sendSignal,floating,setFloating,
        callRejected,setCallRejected,imcaller,caller,calledFriend} = useContext(CallingContext);
        
    const {first_name,last_name,picture,id:friendId} = calledFriend? calledFriend : null;
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
    const removeFloating =(e) => {
        const friend_id = caller.id === currentUser.id ? friendId : caller.id ;
        const userdm = `/dm/room/${friend_id}/`;
        history.push(userdm);
        setFloating(false);
    }
    return ( 
        <div className="incoming-float">
             <div className="incoming-container-float">
                <div className="container-top-float">
                    <div className="caller-image-div-float">
                        {!incoming && <img src={`${config.BASE_URL}${picture}`} alt={``} className="caller-image-float"/>}
                        {incoming && <img src={`${config.BASE_URL}${caller?.picture}`} alt={``} className="caller-image-float"/>}
                    </div>
                    <div className="names-col">
                        {!incoming && <div className="caller-name-float">
                        { (first_name) ? `${first_name} ${last_name}` : 'Anonymous_user'}
                        </div>}
                        {incoming && <div className="caller-name-float">
                            { `${caller?.first_name} ${caller?.last_name}`}
                        </div>}

                       {(incoming && !callAccepted) && <div className="calling-type call-type-text">{` incoming ${callType} call`}</div>}
                       {(!incoming || callAccepted) && <div className="calling-type call-type-text">{`${callType} call`}</div>}
                    </div>
                    <div className="incall-float">
                        {(callAccepted) && <div className="call-duration sml-txt">11:20</div>}
                        {/* {(incoming && !callAccepted)  && <div className="call-type-text sml-txt">incoming call</div>} */}

                        {(callAccepted || (currentUser.id === caller.id )) && <div className="reject-call-float">
                            <FontAwesomeIcon icon={faPhone} className="cicon" onClick={(e) => {endcall()}} />
                        </div>}
                        <div className="back-to-call contrl-icon">
                            <FontAwesomeIcon icon={faUpDown} className="cicon" onClick={(e) => {removeFloating(e)}} />
                        </div>
                    </div>
                </div>
                <div className="container-bottom-float">
                    {(!callAccepted && !(currentUser.id === caller.id )) && <div className="reject-call-float">
                        <FontAwesomeIcon icon={faPhone} shake className="cicon"  onClick={(e) => {rejectCall()}}/>
                    </div>}
                    {(!callAccepted && !(currentUser.id === caller.id )) && <div className="answer-call-float">
                        <FontAwesomeIcon icon={faPhone} shake className="cicon" onClick={(e) => {approveCall()}}/>
                    </div>}
                </div>
            </div>
        </div>
     );
}
export default CallingUIFloat;