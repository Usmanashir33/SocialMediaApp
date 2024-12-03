import { useEffect, useState } from "react";

const useFetch = (dataUrl) => {
    const [data ,setData] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    
    useEffect(() => {
        setTimeout(() => {
        fetch(dataUrl)
        // fetch("http://localhost:8000/posts")
        .then((res) => {
            if (!res.ok) {
                throw Error("Data Failed to Fetch,try again");
            }
            return res.json();
        })
        .then((data) => {
            // console.log(data);
            setLoading(false);
            setError(null);
            setData(data);
        })
        .catch((err) => {
            setLoading(false);
            setError(err.message);
        })
        },200)
    },[])

    return {data ,loading, error};
}
 
export default useFetch;