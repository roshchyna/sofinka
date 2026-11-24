export function ApplicationBackground() {
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat [background-image:var(--sofinka-background-image)]"
		>
			<div className="absolute inset-0 bg-white/45 dark:bg-zinc-950/60" />
		</div>
	);
}
