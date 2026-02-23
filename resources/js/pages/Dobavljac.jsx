import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

function Dobavljac() {
    const [sastojci, setSastojci] = useState([]);
    const [loading, setLoading] = useState(true);

    const { user, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.tip !== 'dobavljac') {
            navigate('/recepti');
            return;
        }
        fetchSastojci();
    }, [user]);

    const fetchSastojci = async () => {
        try {
            const response = await fetch('/api/sastojci');
            const data = await response.json();
            setSastojci(data);
        } catch (error) {
            console.error('Greška pri dohvatanju sastojaka:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDostupno = async (id, trenutnoDostupno) => {
        try {
            const response = await fetch(`/api/sastojci/${id}/dostupno`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ dostupno: !trenutnoDostupno }),
            });

            if (response.ok) {
                setSastojci(sastojci.map(s =>
                    s.id === id ? { ...s, dostupno: !trenutnoDostupno } : s
                ));
            }
        } catch (error) {
            console.error('Greška pri promeni dostupnosti:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Učitavanje...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Upravljanje sastojcima</h1>

                {sastojci.length === 0 ? (
                    <p className="text-center text-gray-500">Nema sastojaka.</p>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Sastojak</th>
                                <th className="text-center py-2">Dostupno</th>
                                <th className="text-center py-2">Akcija</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sastojci.map(sastojak => (
                                <tr key={sastojak.id} className="border-b">
                                    <td className="py-3">{sastojak.ime}</td>
                                    <td className="py-3 text-center">
                                        {sastojak.dostupno ? (
                                            <span className="text-green-600">Da</span>
                                        ) : (
                                            <span className="text-red-600">Ne</span>
                                        )}
                                    </td>
                                    <td className="py-3 text-center">
                                        <Button
                                            variant={sastojak.dostupno ? 'danger' : 'success'}
                                            onClick={() => toggleDostupno(sastojak.id, sastojak.dostupno)}
                                        >
                                            {sastojak.dostupno ? 'Označi nedostupno' : 'Označi dostupno'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Dobavljac;