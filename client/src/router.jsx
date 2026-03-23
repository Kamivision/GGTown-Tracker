import { createBrowserRouter } from 'react-router-dom'
// import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import App from "./App"

const router = createBrowserRouter([
    {
        path:"/",
        element: <App/>,
        children:[
            {
                index:true,
                element:<HomePage/>
            },
            // {
            //     path:"home",
            //     element: <HomePage />
            // }
        ]
    }
])

export default router