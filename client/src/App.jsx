import { api } from './utilities';
import { useEffect, useState } from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import NavBar from './components/NavBar';

export default function App() {
  const [user, setUser] = useState(useLoaderData());

  useEffect(() => {
    console.log(user);
  }, [user]);

  // useEffect(() => {
  //   const testConnection = async () => {
  //     try {
  //       const response = await api.get('test/');
  //       console.log(response);
  //     } catch (error) {
  //       console.error('API test connection failed:', error);
  //     }
  //   };

  //   testConnection();
  // }, []);

  return (
    <>
      <NavBar />
      <Outlet context={{ user, setUser }} />
    </>
  );
}

