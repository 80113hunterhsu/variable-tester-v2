import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavbarProps } from "../types/Navbar/NavbarTypes";
import { generateElementKey } from "../helpers/Element";
import "./Navbar.css";

function handleThemeChange(
    iconRef: React.RefObject<HTMLButtonElement>
) {
    const themes: Record<string, string> = {
        light: "dark",
        dark: "light",
    };
    const theme = getTheme();
    setTheme(themes[theme], iconRef);
}

function getTheme(): string {
    return window?.localStorage.getItem("theme") || "light";
}

function setTheme(theme: string, iconRef: React.RefObject<HTMLButtonElement>) {
    const icons: Record<string, string> = {
        light: "bi-moon",
        dark: "bi-sun",
    };

    // Set page theme
    document.body.setAttribute("data-bs-theme", theme);
    window?.localStorage.setItem("theme", theme);
    
    // Clear icon current class
    Object.values(icons).forEach((iconClass: string) => {
        iconRef.current?.classList.remove(iconClass);
    });

    // Set icon new class
    const icon = icons[theme] || "bi-sun";
    iconRef.current?.classList.add(icon);
}

export default function Navbar({ navbarLinks }: NavbarProps) {
    const iconRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        setTheme(getTheme(), iconRef);
    }, []);
    return (
        <nav className="navbar navbar-expand-lg shadow-sm mt-3 px-2 element">
            <div className="container-fluid">
                <div className="d-flex">
                    <Link className="navbar-brand fw-bold" to="/">
                        Variable Tester
                    </Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {navbarLinks.map((link) => {
                                const isActive: boolean = link.active ? true : false;

                                let liClasses: string[] = ["nav-item"];
                                if (isActive) {
                                    liClasses.push("active");
                                }

                                const linkClasses: string[] = [
                                    "nav-link",
                                    "me-1",
                                    "px-3",
                                    "rounded-pill",
                                ];
                                if (isActive) {
                                    linkClasses.push(
                                        "fw-bold",
                                        "bg-primary",
                                        "text-white",
                                        "shadow"
                                    );
                                }

                                return (
                                    <li className={liClasses.join(" ")} key={link.to}>
                                        <Link
                                            key={generateElementKey(
                                                `Navbar-${link.to}-${link.title}`
                                            )}
                                            className={linkClasses.join(" ")}
                                            to={link.to}
                                        >
                                            {link.title}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div className="d-flex">
                    <button
                        id="theme-toggle"
                        className="btn"
                        onClick={() => handleThemeChange(iconRef)}
                    >
                        <i ref={iconRef} className="bi bi-moon"></i>
                    </button>
                </div>
            </div>
        </nav>
    );
}
