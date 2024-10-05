import { motion } from "framer-motion"
import {  useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../features/authSlice"
import { useNavigate } from "react-router-dom"
import UserProfileImg from "./UserProfileImg"


const btnClass = 'bg-orange-200 rounded-md shadow-md px-4 py-1 w-full hover:bg-orange-300 transition-all'

export default function SideMenu(props)  {


  const [isMenuShown, setIsMenuShown] = useState(true)
  const dispatch = useDispatch()
  const navigation = useNavigate()
  const {user} = useSelector((state) => state.auth)

 

  const logoutFunc = () => {
    dispatch(logout({
      navigation
    }))
  }

  if (!user) return null


  return (
    <>
      <button onClick={() => setIsMenuShown(o => !o )} className="z-[500] absolute md:hidden rounded-full flex items-center justify-center shadow-md  bg-orange-400 w-8 h-8">
      <span className="material-icons">menu</span>
      </button>

     
      <motion.div {...props} className={` ${!isMenuShown && "hidden"} bg-slate-50 md:bg-transparent h-[100vh] md:h-auto absolute md:relative   md:flex p-4 *:w-full *:flex *:flex-col *:items-center  flex-[0.2] min-w-[300px]  flex-col items-center gap-2`}>
        <div >
          <UserProfileImg url={user.profile_img} letter={user.username[0]} w="150px" h="150px" letterSize="5rem" />
          <h1>{user.firstName ? user.firstName + " " + user.lastName : user.username}</h1>
          <h4 className="text-emerald-600">@cristiano</h4>
          <h4 className="text-emerald-600">{user.email}</h4>
          <hr className="w-full my-5" />
          
            {user.description ? <p>{user.description}</p> : <button className={btnClass}>Add Description</button>}
        </div>

        {/* buttons */}
        <div className="flex-1 items-end justify-end gap-1">
        
          <button className={btnClass} > Change Information</button>
          <button className={btnClass} onClick={logoutFunc}  >Logout</button>
        </div>
      </motion.div>

    </>
  )
}
