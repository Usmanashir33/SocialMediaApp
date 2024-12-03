import { useContext, useEffect } from "react";
import { uiContext } from "../contexts/UiContext";

const About = () => {
    const {hideAllDD,showCardDD,showLogOut,setShowLogOut} = useContext(uiContext);
    useEffect(() => {
        setShowLogOut('hidden');
        // alert("ikon Allah")
    },[])
    return ( 
        <div className="about-pg">
            <h1>Know much about the site</h1>
           <div className="about-card ">
                <h3>Why this project ? </h3>
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
 
export default About;