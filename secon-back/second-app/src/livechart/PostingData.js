import { useContext, useEffect} from "react";
import { authContext } from "../contexts/AuthContext";
import config from "../hooks/Config";
import { dataRendingContext } from "../contexts/DataRending";
import { uiContext } from "../contexts/UiContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { liveChatContext } from "./LiveChatContext";

const useAddData= (url,currentData,setCurrentData,setShowComForm,method) => {
    const history = useHistory();
    const {getToken,setError,setSuccess,setLoading} = useContext(authContext)
    const {setShowCForm} = useContext(dataRendingContext);
    const {hideAllDD} = useContext(uiContext);
    const {setRefreshHome,refreshHome} = useContext(liveChatContext);
    const usersAltered = (response) => {
        //setCurrentData();
        hideAllDD();
        setRefreshHome(!refreshHome)
    }
    const applyChanges = (newData) => {
        setShowComForm(false)
        if (method == "POST"){
            setCurrentData([newData,...currentData]);
            hideAllDD();
        }else if(method == 'PUT'){
            setCurrentData(newData.name)
            hideAllDD();
            setRefreshHome(!refreshHome)
        }else if(method == "DELETE"){
            // history.go(-1)
            history.push('/community')
            setRefreshHome(!refreshHome)
        }
    }
    useEffect(() => {
        // fetchData();
    },[])
    const doAdd = (newData) => {
        setLoading(true)
        const Aborter = new AbortController()
        // setSuccess("sending...")
        setTimeout(() => {
        fetch(`${config.BASE_URL}/${url}`,{
            signal: Aborter.signal,
            method:`${method}`,
            headers:{
                "Authorization":`Bearer ${getToken()}`,
                "Content-Type":"application/json"
            },
            body: JSON.stringify(newData),
        })
        .then((res) => {
            // console.log('hi',res );
            if (!res.ok) {
                throw Error('resp not ok!');
            }
            return res.json();
        })
        .then((data) => {
            // console.log(data);
            setLoading(false)
            if (data.success){
                usersAltered(data.succes)
            }
            else if(!data.error){
                applyChanges(data);
                setSuccess("New Community Created")
            }else{
                setError(data.error)
            }
        })
        .catch((err) => {
            if (err.name !== "AbortError"){
                setError(err.message);
            }
        })
        .finally(() => {
            setTimeout(() => {
                setSuccess(null)
                setError(null);
                setLoading(false)
            }, 500);
        })
        },200)
        return (() => {Aborter.abort()})
    }

    return {doAdd};
}
 
export default useAddData;