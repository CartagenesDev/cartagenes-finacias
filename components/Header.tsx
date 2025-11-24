
import React from 'react';
import { Search, Menu, User, Calculator, UserPlus, LogOut, TrendingUp } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  user: { name: string } | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, user, onLogout }) => {
  return (
    <header className="bg-brand-gold text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo Section - Modernized */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="bg-white p-1.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300">
            <TrendingUp className="w-6 h-6 text-brand-gold" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-xl tracking-tight text-white drop-shadow-sm">Cartagenes</span>
            <span className="text-[10px] text-white/90 uppercase tracking-widest font-semibold">Finanças</span>
          </div>
        </div>

        {/* Search Bar - Hidden on small mobile */}
        <div className="hidden md:flex flex-1 max-w-xl relative mx-4">
          <input 
            type="text" 
            placeholder="pesquise notícias, recomendações e..." 
            className="w-full py-2 px-4 pr-10 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner bg-white/90"
          />
          <Search className="absolute right-3 top-2.5 text-gray-500 w-5 h-5" />
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <button onClick={() => onNavigate('home')} className="hover:text-white/80 transition text-shadow-sm">Notícias</button>
          <button onClick={() => onNavigate('calculator')} className="hover:text-white/80 transition flex items-center gap-1 text-shadow-sm">
            <Calculator className="w-4 h-4" /> Calculadoras
          </button>
        </nav>

        {/* CTA Actions */}
        <div className="flex items-center gap-3">
          
          {user ? (
            <>
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs text-white/80">Olá,</span>
                <span className="text-sm font-bold leading-none">{user.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="flex items-center gap-1 text-sm font-semibold hover:bg-white/20 transition px-3 py-1.5 rounded-full border border-white/30"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </>
          ) : (
            <>
              {/* Added Cadastrar Button */}
              <button 
                onClick={() => onNavigate('register')}
                className="hidden sm:flex items-center gap-1 text-sm font-semibold hover:bg-white/20 transition px-4 py-1.5 rounded-full"
              >
                 <UserPlus className="w-4 h-4" />
                 Cadastrar
              </button>

              <button 
                onClick={() => onNavigate('login')}
                className="flex items-center gap-1 text-sm font-semibold bg-white text-brand-gold hover:bg-gray-100 transition px-4 py-1.5 rounded-full shadow-sm"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Entrar</span>
              </button>
            </>
          )}
          
           <button className="sm:hidden p-2">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
