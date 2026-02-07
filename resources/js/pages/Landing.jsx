import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/button';
import { useAuth } from '../context/AuthContext';

function Landing() {

    const { user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        navigate('/recepti');
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 -mt-8 -mx-4 px-4">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-gray-800 mb-4">Recepts</h1>
                <p className="text-xl text-gray-600 mb-12">Pronađite, podelite i sačuvajte omiljene recepte</p>
                <div className="flex flex-col gap-4 max-w-xs mx-auto">
                    <Link to="/login">
                        <Button variant="primary">
                            Uloguj se
                        </Button>
                    </Link>

                    <Link to="/register">
                        <Button variant="secondary">
                            Registruj se
                        </Button>
                    </Link>

                    <Link to="/recepti">
                        <Button variant="success">
                            Nastavi kao gost
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Landing;