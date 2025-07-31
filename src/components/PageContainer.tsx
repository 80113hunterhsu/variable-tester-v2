// node modules
import React from "react";

// components
import Navbar from "./Navbar";
import Footer from "./Footer";

// styles
import "./PageContainer.css";

// types
import { NavbarLink } from "../types/Navbar/NavbarTypes";

// PageContainerProps 型別
type PageContainerProps = {
    navbarLinks: NavbarLink[];
    children: React.ReactNode;
};

export default function PageContainer({
    navbarLinks,
    children,
}: PageContainerProps) {
    const classes: string[] = [
        "container-fluid",
        "d-flex",
        "flex-column",
        "m-0",
        "px-3",
        "py-0",
        "gap-3"
    ];
    return (
        <div id="page-container" className={classes.join(" ")}>
            {/* Navbar */}
            <Navbar navbarLinks={navbarLinks} />

            {/* 內容區塊 */}
            <div id="content-container" className="px-4 py-3 d-flex flex-center">
                {children}
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
