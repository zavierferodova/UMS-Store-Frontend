import { PanelHeader, PanelHeaderProvider } from '@/components/panel/Header';
import { PanelSidebar } from '@/components/panel/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <PanelSidebar />
      <main className="w-full p-6">
        <PanelHeaderProvider>
          <PanelHeader />
          {children}
        </PanelHeaderProvider>
      </main>
    </SidebarProvider>
  );
}
