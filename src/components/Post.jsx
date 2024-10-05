import { useEffect, useRef, useState } from "react";
import { buttonClass, inputClass } from "../data/classes";
import TextAreaWithEllipsis from "./TextAreaWithEllips";
import UserProfileImg from "./UserProfileImg";
import axiosClient, { getUserById } from "../axios";
import { formatDate } from "../data/usefull";
import { useSelector } from "react-redux";

export default function Post({postData}) {

  const {  user } = useSelector((state) => state.auth)

  const [commentsShown, setCommentShowns] = useState(false)
  const [poster, setPoster] = useState(false)


  const [vues, setVues ] = useState([])
  const [comments, setComments ] = useState([])
  const [likes, setLikes ] = useState([])

  const postRef = useRef(null)

  const incrementViews = async () => {
    await axiosClient.post("vues/add",{
      postId:postData.id,
      viewerId:user.id
    },{
      headers:{
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then((res) => {
      setVues((prev) => [...prev,res.data])
    }).catch(e => console.error(e))
  }
 

  useEffect(() => {
    // get poster data
    getUserById(postData.posterId).then(res => {
      setPoster(res.data)

    })
    
    // get vues
    const vuesLoadFunc = () => { axiosClient.get(`/vues/${postData.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then((res) => {
      if (Array.isArray(res.data)) {

        setVues(res.data ?? [])
      }
    })
  }


    vuesLoadFunc()

    

    // ================================= VUES COUNTER OBSERVER


    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // setVu((prevViews) => prevViews + 1);
            // increment here in post request if its not alreay vued
              incrementViews()

            // You can disconnect the observer if you only want to count once
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 } // The element must be 50% visible in the viewport
    );
    const currentEl = postRef.current 
    if (currentEl) {
      observer.observe(currentEl);
    }

    // Clean up the observer when the component is unmounted
    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
    

  }, [postData.posterId,postData.id,user.id])

  if (!poster) return <div>Loading ...</div>

  return (
    <div onClick={incrementViews} className="p-4  rounded-md shadow-md bg-slate-50 flex flex-col  w-[95%] md:w-[60%] gap-4" ref={postRef}>

      <div className="flex gap-2">
      <UserProfileImg url={poster.profile_img} letter={poster.username[0]} />
     

            <div className="text-sm flex flex-col items-start">
                <h1>{poster.firstName ? poster.firstName + " " + poster.lastName : "@"+poster.username}  </h1>
                <small className="text-orange-400">{formatDate(postData.createdAt)} </small>
            </div>

      </div>

      <div>

    {/* !! todo */}
      {/* <img src="https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcS-_ycPMliqwjkLSNXt6aMeqPUvYxmz2NJ_PwgLJXxNuuEkQN8H5VApnN0r_vX3KMwMpebw3_EA5sNJHAo" className="w-[100%] object-contain rounded-md shadow" /> */}

      <TextAreaWithEllipsis text={postData.content} />
     

      <hr className="w-full" /> 
      </div>


        {/* tools */}
      <div className="flex items-center gap-4 text-sm justify-between"> 
            <div className="flex items-center gap-2">
                <span className="flex items-center text-center gap-1 text-emerald-400">
                    <button className="material-icons text-emerald-400">
                        favorite_outline
                    </button>
                    10M
                </span>

                <span className="flex items-center text-center gap-1 text-emerald-400">
                    <button className="material-icons text-emerald-400">
                        comment
                    </button>
                    5M
                 </span>

        </div>

        <span className="flex items-center text-center gap-1 text-orange-400">
            <button className="material-icons text-orange-400">
                visibility
            </button>
            {vues.length ?? 0} 
        </span>

       



      </div>
        
      <div className="max-h-[400px] flex flex-col overflow-auto p-3">
        <div className="text-lg flex items-center gap-2"><h1>Comments</h1> <button onClick={() => setCommentShowns(o => !o)} className="material-icons">visibility{ commentsShown && "_off" }</button> </div>
        <hr />
        
        {commentsShown && (
          <UserCommentInput />
        )}
        
        
        
        
        {commentsShown && (
          <>
          <Comment />
          <Comment />
          <Comment />
          <Comment />
          </>
        ) }
        {commentsShown && (
        <button className={buttonClass + " border bg-transparent p-0"} > Load More</button>
        )}

      </div>
    </div>
  )
}




// extra components
const UserCommentInput = () => {
  return (
    <div className="flex gap-4 py-5">
      
      <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSFUDYpxDZeOMsExGN-IlyQ2VoLjYLNUHMQVnr3kuvagF0QcqxTVspw46v4bdjCsMWOuYnnuA_g8D6XUNMkhNLAOb8BiyI0308d0SXtDVQ" className=" min-w-[40px] max-w-[40px] h-[40px] rounded-full  object-cover object-center"  />
      <input className={inputClass + " border-none placeholder:text-sm" } placeholder="Add you comment .."  />
    </div>
  )
}


const Comment = () => {
  return (
    <div className="flex gap-4 py-5 ">
      
      <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSFUDYpxDZeOMsExGN-IlyQ2VoLjYLNUHMQVnr3kuvagF0QcqxTVspw46v4bdjCsMWOuYnnuA_g8D6XUNMkhNLAOb8BiyI0308d0SXtDVQ" className=" min-w-[40px] max-w-[40px] h-[40px] rounded-full  object-cover object-center "  />
     
     
     <div>
     {/* infos */}
        <div className="flex gap-2 items-center">
          <span className="font-bold">Cristiano Ronaldo</span>
          <small className="bg-orange-200 rounded-md shadow-md px-1 italic opacity-70">4h ago</small>
          
          {/* spacer */}
          <div className="flex-1"></div>
          
          <button >
            <i  className="material-icons text-md text-orange-300">delete</i>
          </button>
        </div>
        {/* comment */}
        <p className="text-sm">Est aliqua aliquip est pariatur voluptate minim ut anim.Magna deserunt voluptate exercitation sunt enim deserunt reprehenderit.Amet deserunt exercitation sunt officia labore aliquip esse proident.</p>
     </div>



    </div>
  )
}