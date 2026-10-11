const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

const toApiDate = (value: string): string | null => {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
    return m ? `${m[3]}-${m[2]}-${m[1]}T00:00:00Z` : null;
};

const toDisplayDate = (iso: string): string => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : "";
};

export { formatDate, toApiDate, toDisplayDate };