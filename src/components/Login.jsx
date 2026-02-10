// src/components/Login.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, ShieldCheck, Eye, EyeOff, Activity, ChevronRight } from 'lucide-react';
import { MOCK_USERS } from '../config/schema';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    setIsAuthenticating(true);

    // Simulación de latencia de procesado seguro M4
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.username === username && u.password === password);
      
      if (user) {
        setError(false);
        onLogin(user);
      } else {
        setError(true);
        setIsAuthenticating(false);
        // El error se limpia automáticamente después de la animación de shake
        setTimeout(() => setError(false), 2000);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#F5F5F7] dark:bg-black overflow-hidden font-sans">
      {/* Elementos decorativos de fondo (Hardware Accelerated para M4) */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[420px] p-10 z-10"
      >
        <div className="text-center mb-12">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex p-5 bg-white dark:bg-white/5 rounded-[2.5rem] shadow-2xl mb-8 border border-white/40 dark:border-white/10 backdrop-blur-xl"
          >
            <ShieldCheck size={56} className="text-blue-600" />
          </motion.div>
          
          <h1 className="text-4xl font-black tracking-tighter dark:text-white uppercase italic">
            AXIOM <span className="text-blue-600 not-italic">VAULT</span>
          </h1>
          
          <div className="flex items-center justify-center gap-3 mt-3">
            <Activity size={14} className="text-blue-500 animate-pulse" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Estación de Mando de Custodia</p>
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <motion.div 
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            className={`glass p-3 rounded-[2rem] border transition-all duration-300 ${
              error ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-white/60 dark:border-white/10'
            }`}
          >
            {/* Campo Usuario */}
            <div className="flex items-center px-5 py-3 border-b border-gray-100 dark:border-white/5 group">
              <User size={18} className="text-gray-400 group-focus-within:text-blue-600 transition-colors mr-4" />
              <input 
                type="text" 
                placeholder="Identificador de Usuario"
                className="w-full bg-transparent border-none outline-none text-sm font-bold p-2 text-black dark:text-white placeholder:text-gray-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Campo Password */}
            <div className="flex items-center px-5 py-3 relative group">
              <Lock size={18} className="text-gray-400 group-focus-within:text-blue-600 transition-colors mr-4" />
              <input 
                type={showPass ? "text" : "password"} 
                placeholder="Clave Táctica"
                className="w-full bg-transparent border-none outline-none text-sm font-bold p-2 text-black dark:text-white placeholder:text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)}
                className="absolute right-6 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>

          <button 
            type="submit"
            disabled={isAuthenticating}
            className="w-full py-6 bg-blue-600 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/40 hover:bg-blue-700 active:scale-[0.97] transition-all flex items-center justify-center gap-3 group"
          >
            {isAuthenticating ? (
              <Activity className="animate-spin" size={18} />
            ) : (
              <>
                Validar Credenciales
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl"
            >
              <p className="text-center text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center justify-center gap-2">
                <Lock size={12} /> Acceso Denegado: Credenciales Inválidas
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-16 text-center space-y-4">
          <div className="flex justify-center items-center gap-4 opacity-30">
             <div className="h-[1px] w-12 bg-gray-400" />
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
               Axiom Security Protocol v9.6
             </p>
             <div className="h-[1px] w-12 bg-gray-400" />
          </div>
          
          <div className="flex justify-center items-center gap-2">
            <span className="text-[8px] font-black text-gray-400 uppercase bg-gray-200 dark:bg-white/5 px-3 py-1 rounded-full">
              Hardware: Apple M4 Chip Optimized
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;