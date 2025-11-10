
    import Image from "next/image";
    import Link2 from "next/link";
    import Navitems from "@/components/Navitems";
    import UserDropdown from "@/components/UserDropdown";

    const Header = ({ children }: { children: React.ReactNode }) => {
        return (
            <header className={"sticky top-0 header"}>
                <div className={"container header-wrapper"}>
                    <Link2 href="/">
                        <Image src={"/assets/icons/logo.svg"} alt={"Signalist logo"} width={140} height={32} className={"h-8 w-auto cursor-pointer"} />
                    </Link2>
                    <nav className={"hidden sm:block"}>
                        <Navitems/>
                    </nav>
                    <UserDropdown/>
                </div>
            </header>
        );
    };

    export default Header;



