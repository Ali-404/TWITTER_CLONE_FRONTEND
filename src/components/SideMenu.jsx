import { motion } from "framer-motion"
import {  useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../features/authSlice"
import { useNavigate } from "react-router-dom"
import UserProfileImg from "./UserProfileImg"
import { Button } from "@mui/material"
import InfosChangeDialog from "./InfosChangeDialog"



export default function SideMenu(props)  {


  const [isMenuShown, setIsMenuShown] = useState(true)
  const dispatch = useDispatch()
  const navigation = useNavigate()
  const {user} = useSelector((state) => state.auth)

  const [changeInfosFormShown, setChangeInfosFormShown] = useState(false)


 

  const logoutFunc = () => {
    dispatch(logout({
      navigation
    }))
  }

  if (!user) return null


  return (
    <>
      <button  style={{background: "#FED7AA"}}   onClick={() => setIsMenuShown(o => !o )} className="z-[500] absolute md:hidden rounded-full flex items-center justify-center shadow-md  w-8 h-8">
      <span className="material-icons">menu</span>
      </button>

      <InfosChangeDialog user={user} open={changeInfosFormShown} onClose={() => setChangeInfosFormShown(false)} />
     
      <motion.div {...props} className={` ${!isMenuShown && "hidden"} bg-slate-50 md:bg-transparent h-[100vh] md:h-auto absolute md:relative   md:flex p-4 *:w-full *:flex *:flex-col *:items-center  flex-[0.2] min-w-[300px]  flex-col items-center gap-2 z-50`}>
        <div >
          <UserProfileImg url={user.profile_img} letter={user.username[0]} w="150px" h="150px" letterSize="5rem" />
          <h1>{user.firstName ? user.firstName + " " + user.lastName : user.username}</h1>
          <h4 className="text-emerald-600">@{user.username}</h4>
          <h4 className="text-emerald-600">{user.email}</h4>
          <hr className="w-full my-5" />
            <p className="text-start w-full opacity-60">📝Description:</p>
            {user.description &&   <p className="w-full">{user.description}</p> }
        </div>

        {/* buttons */}
        <div className="flex-1 items-end justify-end gap-1">
        
          <Button variant="contained" className="w-full" onClick={() => setChangeInfosFormShown(true)} > Change Information</Button>
          <Button variant="contained" className="w-full"  onClick={logoutFunc}  >Logout</Button>
        </div>
      </motion.div>

    </>
  )
}


