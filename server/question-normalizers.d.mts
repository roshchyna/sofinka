export function normalizeGeneratedResponse(
	generated: unknown,
	request: {
		language: string;
		topic: string;
		type: string;
	},
): unknown;
