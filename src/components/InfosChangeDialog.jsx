/* eslint-disable react/prop-types */
import { Button, DialogActions, Dialog, DialogTitle, DialogContent, TextareaAutosize, Input, CircularProgress, Snackbar } from "@mui/material";
import { isImageURLValid } from "../data/usefull";
import { useRef, useState } from "react";
import axiosClient from "../axios";

export default function InfosChangeDialog({ user,onClose, open }) {

    const [loading,setLoading] = useState(false)

    const [msg,setmsg] = useState(false)
    
    const [invalidImg, setInvalidImg] = useState(false)
    const [data, setData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        profile_img: user.profile_img,
        description: user.description
    })

    const imgRef = useRef(null)
    // onClose(confermed = false)
    const onImageSelected = async (e) => {
        try {
            setLoading(false)
            const file = e.target.value
    
            if (file && await isImageURLValid(file)){
                setInvalidImg(false)
                imgRef.current.src = file
                setData(prev => ({...prev, profile_img: file}))
            }else {
                setInvalidImg(true)
            }
            
        }finally{
            setLoading(false)
        }
    }

    const updateProfile = async () => {
        try {
            setLoading(true)
            const res = await axiosClient.patch("/auth/users/updateUser", data,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            } )

            setmsg(res.data.message)
            window.location.reload()
        }catch(e) {
            console.warn(e)
            setmsg(e.message ?? e.toString())
        }finally{
            setLoading(false)
        }
    }
     


    return (
        <>

        <Snackbar
            open={msg != false}
            onClose={() => setmsg(false)}
            autoHideDuration={3000}
            message={msg.toString()}
        />
        <Dialog  hideBackdrop className="bg-black bg-opacity-30"  onClose={onClose} open={open}  >
        
            <DialogTitle  classes={{root: "gap-2 flex items-center justify-center "}}> <i className="material-icons" >edit</i> Change My Information</DialogTitle>
            {!loading ? (
                <>
                <DialogContent classes={{root: "flex flex-col gap-4"}}>

                    {invalidImg ? (
                        <CircularProgress />
                    ) : (
                    <img ref={imgRef} src={data.profile_img} className="w-[200px] h-[200px] object-cover" />

                    ) }

                    <Input   onChange={async (e) => await onImageSelected(e)} defaultValue={data.profile_img} placeholder="Change Picture (url)" className="resize-none w-full outline-none border-b-2" type="url"  ></Input>
                
                    <Input required placeholder="Change First Name" className="resize-none w-full outline-none border-b-2" defaultValue={data.firstName ?? ""} onChange={(e) => setData(prev => ({...prev, firstName: e.target.value}))} ></Input>
                
                    <Input required defaultValue={data.lastName ?? ""} placeholder="Change Last Name" className="resize-none w-full outline-none border-b-2" onChange={(e) => setData(prev => ({...prev, lastName: e.target.value}))} ></Input>
                
                    <TextareaAutosize defaultValue={data.description ?? ""} placeholder="Change the description" className="resize-none w-full outline-none border-b-2" onChange={(e) => setData(prev => ({...prev, description: e.target.value}))} ></TextareaAutosize>

                </DialogContent>
                
                
                <DialogActions>
                    <Button disabled={invalidImg || loading} variant="contained" color="warning" classes={{root: "flex-1"}} onClick={async () => await updateProfile() && onClose(true)} >UPDATE</Button>
                    <Button variant="contained" onClick={() => onClose(false)}  >Cancel</Button>
                </DialogActions>
            </>
            ) : (
                <DialogContent classes={{root: "flex flex-col gap-4"}}>

                    <CircularProgress />

                </DialogContent>
            ) }
        </Dialog>
        </>
    );
  }
  
