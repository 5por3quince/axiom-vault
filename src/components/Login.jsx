// src/components/Login.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, ChevronRight } from 'lucide-react';
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
    if (user) { 
      onLogin(user); 
    } else { 
      setError(true); 
      setTimeout(() => setError(false), 2000); 
    }
  };

  return (
    <div style={{ 
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', 
      justifyContent: 'center', backgroundColor: '#000', overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Capa de fondo decorativa */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', backgroundColor: 'rgba(37, 99, 235, 0.1)', borderRadius: '50%', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', filter: 'blur(120px)' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          position: 'relative', zIndex: 10, width: '100%', maxWidth: '420px', 
          padding: '40px', backgroundColor: 'rgba(28, 28, 30, 0.8)', 
          backdropFilter: 'blur(40px)', borderRadius: '48px', 
          border: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* RESTRICCIÓN FÍSICA DEL LOGO - NO PUEDE DESBORDAR */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
          <img 
            src={logoAxiom} 
            alt="AXIOM" 
            style={{ width: '120px', height: '120px', objectFit: 'contain', borderRadius: '24px' }} 
          />
        </div>

        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '900', letterSpacing: '-0.05em', margin: '0', textTransform: 'uppercase' }}>
          AXIOM <span style={{ color: '#2563eb' }}>VAULT</span>
        </h1>
        <p style={{ color: '#8e8e93', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '8px' }}>
          Gestión de Planes de Autoprotección
        </p>

        <form onSubmit={handleAuth} style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '24px', 
            border: error ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s'
          }}>
            {/* Input Usuario */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <User size={18} color="#8e8e93" style={{ marginRight: '16px' }} />
              <input 
                type="text" placeholder="Usuario" 
                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', fontWeight: 'bold', width: '100%' }}
                value={username} onChange={(e) => setUsername(e.target.value)} required
              />
            </div>
            {/* Input Password */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', position: 'relative' }}>
              <Lock size={18} color="#8e8e93" style={{ marginRight: '16px' }} />
              <input 
                type={showPass ? "text" : "password"} placeholder="Clave Táctica" 
                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', fontWeight: 'bold', width: '100%' }}
                value={password} onChange={(e) => setPassword(e.target.value)} required
              />
              <button 
                type="button" onClick={() => setShowPass(!showPass)}
                style={{ background: 'none', border: 'none', color: '#8e8e93', cursor: 'pointer' }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            style={{ 
              backgroundColor: '#2563eb', color: 'white', padding: '20px', 
              borderRadius: '24px', border: 'none', fontWeight: '900', 
              fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em',
              cursor: 'pointer', boxShadow: '0 10px 20px rgba(37, 99, 235, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            Validar Credenciales <ChevronRight size={16} />
          </button>
        </form>

        <p style={{ marginTop: '40px', color: '#636366', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          www.axiomdata.eu
        </p>
      </motion.div>
    </div>
  );
};

export default Login;