import { useContext, useEffect} from "react";
import { authContext } from "../contexts/AuthContext";
import config from "./Config";
import { dataRendingContext } from "../contexts/DataRending";

const usePostData= (url,currentData,setCurrentData) => {
    const {getToken,setError,setSuccess} = useContext(authContext)
    const {setShowCForm} = useContext(dataRendingContext);
    const applyChanges = (newData) => {
        const samepage = currentData? currentData.find(({id}) => id == newData.parent) : null ;
        // console.log(samepage);
        setShowCForm(false);
        // console.log(currentData);
        if(currentData && !samepage){
            setCurrentData([newData,...currentData]);
        }
    }
    useEffect(() => {
        // fetchData();
    },[])
    const doPost = (newData) => {
        const Aborter = new AbortController()
        setSuccess("posting...")
        setTimeout(() => {
        fetch(`${config.BASE_URL}${url}`,{
            signal: Aborter.signal,
            method:"POST",
            headers:{
                "Authorization":`Bearer ${getToken()}`,
                // "Content-Type":"multipart/form-data"
            },
            body:newData,
            // body: JSON.stringify(newData),
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
                setSuccess("post added")
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

    return {doPost};
}
 
export default usePostData;