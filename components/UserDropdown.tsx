'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import Navitems from "@/components/Navitems";

const UserDropdown = () => {
    const router = useRouter();

    const handleSignout = async () => {
        router.push("/sign-in");
    };

    const user = { name: "John", email: "contact@jstockmarcket.com" };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-3 text-gray-400 hover:text-yellow-400"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://p2.hiclipart.com/preview/468/819/744/050-trading-text-relative-strength-index-trader-investor-market-maker-stock-trader-stock-market-trading-strategy-png-clipart.jpg" />
                        <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                            {user.name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-row items-center">
            <span className="text-base font-medium text-gray-400">
              {user.name}
            </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="text-gray-400 w-56">
                {/* Profil */}
                <DropdownMenuLabel>
                    <div className="flex items-center gap-3 py-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="https://p2.hiclipart.com/preview/468/819/744/050-trading-text-relative-strength-index-trader-investor-market-maker-stock-trader-stock-market-trading-strategy-png-clipart.jpg" />
                            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                                {user.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-base font-medium text-gray-400">{user.name}</span>
                            <span className="text-sm text-gray-500">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-600" />

                {/* Déconnexion — visible tout le temps */}
                <DropdownMenuItem
                    onClick={handleSignout}
                    className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer flex items-center"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                </DropdownMenuItem>

                {/* Navigation visible uniquement sur mobile */}
                <DropdownMenuSeparator className="bg-gray-600 sm:hidden" />
                <nav className="sm:hidden">
                    <Navitems />
                </nav>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;
