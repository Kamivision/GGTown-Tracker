import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Stack from 'react-bootstrap/Stack';
// import TaskDisplay from "../components/TaskDisplay";
import AuthForm from "../components/AuthForm";

const HomePage = () => {
    const {setUser} = useOutletContext()

    return (
        <>
            <h1>Authentication Page</h1>
            <AuthForm setUser={setUser} />
        </>
    )
}

export default HomePage