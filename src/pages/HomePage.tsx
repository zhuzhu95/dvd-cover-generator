import Header from '@/sections/Header';
import HeroSection from '@/sections/HeroSection';
import SearchBar from '@/sections/SearchBar';
import ColorPanel from '@/sections/ColorPanel';
import LayoutPanel from '@/sections/LayoutPanel';
import CoverPreview from '@/sections/CoverPreview';
import ActionButtons from '@/sections/ActionButtons';
import EditorPanel from '@/sections/EditorPanel';
import Footer from '@/sections/Footer';

export default function HomePage() {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: '#f5f0e8',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }}
    >
      <Header />
      <HeroSection />

      <main className="max-w-5xl mx-auto px-4 pb-8 space-y-6">
        <SearchBar />
        <ColorPanel />
        <LayoutPanel />
        <CoverPreview />
        <ActionButtons />
        <EditorPanel />
      </main>

      <Footer />
    </div>
  );
}
