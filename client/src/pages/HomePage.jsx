import { useOutletContext } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import Card from 'react-bootstrap/Card';
import logo from '../assets/GoGoTownTracker.png';

const HomePage = () => {
    const {setUser} = useOutletContext()
    

    return (
        <>
            <div className="home-page-shell">
                <Card className="Home">
                    <Card.Body>
                        <Card.Img variant="top" src={logo} alt="app logo" className='logo' />
                        <Card.Title>Welcome to the Go-Go Town Tracker App!</Card.Title>
                        <p className="home-page-instructions">Track your townies and quests with ease. <br></br> Please log in or create an account to get started!</p>
                    </Card.Body>
                </Card>
                <Card className="UserForm">
                    <Card.Body>
                        <AuthForm setUser={setUser} />
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default HomePage