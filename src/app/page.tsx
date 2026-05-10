import { Nav } from '@/components/nav';
import { HomeCard } from '@/components/home-card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <Nav />
      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-8">
        <HomeCard />
      </main>
    </div>
  );
}
