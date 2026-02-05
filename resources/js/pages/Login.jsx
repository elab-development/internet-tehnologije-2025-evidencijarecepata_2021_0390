import { useState } from 'react';                                                                                                                                                                                  import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/button';

function Login() {
    const [email, setEmail] = useState('');
    const [lozinka, setLozinka] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, lozinka);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Pogrešan email ili lozinka');
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Prijava</h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vas@email.com"
                        required
                    />

                    <Input
                        label="Lozinka"
                        type="password"
                        name="lozinka"
                        value={lozinka}
                        onChange={(e) => setLozinka(e.target.value)}
                        placeholder="Unesite lozinku"
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? 'Prijava...' : 'Prijavi se'}
                    </Button>
                </form>

                <p className="mt-4 text-center text-gray-600">
                    Nemate nalog?{' '}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Registrujte se
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;