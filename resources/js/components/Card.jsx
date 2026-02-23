import { Link } from 'react-router-dom';
import Button from './Button';

function Card({ id, naziv, opis, kategorija, status }) {
    const statusBoje = {
        'na_cekanju': 'bg-yellow-100 text-yellow-800',
        'odobren': 'bg-green-100 text-green-800',
        'odbijen': 'bg-red-100 text-red-800',
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{naziv}</h3>
                    <span className={`px-2 py-1 rounded text-sm ${statusBoje[status] || 'bg-gray-100'}`}>
                        {status}
                    </span>
                </div>

                {kategorija && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                        {kategorija}
                    </span>
                )}

                <p className="text-gray-600 mb-4 line-clamp-2">
                    {opis}
                </p>

                <Link to={`/recepti/${id}`}>
                    <Button variant="primary">Pogledaj recept</Button>
                </Link>
            </div>
        </div>
    );
}

export default Card;