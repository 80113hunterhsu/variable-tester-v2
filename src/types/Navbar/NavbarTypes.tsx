export type NavbarLink = {
    title: string;
    to: string;
    active?: boolean;
};

export type NavbarProps = {
    navbarLinks: NavbarLink[];
};
