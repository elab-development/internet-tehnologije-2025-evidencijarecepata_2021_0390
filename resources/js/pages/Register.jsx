import { useState } from 'react';                                                                                                                                                                                  
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/button';

function Register() {
    const [ime, setIme] = useState('');
    const [email, setEmail] = useState('');
    const [lozinka, setLozinka] = useState('');
    const [tip, setTip] = useState('amater');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        const result = await register(ime, email, lozinka, tip);

        if (result.success) {
            navigate('/');
        } else {
            setErrors(result.errors || { general: 'Greška pri registraciji' });
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Registracija</h1>

                {errors.general && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Ime"
                        type="text"
                        name="ime"
                        value={ime}
                        onChange={(e) => setIme(e.target.value)}
                        placeholder="Vaše ime"
                        required
                        error={errors.ime?.[0]}
                    />

                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vas@email.com"
                        required
                        error={errors.email?.[0]}
                    />

                    <Input
                        label="Lozinka"
                        type="password"
                        name="lozinka"
                        value={lozinka}
                        onChange={(e) => setLozinka(e.target.value)}
                        placeholder="Najmanje 6 karaktera"
                        required
                        error={errors.lozinka?.[0]}
                    />

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            Tip korisnika
                        </label>
                        <select
                            value={tip}
                            onChange={(e) => setTip(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="amater">Amater</option>
                            <option value="profesionalac">Profesionalac</option>
                            <option value="dobavljac">Dobavljač</option>
                        </select>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                    >
                        {loading ? 'Registracija...' : 'Registruj se'}
                    </Button>
                </form>

                <p className="mt-4 text-center text-gray-600">
                    Već imate nalog?{' '}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Prijavite se
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;