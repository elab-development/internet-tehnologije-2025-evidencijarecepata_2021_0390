import { useState, useEffect } from 'react';                                                                                                                                                                       
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/button';
import Input from '../components/Input';
import Modal from '../components/Modal';

function Home() {
    const [recepti, setRecepti] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('svi');
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

    const { user, token } = useAuth();

    useEffect(() => {
        fetchRecepti();
    }, []);

    const fetchRecepti = async () => {
        try {
            const response = await fetch('/api/recepti');
            const data = await response.json();
            setRecepti(data);
        } catch (error) {
            console.error('Greška pri dohvatanju recepata:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await fetch(`/api/recepti/${deleteModal.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
            setRecepti(recepti.filter(r => r.id !== deleteModal.id));
            setDeleteModal({ open: false, id: null });
        } catch (error) {
            console.error('Greška pri brisanju:', error);
        }
    };

    const handlePotvrda = async (id, status) => {
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
                setRecepti(recepti.map(r =>
                    r.id === id ? { ...r, status } : r
                ));
            }
        } catch (error) {
            console.error('Greška pri potvrdi:', error);
        }
    };

    const filteredRecepti = recepti.filter(recept => {
        const matchesSearch = recept.naziv.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'svi' || recept.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <div className="text-center py-10">Učitavanje...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Recepti</h1>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder="Pretraži recepte..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="svi">Svi statusi</option>
                    <option value="na_cekanju">Na čekanju</option>
                    <option value="odobren">Odobreni</option>
                    <option value="odbijen">Odbijeni</option>
                </select>
            </div>

            {filteredRecepti.length === 0 ? (
                <p className="text-center text-gray-500 py-10">Nema recepata za prikaz.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecepti.map(recept => (
                        <div key={recept.id}>
                            <Card
                                id={recept.id}
                                naziv={recept.naziv}
                                opis={recept.opis}
                                kategorija={recept.kategorija}
                                status={recept.status}
                            />

                            {user && user.id === recept.korisnik_id && (
                                <div className="mt-2">
                                    <Button
                                        variant="danger"
                                        onClick={() => setDeleteModal({ open: true, id: recept.id })}
                                    >
                                        Obriši
                                    </Button>
                                </div>
                            )}

                            {user && user.tip === 'profesionalac' && recept.status === 'na_cekanju' && (
                                <div className="mt-2 flex gap-2">
                                    <Button
                                        variant="success"
                                        onClick={() => handlePotvrda(recept.id, 'odobren')}
                                    >
                                        Odobri
                                    </Button>
                                    <Button
                                        variant="danger"
                                        onClick={() => handlePotvrda(recept.id, 'odbijen')}
                                    >
                                        Odbij
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: null })}
                title="Potvrda brisanja"
                onConfirm={handleDelete}
                confirmText="Obriši"
            >
                <p>Da li ste sigurni da želite da obrišete ovaj recept?</p>
            </Modal>
        </div>
    );
}

export default Home;