import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                localStorage.removeItem('token');
                setToken(null);
            }
        } catch (error) {
            console.error('Greška pri dohvatanju korisnika:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, lozinka) => {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ email, lozinka }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.korisnik);
            return { success: true };
        } else {
            return { success: false, error: data.message };
        }
    };

    const register = async (ime, email, lozinka, tip) => {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ ime, email, lozinka, tip }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.korisnik);
            return { success: true };
        } else {
            return { success: false, errors: data.errors };
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });
        } catch (error) {
            console.error('Greška pri odjavi:', error);
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  }