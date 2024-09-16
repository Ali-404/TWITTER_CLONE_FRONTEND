import { useForm } from "react-hook-form"
import { buttonClass, inputClass } from "../data/classes"
import axiosClient from '../axios'
import { useEffect, useState } from "react"
import {  useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
export default function Register() {

    
  const navigation = useNavigate()


  const {isAuthenticated} = useSelector((state) => state.auth)
  const {register, handleSubmit, formState, getValues, setError} = useForm()
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
    //   REGISTER
      try {

          const response = await axiosClient.post("/auth/users/create", {
              "email": data.email,
              "password": data.password,
              "firstName": data.firstName,
              "lastName": data.lastName, 
              "username": data.username
            })
      
                if (response){
                    navigation("/login")
                }
      }catch(e ){
        const fieldErrors = e.response.data.errors
        if (fieldErrors){
            fieldErrors.map(error => {
                const field = error.path 
                const msg = error.msg
                setError(field, {
                    type: "custom",
                    message: msg
                })
            })
        }else {

            setServerError(e.message)
        }

    }



    }


    return (
      <div className="bg-slate-200 min-h-screen flex">

        <div className="hidden md:block bg-[url(images/img1.jpg)] bg-cover bg-center   flex-[0.7] shadow-xl" ></div>

        <div className="flex-1 flex flex-col items-center gap-4 py-8 justify-center">
            <h1 className="text-center text-4xl ">TWITTER CLONE - <b>SIGN UP</b> </h1>

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
              
            {/* username */}
            <div>
                <label className="text-l" >Username</label>
                <input {...register("username", {
                  required: "Username Address is required!",
                  min: {
                    value: 3,
                    message: "Username must contains at lease 3 characters"
                  },
                  validate: (v) => {
                    if (v.trim().length < 3){
                        return "Username must contains at lease 3 characters"
                    } 
                    return true 
                  }
                })}  className={`${inputClass}`}  />

                {/* username errors */}
                {formState.errors.username && (
                  <div className="text-red-500">{formState.errors.username.message}</div>                  
                )}

              </div>


              {/* first name  */}
              <div>
                <label className="text-l" >First Name</label>
                <input {...register("firstName", {
                  required: "First Name is required!",
                })}  className={`${inputClass}`}  />

                {/* first name errors */}
                {formState.errors.firstName && (
                  <div className="text-red-500">{formState.errors.firstName.message}</div>                  
                )}

              </div>

              {/* last name  */}
              <div>
                <label className="text-l" >Last Name</label>
                <input {...register("lastName", {
                  required: "Last Name is required!",
                })}  className={`${inputClass}`}  />

                {/* first name errors */}
                {formState.errors.lastName && (
                  <div className="text-red-500">{formState.errors.lastName.message}</div>                  
                )}

              </div>


              <div>
                <label className="text-l" >Password</label>
                <input {...register("password", {
                  required:"Password is required!",
                  pattern: {
                    value: /^(?=.*[0-9])(?=.*[a-z])(?!.* ).{6,16}$/,
                    message: "Password must contain one digit from 1 to 9, one lowercase letter,  no space, and it must be 6-16 characters long."
                  }
                })} type="password" className={`${inputClass}`}  />

                {/* password errors */}
                {formState.errors.password && (
                  <div className="text-red-500">{formState.errors.password.message}</div>                  
                )}
              
              </div>

              <div>
                <label className="text-l" >Conferm Password</label>
                <input {...register("re_password", {
                  required:"Password Confermation is incorrect!",
                  validate: (value) => value === getValues().password || "Password Confermation incorrect"
                })} type="password" className={`${inputClass}`}  />

                {/* conferm password errors */}
                {formState.errors.re_password && (
                  <div className="text-red-500">{formState.errors.re_password.message}</div>                  
                )}
              
              </div>



              <button disabled={formState.isSubmitting} type="submit" className={`${buttonClass}`} >
                {formState.isSubmitting ? "Loading ..." : "SIGN UP "}
              </button>

              {serverError && (
                <div className="text-red-400 text-center"> {serverError}</div>
              )}

              <label className="text-l flex items-center justify-center gap-2" >Already have an account? <Link to={"/login"} href="" className={`${buttonClass} bg-blue-300 hover:bg-blue-400 `}>Login</Link></label>


            </form>
        </div>
      </div>
    )
  }
  