export const DEFAULT_CLIENT_ORIGIN = "http://localhost:5173";

export const ALLOWED_CLIENT_ORIGINS = new Set([
	DEFAULT_CLIENT_ORIGIN,
	"http://localhost:5174",
	"http://127.0.0.1:5173",
	"http://127.0.0.1:5174",
]);

export function readJson(req) {
	return new Promise((resolve, reject) => {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk;
		});
		req.on("end", () => {
			try {
				resolve(body ? JSON.parse(body) : {});
			} catch (error) {
				reject(error);
			}
		});
		req.on("error", reject);
	});
}

export function getRequestOrigin(req) {
	const origin = req.headers.origin;
	return ALLOWED_CLIENT_ORIGINS.has(origin) ? origin : DEFAULT_CLIENT_ORIGIN;
}

export function setCorsHeaders(req, res) {
	res.setHeader("Access-Control-Allow-Origin", getRequestOrigin(req));
	res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export function sendJson(res, status, body) {
	res.writeHead(status, { "Content-Type": "application/json" });
	res.end(JSON.stringify(body));
}
