const cache = new Map();

export const fetchArtistInfo = async (artistName) => {
    const cacheKey = artistName;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    // Try English Wikipedia for art historical info (better coverage)
    const encoded = encodeURIComponent(artistName.replace(/ /g, '_'));
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}?redirect=true`;

    try {
        const res = await fetch(url, {
            headers: { Accept: 'application/json' },
        });
        if (!res.ok) return null;

        const data = await res.json();

        // Skip disambiguation pages
        if (data.type === 'disambiguation') return null;

        const result = {
            title: data.title || artistName,
            description: data.description || null,
            extract: data.extract || '',
            thumbnail: data.thumbnail?.source || null,
            pageUrl: data.content_urls?.desktop?.page || null,
        };

        cache.set(cacheKey, result);
        return result;
    } catch {
        return null;
    }
};
