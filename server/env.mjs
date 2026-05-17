import { readFileSync } from "node:fs";

export function loadEnv() {
	try {
		const env = readFileSync(".env", "utf8");

		for (const line of env.split("\n")) {
			const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
			if (!match || process.env[match[1]]) continue;
			process.env[match[1]] = match[2].trim();
		}
	} catch {
	}
}
