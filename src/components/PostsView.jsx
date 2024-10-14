import Textarea from 'react-expanding-textarea'
import {buttonClass} from '../data/classes'
import Post from './Post'
import { useCallback, useEffect, useState } from 'react'
import axiosClient from '../axios'
import UserProfileImg from './UserProfileImg'
import { useSelector } from 'react-redux'
import { CircularProgress } from '@mui/material'

// eslint-disable-next-line react/prop-types
const UserWrite = ({loadPosts}) => {
  const {  user } = useSelector((state) => state.auth)
  const [postText, setPostText] = useState("");
  const [isSending, setIsSending] = useState(false)

  

  const addPost = async () => {
    try {
      const result = await axiosClient.post("/posts/create", {
        content: postText,
      }, {
        headers: {
          Authorization: `Berear ${localStorage.getItem("accessToken")}`
        }
      })

      
      if (result.data){
        loadPosts()
        setPostText("");
      }

      setIsSending(false)
    }
    catch(err) {
      console.error(err)
    }
    
  }


  return (
    <div className="p-4 rounded-md shadow-md bg-slate-50 flex flex-col  w-[95%] md:w-[60%]">

      <div className=" flex  justify-between gap-2">
        <UserProfileImg url={user.profile_img} letter={user.username[0]} />
        <Textarea  value={postText} onChange={(e) => setPostText(e.currentTarget.value)}  placeholder="What is Happening ?"  className="resize-none outline-none flex-1 bg-transparent"  ></Textarea>
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

    
          <button disabled={postText.trim().length <= 0 || isSending} className={buttonClass + " text-sm bg-orange-200 hover:bg-orange-400"} onClick={addPost}>{

            isSending ? (<CircularProgress />) : (<>POST</>)
          }</button>
      </div>
    </div>

  )
}




export default function PostsView() {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [nextDataExists, setNextDataExists] = useState(true);

  const loadPosts = async (firstTime = false) => {

    try {
      const res = await axiosClient.get("/posts", {
        params: { 
          page: currentPage
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
  
      if (res.data.posts) {
        setPosts((prevPosts) => {
          console.log(firstTime)
          let _prevPosts = firstTime ? [] : prevPosts
          
          return [..._prevPosts  , ...res.data.posts]
        }); // Append new posts 
        setNextDataExists(res.data.nextDataExists)
      }
    } catch (err) {
      console.error(err);
    }finally{
      setCurrentPage((prev) => prev + 1)
    }
  }

  useEffect(() => {
    if (posts.length === 0){
      loadPosts(true)
    }
   
  }, []);

  return (
    <div className="flex-1 flex items-center flex-col md:p-6 gap-4 overflow-auto">
      <UserWrite loadPosts={loadPosts} />

      {/* container */}
      {posts && posts.sort((p1,p2) => new Date(p2.createdAt) - new Date(p1.createdAt)  ).map((post, key) => (
        <Post postData={post} key={key}  />
      ))}

        {nextDataExists && (
        <button className={buttonClass + " border bg-transparent p-0"} onClick={async () => await loadPosts() }>
          Load More
        </button>

        )}
    </div>
  );
}



