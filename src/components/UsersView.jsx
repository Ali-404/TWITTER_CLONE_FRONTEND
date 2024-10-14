import { useState } from "react"
import { useEffect } from "react"
import axiosClient from "../axios"
import UserProfileImg from "./UserProfileImg"

const UserTab = ({user}) => {
  return (
    <button className=" min-w-[250px] rounded-lg md:min-w-max  text-start  hover:bg-orange-200 transition-all md:w-full bg-orange-100 shadow-md my-1  h-12  flex gap-3 items-center p-4">
        <UserProfileImg url={user.profile_img} letter={user.username[0]} />
      <div className="text-sm">
        <h1>{user.firstName ? (user.firstName + " " + user.lastName) : user.email}</h1>
        <span className="text-emerald-400">@{user.username}</span>
      </div>
    </button>
  )
}


export default function UsersView() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    axiosClient.get("/auth/users", {
      headers:{
        Authorization:`Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(response => {
      setUsers(response.data)
    })
  }, [])


  return (
    <div className="md:flex-[0.3] flex-[0.2] flex md:flex-col items-center gap-5 md:gap-0  overflow-auto p-2  border-l border-gray-200 shadow-md  ">
      <h1 className="text-center text-2xl  text-orange-400 shadow-sm  ">Users</h1>
      {
        users.map((userData, key) => (
          <UserTab key={key} user={userData} />
        ))
      }

    </div>
  )
}
