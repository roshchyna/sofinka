export function normalizeImageSource(source: unknown) {
	const value = typeof source === "string" ? source.trim() : "";

	if (!value) return "";
	if (value.startsWith("data:image/svg+xml")) return value;
	if (isSvgMarkup(value)) {
		return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(value)}`;
	}

	return value;
}

function isSvgMarkup(value: string) {
	return value.startsWith("<svg") || value.startsWith("<?xml");
}
