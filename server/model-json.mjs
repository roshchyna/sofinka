export function parseModelJson(content) {
	if (typeof content !== "string") return {};
	const trimmed = content.trim();
	const fencedBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
	const value = fencedBlock?.[1]?.trim() ?? trimmed;
	const objectStart = value.indexOf("{");
	const objectEnd = value.lastIndexOf("}");
	const json = value.slice(
		objectStart === -1 ? 0 : objectStart,
		objectEnd === -1 ? undefined : objectEnd + 1,
	);

	try {
		return JSON.parse(json);
	} catch {
		return {};
	}
}
