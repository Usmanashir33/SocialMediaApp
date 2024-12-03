import { useContext, useEffect} from "react";
import { authContext } from "../contexts/AuthContext";
import config from "./Config";
import { dataRendingContext } from "../contexts/DataRending";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const useUpdateData= (url,currentData,setCurrentData) => {
    const {getToken,setError,setSuccess} = useContext(authContext);
    const {setShowUForm,isParent,setIsParent} = useContext(dataRendingContext);

    const applyChanges = (newData) => {
        // console.log('isParent: ', isParent);
        setShowUForm(false);
        if (isParent){
            setCurrentData(newData);
            setIsParent(false);
            return
        }
        const samepage = currentData? currentData.find(({id}) => id == newData.parent) : null ;
        if(currentData && !samepage){ 
            setCurrentData(currentData.map((child) => 
                child.id == newData.id ? newData : child
            ));
        }
    }
    useEffect(() => {
        // fetchData();

    },[])
    const doUpdate = (newData) => {
        const Aborter = new AbortController() ;
        setTimeout(() => {
        fetch(`${config.BASE_URL}${url}`,{
            signal: Aborter.signal,
            method:"PUT",
            headers:{
                "Authorization":`Bearer ${getToken()}`,
                // "Content-Type":"application/json"
            },
            // body: JSON.stringify(newData),
            body:newData,
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
            if (!data.error){
                applyChanges(data);
                setSuccess("Updated")
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
            }, 500);
        })
        },200)
        return (() => {Aborter.abort()})
    }

    return {doUpdate};
}
 
export default useUpdateData;