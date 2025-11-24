
import React, { useState } from 'react';
import { User, Lock, ArrowRight, ArrowLeft, Mail } from 'lucide-react';
import { authService } from '../services/authService';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
  onNavigateRegister: () => void;
}

// Ícone simples do Google em SVG
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  
  // Estados para "Esqueci minha senha"
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = authService.login(email, password);
    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      setError(result.message);
    }
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    try {
      const result = await authService.loginWithGoogle();
      if (result.success) {
        onLoginSuccess(result.user);
      }
    } catch (e) {
      setError("Erro ao conectar com Google");
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetMessage('');

    if (!email) {
      setError('Por favor, digite seu e-mail para recuperar a senha.');
      return;
    }

    const result = authService.resetPassword(email);
    if (result.success) {
      setResetMessage(result.message);
    } else {
      setError(result.message);
    }
  };

  // Renderização da tela de "Esqueci minha senha"
  if (isForgotPassword) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-brand-gold">
          <button 
            onClick={() => { setIsForgotPassword(false); setError(''); setResetMessage(''); }}
            className="flex items-center text-gray-500 hover:text-brand-gold mb-4 text-sm transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para login
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recuperar Senha</h2>
            <p className="text-gray-500 text-sm mt-1">Informe seu e-mail cadastrado</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
              {error}
            </div>
          )}

          {resetMessage ? (
             <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 text-center">
               <p className="font-bold mb-1">E-mail enviado!</p>
               <p className="text-sm">{resetMessage}</p>
               <button 
                 onClick={() => setIsForgotPassword(false)}
                 className="mt-4 text-brand-gold font-bold hover:underline"
               >
                 Fazer Login
               </button>
             </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold sm:text-sm"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-gold hover:bg-brand-dark transition-colors shadow-md"
              >
                Enviar Link de Recuperação
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Renderização Padrão (Login)
  return (
    <div className="min-h-[600px] flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-brand-gold">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-brand-gold">Entrar</h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuário (E-mail)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-brand-gold focus:ring-brand-gold border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Lembrar-me
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-brand-gold hover:bg-brand-dark transition-colors shadow-sm"
          >
            Entrar
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loadingGoogle}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 bg-white text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            {loadingGoogle ? 'Carregando...' : (
              <>
                <GoogleIcon />
                Fazer Login com o Google
              </>
            )}
          </button>

          <div className="flex items-center justify-between pt-2">
             <button 
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-sm font-medium text-gray-600 hover:text-brand-gold underline"
              >
                Esqueci minha senha
              </button>

              <button 
                type="button"
                onClick={onNavigateRegister}
                className="text-sm font-medium text-gray-600 hover:text-brand-gold underline"
              >
                Cadastrar-se
              </button>
          </div>

        </form>
      </div>
    </div>
  );
};
