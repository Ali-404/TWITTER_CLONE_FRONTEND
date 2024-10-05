import {  useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { useEffect } from "react";
import { getUser, login, logout } from "./features/authSlice";

export default function App() {
    const dispatch = useDispatch()
    const {  status } = useSelector(state => state.auth);
    useEffect(() => {
        // try login if there is a token 
        const token = localStorage.getItem("accessToken");
        if (token) {
            dispatch(login({token}))
            dispatch(getUser())

        }else {
            dispatch(logout())
        }
    }, [dispatch])

    if (status == "loading")return null


  return (
      <RouterProvider router={routes}  >
      </RouterProvider>
  )
}
