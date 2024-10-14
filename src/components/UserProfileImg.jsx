import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export default function UserProfileImg({ url = "invalid-url", w = "40px", h = "40px", letter = "A", letterSize="15px" }) {
  const [failed, setFailed] = useState(false);
  

  useEffect(() => {
    if (typeof(url) != "string"){
      setFailed(true);
    }
  }, [url])
  
  if (!failed) {
    return (
  
      <img
        src={url}
        className={`rounded-full object-cover object-center`}
        style={{ width: w, height: h }}
        onError={(e) =>{e.currentTarget.onerror = null; setFailed(true)}}
      />
    )
  }else {
    return (
      <span
      className="rounded-full text-black text-center bg-gray-300 flex items-center justify-center uppercase"
      style={{ width: w, height: h , fontSize: letterSize}}
    >
      {letter}
    </span>
    )
  }
  
}
