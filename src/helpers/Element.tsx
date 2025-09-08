import { sleep } from "./Sleep";

export function generateElementKey(key: string) {
    return btoa(encodeURIComponent(key));
}

export async function debounce(refBtn: any, callable: any) {
    if (!refBtn.current) return;
    if (refBtn.current.disabled) return;
    refBtn.current && (refBtn.current.disabled = true);
    callable();
    await sleep(10);
    refBtn.current && (refBtn.current.disabled = false);
}
