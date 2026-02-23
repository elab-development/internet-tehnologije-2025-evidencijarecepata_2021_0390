import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Modal from './Modal';                                                                                                                                                              import { useAuth } from '../context/AuthContext';
import Button from './Button';

function Navbar() {
    const [logoutModal, setLogoutModal] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        setLogoutModal(false);
        navigate('/login');
    ;}

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <span className="text-2xl font-bold">
                        Recepts
                    </span>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span>Zdravo, {user.ime}!</span>
                                {user.tip !== 'dobavljac' && (
                                    <Link to="/dodaj-recept">
                                        <Button variant="success">Dodaj recept</Button>
                                    </Link>
                                )}
                                {user.tip === 'dobavljac' && (
                                    <Link to="/dobavljac">
                                        <Button variant="success">Upravljaj sastojcima</Button>
                                    </Link>
                                )}
                                <Button variant="secondary" onClick={() => setLogoutModal(true)}>
                                    Odjavi se
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="secondary">Prijava</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary">Registracija</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={logoutModal}
                onClose={() => setLogoutModal(false)}
                title="Odjava"
                onConfirm={handleLogout}
                confirmText="Odjavi se"
            >
                <p>Da li ste sigurni da želite da se odjavite?</p>
            </Modal>

        </nav>
    );
}

export default Navbar;