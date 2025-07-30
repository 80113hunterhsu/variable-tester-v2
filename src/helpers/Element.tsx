export function generateElementKey(key: string) {
    return btoa(encodeURIComponent(key));
}
