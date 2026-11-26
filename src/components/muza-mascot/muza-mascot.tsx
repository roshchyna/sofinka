import { memo, useEffect, useState } from "react";
import { cn } from "@/utils/twMerge";
import "./muza-mascot.css";

export type MuzaMascotState =
	| "idle"
	| "thinking"
	| "writing"
	| "speaking"
	| "listening"
	| "happy"
	| "hint"
	| "error"
	| "waving"
	| "sleeping"
	| "purring";

interface MuzaMascotProps {
	state?: MuzaMascotState;
	className?: string;
	label?: string;
	/** Enables a keyboard-accessible greeting and pointer tracking. */
	interactive?: boolean;
}

/** SVG illustration of Muza. */
export const MuzaMascot = memo(function MuzaMascot({
	state = "idle",
	className,
	label = "Muza",
	interactive = false,
}: MuzaMascotProps) {
	const [isGreeting, setIsGreeting] = useState(false);
	const [gaze, setGaze] = useState({ x: 0, y: 0 });
	useEffect(() => {
		if (!isGreeting) return;
		const timeout = window.setTimeout(() => setIsGreeting(false), 1600);
		return () => window.clearTimeout(timeout);
	}, [isGreeting]);

	const activeState = state === "idle" && isGreeting ? "happy" : state;
	const closedEyes = ["happy", "purring", "sleeping"].includes(activeState);
	const raisedPaw = ["waving", "hint", "listening"].includes(activeState);
	const eyeX = activeState === "thinking" ? -5 : gaze.x;
	const eyeY = activeState === "thinking" ? -6 : gaze.y;
	const image = (
		<svg
			aria-hidden="true"
			className="muza-mascot block size-full overflow-visible"
			data-state={activeState}
			fill="none"
			focusable="false"
			viewBox="0 0 240 280"
		>
			<ellipse cx="119" cy="263" rx="65" ry="8" className="fill-zinc-500/15" />
			<g className="muza-body">
				<path
					d="M151 240C175 234 199 231 202 247C207 268 161 268 136 269"
					className="muza-tail stroke-zinc-100"
					strokeWidth="12"
					strokeLinecap="round"
				/>
				<path
					d="M91 163C88 190 73 221 82 245C87 262 115 259 149 257C168 255 166 245 160 225L146 163Z"
					className="fill-zinc-100 stroke-zinc-300"
					strokeWidth="2"
				/>
				<path
					d="M145 174C126 185 128 217 143 227C149 231 155 230 162 228L148 174Z"
					className="fill-zinc-700"
				/>
				<path
					d="M97 237L96 250M111 239L110 252"
					className="stroke-zinc-300"
					strokeWidth="3"
					strokeLinecap="round"
				/>
				<g className="muza-head">
					<path
						d="M41 87L31 26Q52 21 82 43M158 43Q187 21 209 26L199 88"
						className="fill-zinc-700 stroke-zinc-600"
						strokeWidth="2"
						strokeLinejoin="round"
					/>
					<path
						d="M44 68L40 36L72 48ZM169 48L200 36L195 68Z"
						className="fill-pink-200"
					/>
					<path
						d="M40 41L56 47L43 49L59 55L46 57M198 41L183 47L196 49L181 55L194 57"
						className="stroke-zinc-500"
						strokeWidth="3"
					/>
					<path
						d="M38 105C34 63 67 27 118 27C174 25 202 59 201 105L205 153L216 160L201 161L211 168C183 175 155 174 122 174C86 175 55 177 28 166L41 161L27 158L39 151Z"
						className="fill-zinc-700 stroke-zinc-600"
						strokeWidth="2"
						strokeLinejoin="round"
					/>
					<path
						d="M39 133C68 136 79 127 94 118C105 111 112 102 119 89C127 116 142 131 161 144C174 153 190 156 205 153L216 160L201 161L211 168C180 176 151 174 122 174C86 175 55 177 28 166L41 161L27 158L39 151Z"
						className="fill-zinc-100"
					/>
					<g className="muza-eyes">
						<ellipse
							cx="87"
							cy="106"
							rx="29"
							ry="37"
							className="fill-amber-200"
						/>
						<ellipse
							cx="151"
							cy="106"
							rx="29"
							ry="37"
							className="fill-amber-200"
						/>
						{closedEyes ? (
							<path
								d={
									activeState === "sleeping"
										? "M69 111Q87 125 105 111M133 111Q151 125 169 111"
										: "M69 111Q87 91 105 111M133 111Q151 91 169 111"
								}
								className="stroke-zinc-800"
								strokeWidth="6"
								strokeLinecap="round"
							/>
						) : (
							<g className="muza-blink">
								<g transform={`translate(${eyeX} ${eyeY})`}>
									<ellipse
										cx="90"
										cy="112"
										rx="22"
										ry="28"
										className="fill-zinc-950"
									/>
									<ellipse
										cx="148"
										cy="112"
										rx="22"
										ry="28"
										className="fill-zinc-950"
									/>
									<ellipse
										cx="98"
										cy="100"
										rx="8"
										ry="10"
										className="fill-white"
									/>
									<ellipse
										cx="156"
										cy="100"
										rx="8"
										ry="10"
										className="fill-white"
									/>
									<circle cx="83" cy="123" r="3" className="fill-white/70" />
									<circle cx="141" cy="123" r="3" className="fill-white/70" />
								</g>
							</g>
						)}
					</g>
					{activeState === "error" && (
						<path
							d="M66 76L97 69M141 69L172 76"
							className="stroke-zinc-400"
							strokeWidth="4"
							strokeLinecap="round"
						/>
					)}
					{activeState === "happy" && (
						<g className="fill-pink-200/70">
							<ellipse cx="64" cy="143" rx="12" ry="6" />
							<ellipse cx="177" cy="143" rx="12" ry="6" />
						</g>
					)}
					<path
						d="M112 139Q119 135 126 139L119 146Z"
						className="fill-pink-300"
					/>
					{activeState === "speaking" ? (
						<g className="muza-speaking-mouth">
							<ellipse
								cx="119"
								cy="155"
								rx="11"
								ry="12"
								className="fill-zinc-800"
							/>
							<ellipse
								cx="119"
								cy="162"
								rx="7"
								ry="4"
								className="fill-pink-300"
							/>
						</g>
					) : (
						<path
							d={
								activeState === "error"
									? "M108 156Q119 149 130 156"
									: activeState === "sleeping"
										? "M115 154Q119 158 123 154"
										: "M119 145V151C119 161 102 160 103 150M119 151C119 161 136 160 135 150"
							}
							className="stroke-zinc-500"
							strokeWidth="3"
							strokeLinecap="round"
						/>
					)}
					<path
						d="M59 145L25 140M58 153L20 154M181 145L215 140M182 153L220 154"
						className="stroke-zinc-300"
						strokeWidth="2"
						strokeLinecap="round"
					/>
				</g>
			</g>
			{(raisedPaw || activeState === "writing") && (
				<g className={cn("muza-paw", raisedPaw && "muza-paw-raised")}>
					<path
						d="M145 198Q192 215 202 166L202 150"
						className="stroke-zinc-100"
						strokeWidth="17"
						strokeLinecap="round"
					/>
					<ellipse
						cx="202"
						cy="145"
						rx="13"
						ry="16"
						className="fill-zinc-100 stroke-zinc-300"
						strokeWidth="2"
					/>
					<ellipse cx="202" cy="148" rx="6" ry="7" className="fill-pink-200" />
					<path
						d="M196 137V140M202 134V137M208 137V140"
						className="stroke-pink-300"
						strokeWidth="3"
						strokeLinecap="round"
					/>
				</g>
			)}
			{activeState === "thinking" && (
				<g className="muza-thought fill-amber-300">
					<circle cx="201" cy="73" r="4" />
					<circle cx="212" cy="56" r="6" />
					<circle cx="219" cy="32" r="9" />
				</g>
			)}
			{activeState === "hint" && (
				<g className="muza-hint">
					<path
						d="M200 32C181 32 181 56 193 62V70H207V62C219 56 219 32 200 32Z"
						className="fill-amber-200 stroke-amber-500"
						strokeWidth="3"
					/>
					<path
						d="M194 76H206M200 18V11M179 27L174 22M221 27L226 22"
						className="stroke-amber-400"
						strokeWidth="3"
						strokeLinecap="round"
					/>
				</g>
			)}
			{activeState === "happy" && (
				<g
					className="muza-sparkles stroke-amber-400"
					strokeWidth="3"
					strokeLinecap="round"
				>
					<path d="M24 86V100M17 93H31M214 103V117M207 110H221M187 11V21M182 16H192" />
				</g>
			)}
			{activeState === "listening" && (
				<g
					className="muza-listening stroke-sky-400"
					strokeWidth="3"
					strokeLinecap="round"
				>
					<path d="M215 89Q225 100 215 111M224 80Q241 100 224 120" />
				</g>
			)}
			{activeState === "sleeping" && (
				<path
					d="M195 38H211L195 55H211M216 18H227L216 30H227"
					className="muza-sleep stroke-zinc-400"
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			)}
		</svg>
	);

	if (!interactive) {
		return (
			<span
				role="img"
				aria-label={label}
				className={cn("inline-block size-36 shrink-0", className)}
			>
				{image}
			</span>
		);
	}

	return (
		<button
			type="button"
			aria-label={label}
			className={cn(
				"inline-block size-36 shrink-0 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-pink-500 focus-visible:outline-offset-4",
				className,
			)}
			onClick={() => setIsGreeting(true)}
			onPointerMove={(event) => {
				if (event.pointerType === "touch") return;
				const bounds = event.currentTarget.getBoundingClientRect();
				if (!bounds.width || !bounds.height) return;
				setGaze({
					x: Math.max(
						-5,
						Math.min(
							5,
							((event.clientX - bounds.left) / bounds.width - 0.5) * 10,
						),
					),
					y: Math.max(
						-4,
						Math.min(
							4,
							((event.clientY - bounds.top) / bounds.height - 0.5) * 8,
						),
					),
				});
			}}
			onPointerLeave={() => setGaze({ x: 0, y: 0 })}
			onBlur={() => setGaze({ x: 0, y: 0 })}
		>
			{image}
		</button>
	);
});
