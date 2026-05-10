import { HomeLeft } from './home-left';
import { HomeRight } from './home-right';

export function HomeCard() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[42%_58%]">
      <HomeLeft />
      <HomeRight />
    </div>
  );
}
