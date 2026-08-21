import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="film-grain min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
        <Outlet />
      </main>
    </div>
  );
}
