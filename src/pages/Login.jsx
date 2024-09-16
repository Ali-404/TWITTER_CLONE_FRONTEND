import { useForm } from "react-hook-form"
import { buttonClass, inputClass, linkClass } from "../data/classes"
import axiosClient from '../axios'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUser, login } from "../features/authSlice"
import { Link, useNavigate } from "react-router-dom"
export default function Login() {
  const navigation = useNavigate()


  const {isAuthenticated} = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const {register, handleSubmit, formState} = useForm()
  const [serverError,setServerError] = useState(null)

  useEffect(() => {
    if (isAuthenticated){
      navigation("/")
      return
    }
  }, [isAuthenticated, navigation])


   if (isAuthenticated) return null


    

    const onSubmit = async (data) => {
      setServerError(null)
      if (isAuthenticated){
        navigation("/")
        return 
      }
      try {
        const response = await axiosClient.post("/auth/users/login", {
          "email": data.email,
          "password": data.password
        })

        const token = response.data.token

        dispatch(login({
          token,
        }))
        
        dispatch(getUser( ))
        navigation("/")  


        

        
      }catch(e) {
        const errorMessage =e.response.data.error ?? e.message 
        setServerError(errorMessage)      
      }

    }


    return (
      <div className="bg-slate-200 min-h-screen flex">

        <div className="hidden md:block bg-[url(images/img1.jpg)] bg-cover bg-center   flex-[0.7] shadow-xl" ></div>

        <div className="flex-1 flex flex-col items-center gap-4 py-8 justify-center">
            <h1 className="text-center text-4xl ">TWITTER CLONE - <b>LOGIN</b> </h1>

            <form method="post" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 min-w-[80vw] md:min-w-[40vw] md:p-4 md:px-8">
              <div>
                <label className="text-l" >Email Address</label>
                <input {...register("email", {
                  required: "Email Address is required!",
                  pattern:{
                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                    message: "Enter a valid email"
                  }
                })}  className={`${inputClass}`}  />

                {/* email errors */}
                {formState.errors.email && (
                  <div className="text-red-500">{formState.errors.email.message}</div>                  
                )}

              </div>

              <div>
                <label className="text-l" >Password</label>
                <input {...register("password", {
                  required:"Password is required!"
                })} type="password" className={`${inputClass}`}  />

                {/* password errors */}
                {formState.errors.password && (
                  <div className="text-red-500">{formState.errors.password.message}</div>                  
                )}
              
              </div>



              <label className="text-l" >Password forgotten? <a className={linkClass}>Reset password</a></label>
              <button disabled={formState.isSubmitting || formState.isLoading} type="submit" className={`${buttonClass}`} >
                {(formState.isSubmitting || formState.isLoading) ? "Loading ..." : "LOGIN "}
              </button>

              {serverError && (
                <div className="text-red-400 text-center"> {serverError}</div>
              )}

              <label className="text-l flex items-center justify-center gap-2" >First time here? <Link to={"/register"} className={`${buttonClass} bg-blue-300 hover:bg-blue-400 `}>Create Account</Link></label>


            </form>
        </div>
      </div>
    )
  }
  