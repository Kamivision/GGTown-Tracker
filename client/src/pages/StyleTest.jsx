import { useEffect, useState } from 'react';
import { fetchTownies } from '../utilities';



export default function StyleTest() {
      const [townies, setTownies] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');

      useEffect(() => {
        const loadTownies = async () => {
          try {
            const data = await fetchTownies();
            setTownies(Array.isArray(data) ? data : []);
          } catch (err) {
            setError('Could not load townies.');
          } finally {
            setLoading(false);
          }
        };

        loadTownies();
      }, []);

      if (loading) return <p>Loading townies...</p>;
      if (error) return <p>{error}</p>;

      return (
        <>
            <h1>Your Townies:</h1>
            <div className='shadow-lg shadow-black rounded-lg p-9 bg-sky-400 m-8'>
                <table className="table-auto border-orange-500 border-spacing-1 shadow-lg shadow-black" id="towniesTable">
                    <thead className="text-taupe-200 text-shadow-lg text-shadow-black text-2xl bg-orange-500">
                    <tr>
                        <th className="border-orange-500 border-4">Name</th>
                        <th className="border-orange-500 border-4">Quest Type</th>
                        <th className="border-orange-500 border-4">Quest</th>
                        <th className="border-orange-500 border-4">Quest Amount</th>
                    </tr>
                    </thead>
                    <tbody className= "bg-white" >
                    {townies.length === 0 ? (
                        <tr>
                        <td className="border-blue-500 border-2" colSpan="4">No townies found.</td>
                        </tr>
                    ) : (
                        townies.map((townie, index) => (
                        <tr key={townie.name + '-' + index}>
                            <td className="border-2">{townie.name}</td>
                            <td className="border-2">{townie.quest_type}</td>
                            <td className="border-2">{townie.quest}</td>
                            <td className="border-2">{townie.quest_amount}</td>
                        </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </>
      );
    }
