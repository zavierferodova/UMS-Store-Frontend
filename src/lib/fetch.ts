export async function fetchJSON(url: string, options?: RequestInit) {
    try {
        const response = await fetch(url, {
            ...options
        });

        const result = await response.json();
        return result;
    } catch (e) {
        return null
    }
}
