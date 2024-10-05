import { useEffect } from "react"
import {  useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import SideMenu from "../components/SideMenu"
import PostsView from "../components/PostsView"
import UsersView from "../components/UsersView"

export default function Home() {
    
    const { isAuthenticated, user } = useSelector((state) => state.auth)
    const navigation = useNavigate()
    
    useEffect(() => {
        if (!isAuthenticated || !user){
          navigation("/login")
        }
    
    }, [isAuthenticated, navigation, user])

    if (!user) return null

    return (

    <div className="backdrop-blur-2xl bg-red/30 min-h-screen p-2 flex ">

      {/* side menu */}
      <SideMenu  />

      <div className="bg-slate-100 flex-1 rounded-md shadow-2xl flex flex-col-reverse md:flex-row  overflow-hidden border gap-4 md:gap-0 max-h-[98vh]">
        <PostsView />

        <UsersView />

      </div>

    </div>


  )
}
