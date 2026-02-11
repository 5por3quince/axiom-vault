// src/components/Login.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, Activity, ChevronRight } from 'lucide-react';
import { MOCK_USERS } from '../config/schema';
import logoAxiom from '../assets/LogoAxiomVault.png';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    if (user) { onLogin(user); } else { setError(true); setTimeout(() => setError(false), 2000); }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#F5F5F7] dark:bg-black overflow-hidden font-sans">
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[420px] p-10 z-10">
        <div className="text-center mb-12">
          <div className="inline-flex mb-8">
            <img src={logoAxiom} alt="AXIOM VAULT" className="w-28 h-28 object-contain drop-shadow-2xl" />
          </div>
          
          {/* AXIOM sin cursiva, VAULT en azul */}
          <h1 className="text-4xl font-black tracking-tighter dark:text-white uppercase not-italic">
            AXIOM <span className="text-blue-600">VAULT</span>
          </h1>
          
          <div className="flex items-center justify-center gap-3 mt-3">
            <Activity size={14} className="text-blue-500 animate-pulse" />
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">GESTIÓN DE PLANES DE AUTOPROTECCIÓN (PAU Y PAIF)</p>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className={`glass p-3 rounded-[2rem] border transition-all ${error ? 'border-red-500' : 'border-white/60 dark:border-white/10'}`}>
            <div className="flex items-center px-5 py-3 border-b border-gray-100 dark:border-white/5">
              <User size={18} className="text-gray-400 mr-4" />
              <input type="text" placeholder="Identificador de Usuario" className="w-full bg-transparent border-none outline-none text-sm font-bold p-2 text-black dark:text-white" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="flex items-center px-5 py-3 relative">
              <Lock size={18} className="text-gray-400 mr-4" />
              <input type={showPass ? "text" : "password"} placeholder="Clave Táctica" className="w-full bg-transparent border-none outline-none text-sm font-bold p-2 text-black dark:text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-6 text-gray-400">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>
          </div>
          <button type="submit" className="w-full py-6 bg-blue-600 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-700 active:scale-[0.97] transition-all flex items-center justify-center gap-3">
            Validar Credenciales <ChevronRight size={16} />
          </button>
        </form>

        <div className="mt-16 text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-blue-600 transition-colors cursor-pointer">www.axiomdata.eu</p>
        </div>
      </motion.div>
    </div>
  );
};
export default Login;