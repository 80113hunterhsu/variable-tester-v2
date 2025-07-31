import "./Footer.css";

export default function Footer() {
    const classes: string[] = [
        "text-center",
        "text-muted",
        "px-4",
        "py-3",
        "mb-3",
        "element",
    ];
    return (
        <footer className={classes.join(" ")}>
            &copy; {new Date().getFullYear()} Variable Tester | <a href="https://www.hunterhsu.net/" target="_blank">Hunter Hsu</a>
        </footer>
    );
}
