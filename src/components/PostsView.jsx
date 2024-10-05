import Textarea from 'react-expanding-textarea'
import {buttonClass} from '../data/classes'
import Post from './Post'
import { useEffect, useState } from 'react'
import axiosClient from '../axios'
import UserProfileImg from './UserProfileImg'
import { useSelector } from 'react-redux'

const UserWrite = () => {
  const {  user } = useSelector((state) => state.auth)
  return (
    <div className="p-4 rounded-md shadow-md bg-slate-50 flex flex-col  w-[95%] md:w-[60%]">

      <div className=" flex  justify-between gap-2">
        <UserProfileImg url={user.profile_img} letter={user.username[0]} />
        <Textarea   placeholder="What is Happening ?"  className="resize-none outline-none flex-1 bg-transparent"  ></Textarea>
      </div>
      <div className='flex items-center gap-3 py-2 justify-between'>
          <div className='flex gap-4'>
            <button className='flex items-center justify-between gap-1 text-sm text-emerald-600'>
              <i className='material-icons'>image</i>
              Add picture
            </button>
            <button className='flex items-center justify-between gap-1 text-sm text-emerald-600'>
              <i className='material-icons'>movie</i>
              Add video clip
            </button>
          </div>

          <button className={buttonClass + " text-sm bg-orange-200 hover:bg-orange-400"}>POST</button>
      </div>
    </div>

  )
}




export default function PostsView() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    axiosClient.get("/posts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then((res) => {
      setPosts(res.data)
    })
  }, [])
  return (
    <div className="flex-1 flex items-center flex-col md:p-6 gap-4 overflow-auto">

        <UserWrite />

        {/* container */}
        {posts && posts.posts?.map((post,key) => (
          <Post postData={post} key={key} />
        ))}



    </div>
  )
}
