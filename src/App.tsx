import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Disc3, Film } from 'lucide-react';
import HomePage from './pages/HomePage';
import DiscLabelPage from './pages/DiscLabelPage';
import Header from './sections/Header';

function NavBar() {
  const location = useLocation();
  const isDisc = location.pathname === '/disc';

  return (
    <div className="w-full bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-1 px-4 py-1">
        <div className="flex items-center justify-center gap-1 flex-1">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              !isDisc ? 'bg-sky-50 text-sky-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            DVD封面
          </Link>
          <Link
            to="/disc"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              isDisc ? 'bg-sky-50 text-sky-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Disc3 className="w-3.5 h-3.5" />
            光盘标签
          </Link>
        </div>
        <Header />
      </div>
    </div>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
        <Route path="/disc" element={<AppLayout><DiscLabelPage /></AppLayout>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
