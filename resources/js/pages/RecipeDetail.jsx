import { useState, useEffect } from 'react';                                                                                                                                                                       
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/button';
import Modal from '../components/Modal';

function RecipeDetail() {
    const [recept, setRecept] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);

    const { id } = useParams();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecept();
    }, [id]);

    const fetchRecept = async () => {
        try {
            const response = await fetch(`/api/recepti/${id}`);
            if (response.ok) {
                const data = await response.json();
                setRecept(data);
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Greška pri dohvatanju recepta:', error);
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await fetch(`/api/recepti/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            navigate('/');
        } catch (error) {
            console.error('Greška pri brisanju:', error);
        }
    };

    const handlePotvrda = async (status) => {
        try {
            const response = await fetch(`/api/recepti/${id}/potvrda`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                setRecept({ ...recept, status });
            }
        } catch (error) {
            console.error('Greška pri potvrdi:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Učitavanje...</div>;
    }

    if (!recept) {
        return <div className="text-center py-10">Recept nije pronađen.</div>;
    }

    const statusBoje = {
        'na_cekanju': 'bg-yellow-100 text-yellow-800',
        'odobren': 'bg-green-100 text-green-800',
        'odbijen': 'bg-red-100 text-red-800',
    };

    return (
        <div className="max-w-3xl mx-auto">
            <Button variant="secondary" onClick={() => navigate('/')}>
                ← Nazad
            </Button>

            <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold">{recept.naziv}</h1>
                    <span className={`px-3 py-1 rounded ${statusBoje[recept.status]}`}>
                        {recept.status}
                    </span>
                </div>

                {recept.kategorija && (
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded mb-4">
                        {recept.kategorija}
                    </span>
                )}

                <div className="prose max-w-none mb-6">
                    <h2 className="text-xl font-semibold mb-2">Opis</h2>
                    <p className="text-gray-700 whitespace-pre-line">{recept.opis}</p>
                </div>

                {recept.sastojci && recept.sastojci.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Sastojci</h2>
                        <ul className="list-disc list-inside">
                            {recept.sastojci.map(sastojak => (
                                <li key={sastojak.id} className="text-gray-700">
                                    {sastojak.ime} - {sastojak.kolicina}
                                    {!sastojak.dostupno && (
                                        <span className="text-red-500 ml-2">(nedostupno)</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex gap-3 mt-6">
                    {user && user.id === recept.korisnik_id && (
                        <Button variant="danger" onClick={() => setDeleteModal(true)}>
                            Obriši recept
                        </Button>
                    )}

                    {user && user.tip === 'profesionalac' && recept.status === 'na_cekanju' && (
                        <>
                            <Button variant="success" onClick={() => handlePotvrda('odobren')}>
                                Odobri
                            </Button>
                            <Button variant="danger" onClick={() => handlePotvrda('odbijen')}>
                                Odbij
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <Modal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                title="Potvrda brisanja"
                onConfirm={handleDelete}
                confirmText="Obriši"
            >
                <p>Da li ste sigurni da želite da obrišete ovaj recept?</p>
            </Modal>
        </div>
    );
}

export default RecipeDetail;