import './bootstrap';   
import '../css/app.css';                                                                                                                                                                                           import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe';
import Landing from './pages/Landing';
import Dobavljac from './pages/Dobavljac';

// Components
import Navbar from './components/Navbar';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/recepti" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dodaj-recept" element={<AddRecipe />} />
                        <Route path="/recepti/:id" element={<RecipeDetail />} />
                        <Route path="/dobavljac" element={<Dobavljac />} />
                    </Routes>
                </main>
            </BrowserRouter>
        </AuthProvider>
    );
}

createRoot(document.getElementById('app')).render(<App />);