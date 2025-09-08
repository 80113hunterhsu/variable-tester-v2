export function checkRequiredFields(
    fields: string[],
    data: { [key: string]: any }
): boolean {
    let isChecked = true;
    fields.forEach((key) => {
        if (isChecked && !data.hasOwnProperty(key)) {
            isChecked = false;
            return;
        }
    });
    return isChecked;
}

export function bindEnterKey(refBtn: any) {
    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            refBtn?.current?.click();
        }
    });
}