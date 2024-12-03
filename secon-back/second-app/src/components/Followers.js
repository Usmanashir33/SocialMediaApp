import { useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import useGetUser from "../hooks/useGetUser";
import UserCard from "./UserCard";

const Followers = () => {
    const {id} = useParams();
    const {user:users,fetchUser} = useGetUser()

    useEffect(() => {
        fetchUser(`/accounts/user/${id}/followers/`)
    },[id])
    // console.log(users);
    return ( 
        <div className="followers-page">
           {users && users.map((user) => 
                <div>
                    <UserCard object={user}/>
                </div>
           )
           }
            {(users && !users.length) && <div className="no-selcted ">
                You don't have any follower
            </div>}
        </div>
     );
}
 
export default Followers;