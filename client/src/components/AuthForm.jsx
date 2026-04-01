import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { handleUserAuth } from '../utilities';

const AuthForm = ({setUser}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [create, setCreate] = useState(true)
    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault()
        let userDict = {
            email:email,
            password: password
        }
        let method = create ? 'CREATE ACCT' : 'LOGIN ACCT'
        console.log(userDict, method)
        let user = await handleUserAuth(userDict, create)
        setUser(user)
        setCreate(true)
        setEmail('')
        setPassword('')
        navigate('/dashboard')
    }

    return (
        <>
            <Form onSubmit={handleSubmit} className="AuthForm">
                <Form.Label><h2>{create ? "Create an Account" : "Log In"} to View Your Dashboard!!</h2></Form.Label>
                <Form.Text className="">
                    WARNING: at this time the dashboard contains spoilers for hidden townies. Check back for updates to prevent this soon.   
                </Form.Text>    
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label></Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email address" 
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label></Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="switch">
                    <Form.Check
                        type="switch"
                        label={create ? "Log In?" : "Welcome Back!"}
                        checked={create}
                        onChange={(e)=>setCreate(e.target.checked)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    {create ? "CREATE ACCOUNT" : "LOG IN"} 
                </Button>
            </Form>
        </>
    )
}

export default AuthForm