import {Link, useOutletContext} from 'react-router-dom';
import logo from '../assets/GoGoTownTracker.png';


export default function Townies() {
    const { user } = useOutletContext()
    
    return (
        <>
            <section className="UserHome mx-auto mt-8 w-full max-w-3xl rounded-2xl border border-amber-200/70 bg-white/70 p-6 shadow-lg shadow-amber-900/10">
                <img src={logo} alt="app logo" className="logo mx-auto" />
                <h2 className="text-2xl font-semibold">
                    Welcome to the Go-Go Town Tracker App, {user}!
                </h2>
            </section>
            <h1>Your Townies:</h1>
        </> 
    )
}