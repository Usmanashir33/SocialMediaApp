import { createContext, useContext, useEffect, useRef, useState } from "react";
import config from "../hooks/Config";
import { authContext } from "../contexts/AuthContext";
import useCallingSocketHook from "./CallingSocket";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
export const CallingContext = createContext()

const CallingContextProvider = ({children}) => {
    const history = useHistory();
    const {currentUser} = useContext(authContext);
    const url =`${config.WS_URL}/call_connection/`;

    const [callType,setCallType] = useState('');
    const [callingMode,setCallingMode] = useState(false);
    const [floating,setFloating] = useState(true); 

    const [calledFriend,setCalledFriend] = useState({});
    const [caller,setCaller] = useState({});
    const [incoming,setIncoming] = useState(false);
    const [callAccepted,setCallAccepted] = useState(false);
    const [callRejected,setCallRejected] = useState(false);
    const [inRespDm,setInRespDm] = useState(true);
    const remoteVideoRef = useRef(null);
    const [cameraStreem,setCameraStreem] = useState();
    const [peerSignal,setPeerSignal]= useState();
    const [sdp,setSdp] = useState(null);

    
    const reset = () => {
        setCallType('');setCallingMode(false);setFloating(false);
        setCalledFriend({});setCaller({});setIncoming(false);
        setCallAccepted(false);setCallRejected(false);
    }
    const signalIn = async (signalData) => { // when ever socket comes with signal
        if (signalData.signalType === 'request'){ // only to called parson
            setFloating(true);
            setCallType(signalData.requestType);
            setCaller(signalData.callSender); // object
            setCalledFriend(signalData.friend) // id
            setIncoming(true);
            setCallingMode(true);
            setSdp(signalData.signal);
        }
        if (signalData.signalType === 'endcall'){
            reset();
        }
        if (signalData.signalType === 'rejectcall'){
            reset();
        }
        if (signalData.signalType === 'approvecall'){
            setCallAccepted(true);
            setIncoming(false);
            setSdp(signalData.signal);
        }
    }
    const {connectCallSecket,signal,sendSignal} = useCallingSocketHook(url,signalIn);
    useEffect(() => {
        connectCallSecket()// to connect permanently if you are online
    },[])

   
    return ( 
        <CallingContext.Provider value={{
            callType,setCallType,inRespDm,sdp,setSdp,
            callingMode,setCallingMode,
            floating,setFloating,
            calledFriend,setCalledFriend,
            incoming,setIncoming,
            callAccepted,setCallAccepted,
            callRejected,setCallRejected,
            sendSignal,caller,setCaller,
            remoteVideoRef, // for video refs
            setCameraStreem,cameraStreem,peerSignal,setPeerSignal
        }}>
            {children}
        </CallingContext.Provider>
     );
}
 
export default CallingContextProvider;