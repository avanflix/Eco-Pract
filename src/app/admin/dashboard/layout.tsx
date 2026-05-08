import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/admin/app-sidebar';
import { DashboardHeader } from '@/components/admin/dashboard-header';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/jwt';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ecoforever - Admin Dashboard',
    description: 'Manage your application settings and data.',
};

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/admin');
    }

    const payload = verifyToken(token);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!payload || (payload as any).role !== 'admin') {
        redirect('/admin');
    }

    
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <DashboardHeader />
                <div className="p-4">{children}</div>
            </main>
        </SidebarProvider>
    );
}
