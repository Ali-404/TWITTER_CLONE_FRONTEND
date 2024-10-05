import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:3000/api/v1",
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("accessToken")  
    },
    
    
})



export async function getUserById(id){
    return await axiosClient.get(`/auth/users/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
    })
}


export default axiosClient;