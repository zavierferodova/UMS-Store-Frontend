export async function fetchJSON(url: string, options?: RequestInit) {
    try {
        const response = await fetch(url, {
            ...options
        });

        if (response.ok) {
            const result = await response.json();
            return result;
        }

        return null;
    } catch {
        return null
    }
}
