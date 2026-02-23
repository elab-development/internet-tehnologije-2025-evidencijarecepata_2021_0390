import { useState } from 'react';                                                                                                                                                                                 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

function AddRecipe() {
    const [naziv, setNaziv] = useState('');
    const [opis, setOpis] = useState('');
    const [kategorija, setKategorija] = useState('');
    const [sastojci, setSastojci] = useState([{ ime: '', kolicina: '' }]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { user, token } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/login');
        return null;
    }

    if (user.tip === 'dobavljac') {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">Dobavljači ne mogu dodavati recepte.</p>
            </div>
        );
    }

    const handleAddSastojak = () => {
        setSastojci([...sastojci, { ime: '', kolicina: '' }]);
    };

    const handleRemoveSastojak = (index) => {
        if (sastojci.length > 1) {
            setSastojci(sastojci.filter((_, i) => i !== index));
        }
    };

    const handleSastojakChange = (index, field, value) => {
        const newSastojci = [...sastojci];
        newSastojci[index][field] = value;
        setSastojci(newSastojci);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Kreiraj recept
            const response = await fetch('/api/recepti', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ naziv, opis, kategorija }),
            });

            const data = await response.json();

            if (response.ok) {
                // Dodaj sastojke
                for (const sastojak of sastojci) {
                    if (sastojak.ime && sastojak.kolicina) {
                        await fetch('/api/sastojci', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify({
                                ime: sastojak.ime,
                                kolicina: sastojak.kolicina,
                                recept_id: data.id,
                            }),
                        });
                    }
                }
                navigate('/recepti');
            } else {
                setError(data.message || 'Greška pri dodavanju recepta');
            }
        } catch (error) {
            setError('Greška pri povezivanju sa serverom');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Dodaj novi recept</h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Naziv recepta"
                        type="text"
                        name="naziv"
                        value={naziv}
                        onChange={(e) => setNaziv(e.target.value)}
                        placeholder="Unesite naziv recepta"
                        required
                    />

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Opis recepta
                        </label>
                        <textarea
                            name="opis"
                            value={opis}
                            onChange={(e) => setOpis(e.target.value)}
                            placeholder="Unesite detaljan opis recepta i način pripreme..."
                            required
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <Input
                        label="Kategorija"
                        type="text"
                        name="kategorija"
                        value={kategorija}
                        onChange={(e) => setKategorija(e.target.value)}
                        placeholder="npr. Glavno jelo, Dezert, Salata..."
                    />

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Sastojci
                        </label>
                        {sastojci.map((sastojak, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={sastojak.ime}
                                    onChange={(e) => handleSastojakChange(index, 'ime', e.target.value)}
                                    placeholder="Naziv sastojka"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    value={sastojak.kolicina}
                                    onChange={(e) => handleSastojakChange(index, 'kolicina', e.target.value)}
                                    placeholder="Količina"
                                    className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSastojak(index)}
                                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddSastojak}
                            className="mt-2 text-blue-500 hover:underline"
                        >
                            + Dodaj sastojak
                        </button>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Dodavanje...' : 'Dodaj recept'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => navigate('/recepti')}>
                            Otkaži
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddRecipe;