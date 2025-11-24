import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { StockTicker } from './components/StockTicker';
import { CalculatorPage } from './components/CalculatorPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { generateMarketNews, getFinancialTip } from './services/geminiService';
import { authService } from './services/authService';
import { financeService } from './services/financeService';
import { ArrowRight, TrendingUp, Briefcase, Calculator, Home, PieChart, ChevronLeft, ChevronRight } from 'lucide-react';
import { NewsArticle, MarketData } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dailyTip, setDailyTip] = useState("Carregando dica...");
  const [user, setUser] = useState<any>(null);
  
  // Market Data States
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [lowestPL, setLowestPL] = useState<MarketData[]>([]);
  const [topDividends, setTopDividends] = useState<MarketData[]>([]);

  useEffect(() => {
    // Check Auth
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Fetch Content
    const fetchAIContent = async () => {
      try {
        const [newsData, tip] = await Promise.all([
          generateMarketNews(),
          getFinancialTip()
        ]);
        
        if (newsData) setNews(newsData);
        if (tip) setDailyTip(tip);
      } catch (e) {
        console.error("Failed to load AI content", e);
      } finally {
        setLoading(false);
      }
    };

    // Fetch Market Data
    const fetchMarketData = async () => {
      const data = await financeService.getMarketData();
      setMarketData(data);

      // Process Rankings
      // 1. Lowest P/L (Positive only to avoid distressed companies)
      const sortedByPL = [...data]
        .filter(s => s.priceEarnings !== null && s.priceEarnings > 0)
        .sort((a, b) => (a.priceEarnings || 0) - (b.priceEarnings || 0))
        .slice(0, 5);
      setLowestPL(sortedByPL);

      // 2. Top Dividend Yield
      const sortedByDY = [...data]
        .filter(s => s.dividendYield !== null)
        .sort((a, b) => (b.dividendYield || 0) - (a.dividendYield || 0))
        .slice(0, 5);
      setTopDividends(sortedByDY);
    };

    fetchAIContent();
    fetchMarketData();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % news.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + news.length) % news.length);
  };

  const navigateTo = (page: string) => {
    // Auth Protection for Calculator
    if (page === 'calculator') {
      if (!user) {
        alert("Você precisa fazer login para acessar a calculadora.");
        setCurrentPage('login');
        return;
      }
      if (!user.isVerified) {
        alert("Acesso negado. Você precisa validar seu cadastro através do link enviado para seu e-mail antes de acessar a calculadora.");
        return;
      }
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleRegisterSuccess = () => {
    setCurrentPage('login');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCurrentPage('home');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateRegister={() => setCurrentPage('register')} />;
      case 'register':
        return <RegisterPage onRegisterSuccess={handleRegisterSuccess} onNavigateLogin={() => setCurrentPage('login')} />;
      case 'calculator':
        return <CalculatorPage />;
      case 'home':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Hero Section (Left - 8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Hero Carousel */}
              <div className="relative h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-lg group bg-gray-900">
                {loading ? (
                  <div className="w-full h-full animate-pulse flex items-center justify-center">
                    <span className="text-gray-400">Carregando notícias...</span>
                  </div>
                ) : news.length > 0 ? (
                  <>
                     <div className="relative h-full w-full">
                       <img 
                         src={news[currentSlide].imageUrl} 
                         alt={news[currentSlide].title}
                         className="w-full h-full object-cover transition-all duration-500 opacity-80"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-8">
                          <span className="text-white/90 uppercase tracking-widest text-xs font-bold mb-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-brand-gold rounded-full"></span>
                            {news[currentSlide].category || '_DESTAQUE'}
                          </span>
                          <h2 className="text-white text-3xl lg:text-4xl font-bold mb-3 leading-tight drop-shadow-md">
                            {news[currentSlide].title}
                          </h2>
                          <p className="text-gray-300 text-lg max-w-2xl drop-shadow-sm line-clamp-2">
                            {news[currentSlide].summary}
                          </p>
                          <div className="mt-6 flex items-center gap-2 text-brand-gold font-bold cursor-pointer hover:text-white transition w-max">
                            <span className="bg-white p-2 rounded-full group-hover:bg-brand-gold group-hover:text-white transition"><ArrowRight className="w-4 h-4" /></span>
                            <span className="text-white text-sm">Ler matéria completa</span>
                          </div>
                       </div>
                     </div>

                     <button 
                       onClick={prevSlide}
                       className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm transition-all z-10 opacity-0 group-hover:opacity-100"
                     >
                       <ChevronLeft className="w-6 h-6" />
                     </button>
                     <button 
                       onClick={nextSlide}
                       className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-sm transition-all z-10 opacity-0 group-hover:opacity-100"
                     >
                       <ChevronRight className="w-6 h-6" />
                     </button>

                     <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                        {news.map((_, idx) => (
                          <button 
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-brand-gold w-6' : 'bg-white/50 hover:bg-white'}`}
                          />
                        ))}
                     </div>
                  </>
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-white">
                     Não foi possível carregar as notícias.
                   </div>
                )}
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-brand-gold flex items-center gap-4">
                 <div className="bg-yellow-100 p-2 rounded-full">
                   <TrendingUp className="w-6 h-6 text-brand-gold" />
                 </div>
                 <div>
                   <h4 className="font-bold text-gray-900 text-sm uppercase">Dica do Dia (AI Powered)</h4>
                   <p className="text-gray-600 text-sm italic">"{dailyTip}"</p>
                 </div>
              </div>
            </div>

            {/* Sidebar (Right - 4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#0f2b1d] rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
                <div className="relative z-10">
                  <span className="text-xs font-semibold text-brand-gold tracking-wider">INVESTIMENTOS AUVP</span>
                  <h3 className="text-xl font-bold mt-2 mb-4 leading-snug">
                    Conte com a gestão de patrimônio da AUVP Capital.
                  </h3>
                  <button className="bg-brand-gold text-[#0f2b1d] px-4 py-2 rounded font-bold text-sm hover:bg-white transition">
                    Agende uma consulta
                  </button>
                </div>
                <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-4 translate-y-4">
                  <PieChart className="w-32 h-32 text-white" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                  <span className="w-1 h-6 bg-brand-gold rounded-full"></span>
                  <h3 className="font-bold text-gray-800 text-lg uppercase">_Rankings (Tempo Real)</h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Menores P/L */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3" title="Preço sobre Lucro">Top 5 - Menores P/L</h4>
                    <ul className="space-y-3">
                      {lowestPL.length > 0 ? lowestPL.map((stock, i) => (
                        <li key={i} className="flex items-center justify-between text-sm group cursor-pointer border-b border-gray-50 pb-1 last:border-0">
                           <div className="flex flex-col">
                             <span className="font-bold text-gray-900 group-hover:text-brand-gold transition">{stock.symbol}</span>
                             <span className="text-[10px] text-gray-400 truncate max-w-[70px]">{stock.shortName}</span>
                           </div>
                           <span className="font-mono text-gray-600">{stock.priceEarnings?.toFixed(2)}</span>
                        </li>
                      )) : <span className="text-xs text-gray-400">Carregando...</span>}
                    </ul>
                  </div>

                  {/* Dividend Yield */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Top 5 - Dividend Yield</h4>
                    <ul className="space-y-3">
                      {topDividends.length > 0 ? topDividends.map((stock, i) => (
                        <li key={i} className="flex items-center justify-between text-sm group cursor-pointer border-b border-gray-50 pb-1 last:border-0">
                           <div className="flex flex-col">
                             <span className="font-bold text-gray-900 group-hover:text-brand-gold transition">{stock.symbol}</span>
                             <span className="text-[10px] text-gray-400 truncate max-w-[70px]">{stock.shortName}</span>
                           </div>
                           <span className="font-mono text-green-600 font-semibold">{stock.dividendYield?.toFixed(2)}%</span>
                        </li>
                      )) : <span className="text-xs text-gray-400">Carregando...</span>}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <span className="text-[10px] text-gray-400">DADOS POR: BRAPI.DEV</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
      <Header onNavigate={navigateTo} user={user} onLogout={handleLogout} />
      
      {/* Ticker Dinâmico */}
      <StockTicker data={marketData} />

      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Bottom Gold Bar */}
      <div className="bg-brand-gold text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('calculator'); }} className="flex items-center justify-center gap-3 hover:bg-brand-dark p-4 rounded transition">
                <Calculator className="w-8 h-8 text-white/80" />
                <span className="text-sm font-bold text-left">CALCULADORAS E<br/>SIMULADORES</span>
              </a>
              <a href="#" className="flex items-center justify-center gap-3 hover:bg-brand-dark p-4 rounded transition">
                <Home className="w-8 h-8 text-white/80" />
                <span className="text-sm font-bold text-left">ALUGAR OU<br/>FINANCIAR</span>
              </a>
               <a href="#" className="flex items-center justify-center gap-3 hover:bg-brand-dark p-4 rounded transition">
                <Briefcase className="w-8 h-8 text-white/80" />
                <span className="text-sm font-bold text-left">RESERVAS DE<br/>EMERGÊNCIA</span>
              </a>
               <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('calculator'); }} className="flex items-center justify-center gap-3 hover:bg-brand-dark p-4 rounded transition">
                <TrendingUp className="w-8 h-8 text-white/80" />
                <span className="text-sm font-bold text-left">JUROS<br/>COMPOSTOS</span>
              </a>
            </div>
        </div>
      </div>
    </div>
  );
}