import Card from 'react-bootstrap/Card';
import { useOutletContext } from 'react-router-dom';
import logo from '../assets/GoGoTownTracker.png';


const UserHome = () => {
    const { user } = useOutletContext()
    return (
        <>
            <Card className="UserHome">
                <Card.Body>
                    <Card.Img variant="top" src={logo} alt="app logo" className='logo' />
                    <Card.Title>Welcome to the Go-Go Town Tracker App, {user}!</Card.Title>
                    
                </Card.Body>
            </Card>
        </>
    )
}

export default UserHome