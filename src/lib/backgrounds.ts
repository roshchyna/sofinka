import blob from "@/assets/backgrounds/blob-haikei.svg?no-inline";
import blobScatter from "@/assets/backgrounds/blob-scatter-haikei.svg?no-inline";
import blobScene from "@/assets/backgrounds/blob-scene-haikei.svg?no-inline";
import circleScatter from "@/assets/backgrounds/circle-scatter-haikei.svg?no-inline";
import layeredWaves from "@/assets/backgrounds/layered-waves-haikei.svg?no-inline";
import lowPolyGrid from "@/assets/backgrounds/low-poly-grid-haikei.svg?no-inline";
import polygonScatter from "@/assets/backgrounds/polygon-scatter-haikei.svg?no-inline";
import stackedWaves from "@/assets/backgrounds/stacked-waves-haikei.svg?no-inline";
import symbolScatter from "@/assets/backgrounds/symbol-scatter-haikei.svg?no-inline";
import wave from "@/assets/backgrounds/wave-haikei.svg?no-inline";

export const backgrounds = [
	{ id: "blob-scene", src: blobScene },
	{ id: "blob-scatter", src: blobScatter },
	{ id: "blob", src: blob },
	{ id: "circle-scatter", src: circleScatter },
	{ id: "layered-waves", src: layeredWaves },
	{ id: "low-poly-grid", src: lowPolyGrid },
	{ id: "polygon-scatter", src: polygonScatter },
	{ id: "symbol-scatter", src: symbolScatter },
	{ id: "stacked-waves", src: stackedWaves },
	{ id: "wave", src: wave },
] as const;

// Runs in <head> before paint. React renders identical markup on the server and
// client; only the document's CSS variable changes, like the existing theme setup.
export const backgroundScript = `
(() => {
  const backgrounds = ${JSON.stringify(backgrounds).replaceAll("<", "\\u003c")};
  const background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  document.documentElement.style.setProperty(
    "--sofinka-background-image", "url(" + JSON.stringify(background.src) + ")"
  );
  document.documentElement.dataset.background = background.id;
})();
`;
