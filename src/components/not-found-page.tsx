import type { LottieComponentProps } from "lottie-react";
import LottieModule from "lottie-react";
import type { ReactElement } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import cat404Animation from "@/assets/404-error-with-cat.json";
import { Loader } from "@/ui/loader";
import { cn } from "@/utils/twMerge";

const Lottie = ((
	LottieModule as {
		default?: (props: LottieComponentProps) => ReactElement;
	}
).default ?? LottieModule) as (props: LottieComponentProps) => ReactElement;

const NotFoundAnimation = () => {
	const { t } = useTranslation();
	const [isLoaded, setIsLoaded] = useState(false);

	return (
		<div className="relative flex w-full h-80 max-w-md items-center justify-center">
			{!isLoaded && (
				<div className="absolute inset-0 flex items-center justify-center rounded-lg">
					<Loader />
				</div>
			)}
			<Lottie
				animationData={cat404Animation}
				aria-label={t("notFound.animationAria")}
				className={cn("w-full max-w-md", !isLoaded && "opacity-0")}
				loop
				onDOMLoaded={() => setIsLoaded(true)}
			/>
		</div>
	);
};

export default NotFoundAnimation;
