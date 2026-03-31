import { useEffect, useState } from 'react';
import { fetchATownie } from '../utilities';
import addie from '../assets/Addie_Icon.png';
import Form from 'react-bootstrap/Form';



export default function TownieDisplay() {
    const [townie, setTownie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [housed, setHoused] = useState(false);
    const [employed, setEmployed] = useState(false);

    useEffect(() => {
        const loadTownie = async () => {
            try {
                const data = await fetchATownie('Addie');
                setTownie(data);
            } catch (err) {
                setError('Could not load townie.');
            } finally {
                setLoading(false);
            }
        };

        loadTownie();
    }, []);

    if (loading) return <p>Loading townie...</p>;
    if (error) return <p>{error}</p>;
    if (!townie) return <p>Townie not found.</p>;

    const handleHousedChange = (e) => {
        setHoused(e.target.checked);
    };

    const handleEmployedChange = (e) => {
        setEmployed(e.target.checked);
    };

    return (
        <>
            <div className='shadow-lg shadow-black rounded-lg max-w-3/4 justify-items-center' id='townieDisplay'>
                <img src={addie} alt="tracker logo" className="w-24 h-24 justify-self-center" />
                <h2 className="text-shadow-lg">{townie.name} </h2>
                <p className="text-shadow-lg">Quest Type: {townie.quest_type}</p>
                <p className="text-shadow-lg">Quest: {townie.quest}</p>
                <p className="text-shadow-lg">Quest Amount: {townie.quest_amount}</p>
                <button className="bg-orange-500 text-white rounded-lg p-2 shadow-lg shadow-black">Mark Quest Complete</button>
                <Form onSubmit={handleHousedChange} className="">
                    <Form.Group className="justify-self-left">
                        <Form.Check
                            type="checkbox"
                            label='Is Housed?'
                            checked={housed}
                            onChange={handleHousedChange}
                        />
                    </Form.Group>
                </Form>
                <Form onSubmit={handleEmployedChange} className="">
                    <Form.Group className="justify-self-right">
                        <Form.Check
                            type="checkbox"
                            label='Is Employed?'
                            checked={employed}
                            onChange={handleEmployedChange}
                        />
                    </Form.Group>
                </Form>
            </div>
        </>
    )
}

// bg-[url('../assets/townArt.jpg')] bg-cover bg-center
 <Form.Group className="justify-self-left">
    <Form.Check
        type="checkbox"
        label='Is Housed?'
    />
</Form.Group>
// checked={create}
        // onChange={(e)=>setCreate(e.target.checked)}