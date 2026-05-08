"use client";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
 
 
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Order, Address, UserProfile, OrderCard, AddressCard, ProfileForm } from "@/components/profile/ProfileComponents";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Package, User, MapPin, LayoutDashboard, LogOut, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useProfileStore } from "@/store/useProfileStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("overview");
     
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { orders, addresses, fetchAddresses, fetchOrders, addAddress, updateAddress, removeAddress } = useProfileStore();
    const { user, isAuthenticated, isLoading: authLoading, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        if (isAuthenticated) {
            fetchAddresses();
            fetchOrders();
        }
    }, [isAuthenticated, fetchAddresses, fetchOrders]);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, authLoading, router]);

    if (!mounted || authLoading) return <div className="min-h-screen bg-white flex justify-center items-center"><div className="animate-pulse">Loading profile...</div></div>;
    if (!isAuthenticated) return null; // Prevent rendering anything while redirecting

    // Realtime data fetched from Auth Store
    const userProfile = {
        firstName: user?.name?.split(' ')[0] || "",
        lastName: user?.name?.split(' ').slice(1).join(' ') || "",
        email: user?.email || "",
        phone: user?.phone || "",
    };

    const handleDeleteAddress = async (id: string) => {
        if (confirm("Are you sure you want to delete this address?")) {
            await removeAddress(id);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Recent Orders Horizontal Scroll */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Recent Orders</h2>
                                <Button variant="link" onClick={() => setActiveTab("orders")} className="text-primary">
                                    View All <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                                {orders.length === 0 ? (
                                    <p className="text-muted-foreground text-sm italic">No recent orders found.</p>
                                ) : (
                                    orders.slice(0, 3).map((order: Order) => (
                                        <OrderCard key={order.id} order={order} compact />
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Saved Addresses Horizontal Scroll */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Saved Addresses</h2>
                                <Button variant="link" onClick={() => setActiveTab("addresses")} className="text-primary">
                                    View All <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                                {addresses.length === 0 ? (
                                    <p className="text-muted-foreground text-sm italic">No addresses saved yet.</p>
                                ) : (
                                    addresses.map((addr: Address) => (
                                        <AddressCard key={addr.id} address={addr} compact />
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                );
            case "profile":
                return (
                    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-semibold mb-4">My Profile</h2>
                        <ProfileForm defaultValues={userProfile} />
                    </div>
                );
            case "orders":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-semibold mb-4">My Orders</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                            {orders.length === 0 ? (
                                <p className="text-muted-foreground text-sm italic col-span-full">You haven&apos;t placed any orders yet.</p>
                            ) : (
                                orders.map((order: Order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))
                            )}
                        </div>
                    </div>
                );
            case "addresses":
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">My Addresses</h2>
                            <Link href="/profile/address/new">
                                <Button>
                                    <PlusIcon className="w-4 h-4 mr-2" /> Add New Address
                                </Button>
                            </Link>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {addresses.length === 0 ? (
                                <p className="text-muted-foreground text-sm italic col-span-full">You don&apos;t have any addresses saved.</p>
                            ) : (
                                addresses.map((addr: Address) => (
                                    <AddressCard
                                        key={addr._id || addr.id}
                                        address={addr}
                                        onEdit={() => router.push(`/profile/address/${addr._id || addr.id}`)}
                                        onDelete={() => handleDeleteAddress((addr._id || addr.id) as string)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white py-10">
            <div className="container mx-auto py-6 px-4 md:px-6 border-2 border-gray-200 shadow-3xl rounded-xl">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Navigation */}
                    <aside className="w-full md:w-64 shrink-0 border-r border-gray-200 min-h-[calc(100vh-8rem)]">
                        <div className="sticky top-24 pr-6">
                            <h1 className="text-2xl font-heading font-bold text-headings mb-6">My Account</h1>

                            <nav className="space-y-0">
                                <NavItem
                                    active={activeTab === "overview"}
                                    onClick={() => setActiveTab("overview")}
                                    icon={<LayoutDashboard className="w-4 h-4 mr-3" />}
                                    label="Overview"
                                />
                                <NavItem
                                    active={activeTab === "profile"}
                                    onClick={() => setActiveTab("profile")}
                                    icon={<User className="w-4 h-4 mr-3" />}
                                    label="My Profile"
                                />
                                <NavItem
                                    active={activeTab === "orders"}
                                    onClick={() => setActiveTab("orders")}
                                    icon={<Package className="w-4 h-4 mr-3" />}
                                    label="My Orders"
                                />
                                <NavItem
                                    active={activeTab === "addresses"}
                                    onClick={() => setActiveTab("addresses")}
                                    icon={<MapPin className="w-4 h-4 mr-3" />}
                                    label="Addresses"
                                />

                                <div className="pt-4 mt-4">
                                    <Button
                                        onClick={() => logout()}
                                        variant="ghost"
                                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-4 border-b border-gray-100 rounded-none h-auto"
                                    >
                                        <LogOut className="w-4 h-4 mr-3" />
                                        Log Out
                                    </Button>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 min-w-0 py-2">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
}

// Helper Component for Navigation Items
function NavItem({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center px-4 py-4 text-sm font-medium border-b border-gray-100 transition-colors duration-200 ${active
                ? "text-primary border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-gray-50"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
