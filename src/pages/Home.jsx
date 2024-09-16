import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../features/authSlice"

export default function Home() {
   const { isAuthenticated, user } = useSelector((state) => state.auth)
   const dispatch = useDispatch()
    const navigation = useNavigate()
   useEffect(() => {
     if (!isAuthenticated || !user){
        navigation("/login")
     }
    
   }, [isAuthenticated, navigation, user])

   if (!user) return null

    return (
    <div>
      Welcome {user.username}
      <button onClick={() => dispatch(logout({
        navigation
      }))}>Logout</button>
    </div>
  )
}
