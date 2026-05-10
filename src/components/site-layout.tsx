import { Nav } from './nav';
import { Footer } from './footer';

interface Props {
  children: React.ReactNode;
}

export function SiteLayout({ children }: Props) {
  return (
    <div className="bg-[#0a0a0a] min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 pt-14">{children}</main>
      <Footer />
    </div>
  );
}
