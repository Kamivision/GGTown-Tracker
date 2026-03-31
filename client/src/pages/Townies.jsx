import {Link, useOutletContext} from 'react-router-dom';


export default function Townies() {
    return (
        <>
            <h1>Your Townies:</h1>
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
        </>
    )
}