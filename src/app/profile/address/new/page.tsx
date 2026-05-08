"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Address } from "@/components/profile/ProfileComponents";
import { toast } from "sonner";

export default function NewAddressPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const { addAddress } = useProfileStore();
    const [isLoading, setIsLoading] = useState(false);

    // Controlled inputs for dynamic pincode fetching
    const [pincode, setPincode] = useState("");
    const [city, setCity] = useState("");
    const [stateName, setStateName] = useState("");
    const [isFetchingPincode, setIsFetchingPincode] = useState(false);
    const [pincodeError, setPincodeError] = useState("");

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, authLoading, router]);

    const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPincode(val);
        setPincodeError("");

        if (val.length === 6) {
            setIsFetchingPincode(true);
            try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
                const data = await res.json();
                if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
                    const offices = data[0].PostOffice;
                    // Priority: Head Office → Sub Office → any
                    const office = 
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        offices.find((o: any) => o.BranchType === "Head Post Office" || o.BranchType === "Head Office") ||
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        offices.find((o: any) => o.BranchType === "Sub Post Office" || o.BranchType === "Sub Office") ||
                        offices[0];
                    
                    setCity(office.Block);
                    setStateName(office.State || "");
                } else {
                    setPincodeError("Failed to fetch pincode details, enter a correct pincode");
                    setCity("");
                    setStateName("");
                }
            } catch (error) {
                console.error("Failed to fetch pincode details", error);
                setPincodeError("Failed to fetch pincode details, enter a correct pincode");
                setCity("");
                setStateName("");
            } finally {
                setIsFetchingPincode(false);
            }
        } else {
            setCity("");
            setStateName("");
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        try {
            await addAddress({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type: formData.get('type') as any,
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                flat: formData.get('flat') as string,
                area: formData.get('area') as string,
                pincode: pincode,
                city: city,
                state: stateName,
                isDefault: formData.get('isDefault') === 'on'
            });
            
            const searchParams = new URLSearchParams(window.location.search);
            const redirectUrl = searchParams.get('redirect');
            if (redirectUrl) {
                router.push(redirectUrl);
            } else {
                router.push("/profile");
            }
            toast.success("Address saved successfully!");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to save address.");
            setIsLoading(false);
        }
    };

    if (authLoading || !isAuthenticated) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="bg-white min-h-[calc(100vh-80px)] py-10">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="mb-6 flex items-center">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <h1 className="text-2xl font-bold">Add New Address</h1>
                </div>

                <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" name="name" defaultValue={user?.name} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" type="tel" defaultValue={user?.phone} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" defaultValue={user?.email} required readOnly className="bg-gray-50 text-gray-500 cursor-not-allowed focus-visible:ring-0" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="flat">Flat, Housing no., Building, Apartment</Label>
                            <Input id="flat" name="flat" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="area">Area, Street, Sector</Label>
                            <Input id="area" name="area" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="pincode">Pincode</Label>
                                <div className="relative">
                                    <Input id="pincode" name="pincode" value={pincode} onChange={handlePincodeChange} required maxLength={6} className={pincodeError ? "border-red-500" : ""} />
                                    {isFetchingPincode && <Loader2 className="w-4 h-4 animate-spin absolute right-2 top-2.5 text-muted-foreground" />}
                                </div>
                                {pincodeError && <p className="text-xs text-red-500 mt-1">{pincodeError}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" name="city" value={city} readOnly required className="bg-gray-50 text-gray-500 cursor-not-allowed focus-visible:ring-0" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input id="state" name="state" value={stateName} readOnly required className="bg-gray-50 text-gray-500 cursor-not-allowed focus-visible:ring-0" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                            <div className="space-y-2">
                                <Label htmlFor="type">Address Type</Label>
                                <select
                                    id="type"
                                    name="type"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    defaultValue="Home"
                                >
                                    <option value="Home">Home</option>
                                    <option value="Work">Work</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-4 pt-4 border-t">
                            <input type="checkbox" id="isDefault" name="isDefault" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <Label htmlFor="isDefault" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Set as default address
                            </Label>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto px-8">
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save New Address"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
