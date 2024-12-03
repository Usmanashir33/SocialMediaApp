import { useContext } from "react";
import Search from "./components/Search";
import { uiContext } from "./contexts/UiContext";

const Col2 = () => {
    const {theme} = useContext(uiContext)
    const cardStyle = {
        backgroundColor : theme.bgColor,
    }
    return ( 
        <div className="col2 custom-overflow" style={cardStyle}>
            <Search/>
        </div>
     );
}
 
export default Col2;