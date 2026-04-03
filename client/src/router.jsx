import { createBrowserRouter } from 'react-router-dom'
import UserPage from "./pages/UserHome"
import HomePage from "./pages/HomePage"
import Townies from "./pages/Townies"
import App from "./App"
import { userVerify } from './utilities'
import Dashboard from './pages/Dashboard'
import StyleTest from './pages/StyleTest'


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
                path:"townies",
                element: <Townies />
            },
             {
                path:"dashboard",
                element: <Dashboard />
            },
             {
                path:"test",
                element: <StyleTest />
            },
        ]
    }
])

export default router