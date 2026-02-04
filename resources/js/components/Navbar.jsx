import { Link, useNavigate } from 'react-router-dom';                                                                                                                                                              import { useAuth } from '../context/AuthContext';
import Button from './button';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link to="/" className="text-2xl font-bold">
                        Recepti
                    </Link>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span>Zdravo, {user.ime}!</span>
                                <Button variant="secondary" onClick={handleLogout}>
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
        </nav>
    );
}

export default Navbar;