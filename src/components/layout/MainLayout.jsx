import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <Sidebar />
      <div className="relative flex flex-col flex-1 overflow-x-hidden">
        <Navbar />
        <main className="w-full grow p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
