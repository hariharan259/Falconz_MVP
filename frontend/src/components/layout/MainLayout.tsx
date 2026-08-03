import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function MainLayout() {
  return (
    <div className="flex min-h-screen bg-falcon-dark text-falcon-text">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col relative">
        {/* Ambient background glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-falcon-blue/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <Topbar />
        <main className="flex-1 p-8 z-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
