import { Link } from "react-router-dom";
import { NavbarProps } from "../types/Navbar/NavbarTypes";
import { generateElementKey } from "../helpers/Element";
import "./Navbar.css";

export default function Navbar({ navbarLinks }: NavbarProps) {
    return (
        <nav className="navbar navbar-expand-lg shadow-sm mt-3 px-2 element">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold" to="/">Variable Tester</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {navbarLinks.map((link) => {
                            const isActive: boolean = link.active ? true : false;

                            let liClasses: string[] = ["nav-item"];
                            if (isActive) {
                                liClasses.push("active");
                            }

                            let linkClasses: string[] = ["nav-link", "me-1", "px-3", "rounded-pill"];
                            if (isActive) {
                                linkClasses.push("fw-bold", "bg-primary", "text-white", "shadow");
                            } else {
                                linkClasses.push("text-dark");
                            }

                            return (
                                <li className={liClasses.join(" ")} key={link.to}>
                                    <Link key={generateElementKey(`Navbar-${link.to}-${link.title}`)} className={linkClasses.join(" ")} to={link.to}>{link.title}</Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
