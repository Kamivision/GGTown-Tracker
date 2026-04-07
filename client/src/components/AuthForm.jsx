import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { handleUserAuth } from '../utilities';

export default function AuthForm ({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [create, setCreate] = useState(true)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userDict = {
      email,
      password
    }
    try {
      const user = await handleUserAuth(userDict, create);
      setUser(user);

      if (user) {
        setCreate(true);
        setEmail('');
        setPassword('');
        navigate('/townies');
      } else {
        alert('Login/signup failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Authentication failed. Check your credentials and try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
      <h2 className="mb-1 text-center text-2xl font-semibold">
        {create ? "Create an Account" : "Log In"} to View Your Townies!!
      </h2>

      <p className="text-sm text-slate-700">
        WARNING: at this time the dashboard contains spoilers for hidden townies.
        Check back for updates to prevent this soon.
      </p>

      <div className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cyan-500"
        />
        <p className="text-xs text-slate-500">
          We'll never share your email with anyone else.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-cyan-500"
        />
      </div>

      <label className="switch flex items-center justify-center gap-2">
        <input
          type="checkbox"
          checked={create}
          onChange={(e) => setCreate(e.target.checked)}
          className="h-4 w-4 accent-cyan-600"
        />
        <span className="text-sm font-medium">
          {create ? "Log In?" : "Welcome Back!"}
        </span>
      </label>

      <button
        type="submit"
        className="rounded-full bg-gradient-to-br from-white to-cyan-300 px-4 py-3 font-semibold text-black transition hover:brightness-105"
      >
        {create ? "CREATE ACCOUNT" : "LOG IN"}
      </button>
    </form>
  )
}

// export default AuthForm