import {  useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { useEffect } from "react";
import { getUser, login, logout } from "./features/authSlice";
import { CircularProgress, createTheme, ThemeProvider } from "@mui/material";

export default function App() {


    const theme = createTheme({
        palette: {
          primary: {
            // light: '#757ce8',
            main: '#FED7AA',
            // dark: '#002884',
            contrastText: '#181621',
          },
        //   secondary: {
        //     light: '#ff7961',
        //     main: '#f44336',
        //     dark: '#ba000d',
        //     contrastText: '#000',
        //   },
        },
      });


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

    if (status == "loading")return <CircularProgress />


  return (
    <ThemeProvider theme={theme} >
      <RouterProvider router={routes}  >
      </RouterProvider>
    </ThemeProvider>
  )
}
