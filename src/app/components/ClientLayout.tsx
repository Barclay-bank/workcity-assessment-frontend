'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noSidebarPaths = ['/login', '/signup', '/'];
  const showSidebar = !noSidebarPaths.includes(pathname);

  return (
    <div className="flex min-h-screen">
      {showSidebar && <Sidebar />}
      <main className={`flex-1 overflow-auto transition-all duration-300 ${showSidebar ? '' : 'w-full'}`}>
        {children}
      </main>
    </div>
  );
}