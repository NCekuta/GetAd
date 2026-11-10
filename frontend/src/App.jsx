import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import RequireRole from './components/RequireRole.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import QuestForm from './pages/QuestForm.jsx';
import MyQuests from './pages/MyQuests.jsx';
import AdminQuests from './pages/AdminQuests.jsx';
import NotFound from './pages/NotFound.jsx';

// Seznam vseh strani aplikacije
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prijava" element={<Login />} />
          <Route path="/registracija" element={<Register />} />

          {/* Strani za podjetje */}
          <Route path="/moji-questi" element={<RequireRole roles={['company']}><MyQuests /></RequireRole>} />
          <Route path="/questi/nov" element={<RequireRole roles={['company']}><QuestForm /></RequireRole>} />
          <Route path="/questi/:id/uredi" element={<RequireRole roles={['company']}><QuestForm /></RequireRole>} />

          {/* Strani za administratorja */}
          <Route path="/admin/questi" element={<RequireRole roles={['admin']}><AdminQuests /></RequireRole>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
