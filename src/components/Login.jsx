// src/components/Login.jsx
import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Eye, EyeOff, Activity } from 'lucide-react';
import { MOCK_USERS } from '../config/schema';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    
    if (user) {
      setError(false);
      onLogin(user);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#F5F5F7] dark:bg-black overflow-hidden">
      {/* Elementos decorativos de fondo (Estilo M4 GPU Test) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-600/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md p-8 z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-white dark:bg-white/5 rounded-[2rem] shadow-xl mb-6 border border-white/40">
            <ShieldCheck size={48} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter dark:text-white uppercase">
            AXIOM <span className="text-blue-600">VAULT</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Activity size={12} className="text-gray-400" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Acceso Restringido</p>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className={`glass p-2 rounded-3xl border transition-all ${error ? 'border-red-500 shake' : 'border-white/60'}`}>
            <div className="flex items-center px-4 py-2 border-b border-gray-100 dark:border-white/5">
              <User size={18} className="text-gray-400 mr-3" />
              <input 
                type="text" 
                placeholder="Identificador de Usuario"
                className="w-full bg-transparent border-none outline-none text-sm font-bold p-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex items-center px-4 py-2 relative">
              <Lock size={18} className="text-gray-400 mr-3" />
              <input 
                type={showPass ? "text" : "password"} 
                placeholder="Clave Táctica"
                className="w-full bg-transparent border-none outline-none text-sm font-bold p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/40 hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Validar Credenciales
          </button>
        </form>

        {error && (
          <p className="text-center mt-6 text-xs font-bold text-red-500 animate-bounce uppercase">
            Error de Acceso: Credenciales Inválidas
          </p>
        )}

        <p className="text-center mt-12 text-[9px] font-bold text-gray-400 uppercase tracking-widest opacity-50">
          Hardware: Apple M4 Chip Optimized • Axiom Security Protocol v9.6
        </p>
      </div>
    </div>
  );
};

export default Login;