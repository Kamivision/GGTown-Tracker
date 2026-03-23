import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
// import TaskDisplay from "../components/TaskDisplay";
import AuthForm from "../components/AuthForm";

const HomePage = () => {
    const {setUser} = useOutletContext()

    return (
        <>
            <Card className="UserForm">
                <Card.Body><h2>Sign In or Create an Account to Save Your Progress!!</h2>
                <AuthForm setUser={setUser} /></Card.Body>
            </Card>
        </>
    )
}

export default HomePage