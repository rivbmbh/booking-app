import { RefObject, useEffect, useRef } from "react";

export const useSvgLoader = (containerRef: RefObject<HTMLDivElement > | null, onLoaded: () => void) => {
    const svgLoadedRef = useRef(false);

    useEffect(() => {
        const container = containerRef?.current;
        if (!container || svgLoadedRef.current) return;

        fetch("/floorplans/floorplan.svg")
            .then((res) => res.text())
            .then((svgText) => {
                container.innerHTML = svgText;
                svgLoadedRef.current = true;
                onLoaded(); // apply styles setelah SVG dimuat
            });
    }, []);
};