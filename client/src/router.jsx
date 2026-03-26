import { createBrowserRouter } from 'react-router-dom'
import UserPage from "./pages/UserHome"
import HomePage from "./pages/HomePage"
import Townies from "./pages/Townies"
import App from "./App"
import { userVerify } from './utilities'
import Dashboard from './pages/Dashboard'

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
            },
             {
                path:"townies",
                element: <Townies />
            },
             {
                path:"dashboard",
                element: <Dashboard />
            },
        ]
    }
])

export default router