import { useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import useGetUser from "../hooks/useGetUser";
import UserCard from "./UserCard";

const Followings = () => {
    const {id} = useParams();
    const {user:users,fetchUser} = useGetUser()

    useEffect(() => {
        fetchUser(`/accounts/user/${id}/followings/`)
    },[id])
    return ( 
        <div className="followers-page">
           {users && users.map((user) => 
                <div>
                    <UserCard object={user}/>
                </div>
           )
           }
           {(users && !users.length) && <div className="no-selcted ">
                You don't follow any body
            </div>}
        </div>
     );
}
 
export default Followings;