import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import UserCard from "./UserCard";
import useSearch from "../hooks/Searching";
import CommunityCard from "../livechart/CommunityCard";
import { uiContext } from "../contexts/UiContext";
import { height } from "@fortawesome/free-solid-svg-icons/faSignOut";

const Search = () => {
    const [data,setData] = useState(
        localStorage.getItem("searched")? JSON.parse(localStorage.getItem("searched")) : ''
    )
    const {theme} = useContext(uiContext)
    const cardStyle = {
        backgroundColor : theme.bgColor,
        height: `100%`,
    }
    const cardStyle2 = {
        backgroundColor : theme.bgColor2,
    }
    const textStyle = {
        color : theme.color,
    }
   
    const textStyle2 = {
        color : theme.color2,
    }
    const iconStyle = {
        color : theme.iconColor,
    }
    const {empty,data:searched,search} = useSearch()
    const findSearch = (e) => {
        const data = e.target.value
        if (data.length > 1){
            const content = {content : e.target.value}
            search(content)
        }
    }
    
    useEffect(() => {
        if (searched){
            setData(searched)
        }
    },[searched])
    
    return (
    <div className="search" style={cardStyle}>
        <form action="" className="search-form" style={cardStyle2}>
        <div className="search-icon icn" style={iconStyle}>
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
        </div>
        <input type="search" name="search" 
        id="search-input" className="search-input" placeholder="Search"
        onChange={(e) => {findSearch(e)}}
        />
        </form>
        <div className="space space-fixed">

         {(!empty && data.users) && data.users.map((item) => (
            <UserCard object={item} key={item.id} />
         ))}

         {(!empty && data) && data.communities.map((item) => (
            <CommunityCard object={item} key={item.id} usage ='search'/>
         ))}

        {empty && <div className="failed-container" >
            {empty}
        </div> }
        </div>
    </div>
    );
}
 
export default Search;