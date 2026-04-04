import { Navigate, useLocation, useOutletContext } from 'react-router-dom';


export default function RequireAuth({ children }) {
    const { user } = useOutletContext();
    const location = useLocation();

    if (!user) {
        return <Navigate replace state={{ from: location }} to="/" />;
    }

    return children;
}