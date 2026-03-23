import { createBrowserRouter } from 'react-router-dom'
import UserPage from "./pages/UserHome"
import HomePage from "./pages/HomePage"
import App from "./App"
import { userVerify } from './utilities'

const router = createBrowserRouter([
    {
        path:"/",
        element: <App/>,
        loader: userVerify,
        children:[
            {
                index:true,
                element:<HomePage/>
            },
            {
                path:"home",
                element: <UserPage />
            }
        ]
    }
])

export default router