const title: string = "Variable Tester v2";

export function resetTitle() {
    document.title = title;
}

export function setSubtitle(subtitle: string) {
    document.title = `${title} - ${subtitle}`;
}