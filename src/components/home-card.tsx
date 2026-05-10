import { HomeLeft } from './home-left';
import { HomeRight } from './home-right';

export function HomeCard() {
  return (
    <div className="w-full max-w-6xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-[36%_64%] shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
      <HomeLeft />
      <HomeRight />
    </div>
  );
}
