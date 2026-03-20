
import Image from "next/image";
import Link2 from "next/link";
import Navitems from "@/components/Navitems";
import UserDropdown from "@/components/UserDropdown";
import { searchStocks } from "@/lib/action/finnhub.actions";

const Header = async ({ user }: { user: User }) => {
    // Preload a default list of stocks for search (popular/top symbols)
    const initialStocks = await searchStocks();
    return (
        <header className={"sticky top-0 header"}>
            <div className={"container header-wrapper"}>
                <Link2 href="/">
                    <Image src={"/assets/icons/logo.svg"} alt={"Logo Signalist"} width={140} height={32} className={"h-8 w-auto cursor-pointer"} />
                </Link2>
                <nav className={"hidden sm:block"}>
                    <Navitems initialStocks={initialStocks} />
                </nav>
                <UserDropdown user={user} initialStocks={initialStocks} />
            </div>
        </header>
    );
};

export default Header;



