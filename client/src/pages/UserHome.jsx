import Card from 'react-bootstrap/Card';
import { useOutletContext } from 'react-router-dom';


const UserHome = () => {
    const { user } = useOutletContext()
    return (
        <>
            <Card className="UserHome">
                <Card.Body>
                    <Card.Title>Welcome to the Go-Go Town Tracker App, {user}!</Card.Title>
                </Card.Body>
            </Card>
        </>
    )
}

export default UserHome