import { useContext, useEffect } from "react";
import { uiContext } from "../contexts/UiContext";

const Support = () => {
    const {hideAllDD,showCardDD,showLogOut,setShowLogOut} = useContext(uiContext);
    useEffect(() => {
        setShowLogOut('hidden');
    },[])
    return ( 
        <div className="about-pg">
            <h1>Supports</h1>
            <div className="about-card ">
                <h3>Site Support and Assistance? </h3>
                <article>
                    The reason is that 
                </article>
            </div>
            <div className="features border">
                <h2>App Features : </h2>
                <div className="">
                    
                </div>
           </div>
        </div>
     );
}
 
export default Support;