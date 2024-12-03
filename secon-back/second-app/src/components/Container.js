import { useEffect } from "react";
import Col1 from "../Col1";
import Col2 from "../Col2";

const Container = (props) => {
    useEffect(() => {
        // stopProp();
    })
    return ( 
        <div className="container">
            {/* log-out container  */}
            <div className="tri-content dropdown hidden">
                <a href="##" className="add-account header-link child-link">Add another account</a>
                <a href="##" className="log-out header-link child-link">LogOut from <span className="current-account">Coiner mk</span></a>
                <div className="drowtri"><div className="triangle"></div></div>
            </div>
            <Col1/>
            <Col2/>
        </div>
     );
}
 
export default Container;