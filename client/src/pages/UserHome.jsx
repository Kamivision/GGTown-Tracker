import { useOutletContext } from 'react-router-dom';
import logo from '../assets/GoGoTownTracker.png';

const UserHome = () => {
  const { user } = useOutletContext()
  return (
    <section className="UserHome mx-auto mt-8 w-full max-w-3xl rounded-2xl border border-amber-200/70 bg-white/70 p-6 shadow-lg shadow-amber-900/10">
      <img src={logo} alt="app logo" className="logo mx-auto" />
      <h2 className="text-2xl font-semibold">
        Welcome to the Go-Go Town Tracker App, {user}!
      </h2>
    </section>
  )
}

   <table className="table-auto border-blue-500 border-2 border-spacing-1" id='towniesTable'>
                <thead>
                    <tr>
                    <th className='border-orange-500 border-4'>Name</th>
                    <th className='border-orange-500 border-4'>Quest Type</th>
                    <th className='border-orange-500 border-4'>Quest</th>
                    <th className='border-orange-500 border-4'>Quest Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td className='border-blue-500 border-2'>Agent Nay-Nay</td>
                    <td className='border-blue-500 border-2'>Discover</td>
                    <td className='border-blue-500 border-2'>Evictor</td>
                    <td className='border-blue-500 border-2'>1</td>
                    </tr>
                    <tr>
                    <td className='border-blue-500 border-2'>Bob</td>
                    <td className='border-blue-500 border-2'>Other</td>
                    <td className='border-blue-500 border-2'>Happy Accidents</td>
                    <td className='border-blue-500 border-2'>25</td>
                    </tr>
                    <tr>
                    <td className='border-blue-500 border-2'>Yaboi</td>
                    <td className='border-blue-500 border-2'>Build</td>
                    <td className='border-blue-500 border-2'>Photobooth</td>
                    <td className='border-blue-500 border-2'>3</td>
                    </tr>
                </tbody>
            </table>
        

export default UserHome