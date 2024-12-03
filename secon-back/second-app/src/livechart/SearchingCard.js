import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useSearch from "../hooks/Searching";
import UserCard from "../components/UserCard";
import { useContext, useEffect, useState } from "react";
import { faMultiply } from "@fortawesome/free-solid-svg-icons";
import { uiContext } from "../contexts/UiContext";
import { liveChatContext } from "./LiveChatContext";

const SearchingCard = ({members,addMembers,close,action}) => {
    const  [addedFriends,setAddedFriends] = useState([]);
    const {hideAllDD} = useContext(uiContext);
    const {refreshHome} = useContext(liveChatContext);

    const [data,setData] = useState(
        localStorage.getItem("searched")? JSON.parse(localStorage.getItem("searched")) : ''
    );
    const {empty,data:searched,search} = useSearch();
    const userSelected = (e,user_id) => {
        e.stopPropagation();
        let selected = addedFriends.includes(user_id)
        if (selected) { // index found
            setAddedFriends(
                addedFriends.filter((id) => id !== user_id)
            ) ;
            return ;
        }else{
            setAddedFriends(
                [user_id,...addedFriends]
            ) ;
            return ;
        }
    }
    const closeCard = () => {
        close(false);
    }
    const handleAdding =(e) => {
        let data = {friends : addedFriends}
        if (addedFriends?.length){
            addMembers(data);
            setAddedFriends([]);
        }
    }
    const findSearch = (e) => {
        const data = e.target.value
        if (data?.length > 1){
            const content = {content : e.target.value}
            search(content)
        }
    }

    useEffect(() => {hideAllDD()},[]); // to remove all the drop down that we have
    useEffect(() => {setAddedFriends([])},[refreshHome])
    useEffect(() => {
        // search('us')
        if (searched){
            setData(searched)
        }
    },[searched])
    return ( 
        <div className="">
            <div className="post-dot-container custom-overflow addingusercard" 
                id={`addinguserCard`} onClick={(e) => {e.stopPropagation()}}
            >
                <div className="search-card-header">
                    <div className="back-icon"onClick={(e) => {closeCard(e)}} >
                        <FontAwesomeIcon icon={faMultiply}/>
                    </div>
                    <div className="list-selected-num">{addedFriends?.length}</div>
                        <button type="submit" onClick={(e) => {handleAdding(e)}} className="search-card-btn">{action}</button>
                </div>
            <form action="" className="search-form">
            <div className="small-icon">
                <FontAwesomeIcon icon={faMagnifyingGlass}/>
            </div>
            <input type="search" name="search" 
            id="search-input" className="search-input" placeholder="Search"
            onChange={(e) => {findSearch(e)}}
            />
            </form>
            {(!empty && data?.users?.length) && data.users.map((user) => {
                const alreadyIn = members.includes(user.id)
                return(action == 'add' && !alreadyIn) ? 
                    <div onClick={(e) => {userSelected(e,user.id)}} key={user.id}
                        className={`${addedFriends.includes(user.id) ? "selected" : ''}`}>
                        <UserCard object={user}  usage="adding"/>
                    </div>
                 : (action == 'remove' && alreadyIn) ? 
                 <div onClick={(e) => {userSelected(e,user.id)}} key={user.id}
                     className={`${addedFriends.includes(user.id) ? "selected-remove" : ''}`}>
                     <UserCard object={user}  usage="adding"/>
                 </div>
              : null

            })}
            </div>
        </div>
     );
}
 
export default SearchingCard;