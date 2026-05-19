'use client'

import { RefObject, useEffect, useRef } from "react";

const BED_TYPE_MAP: Record<string, string> = {
KING: "KING", QUEEN: "KING",
TWIN: "TWIN", DOUBLE: "TWIN",
SINGLE: "SINGLE",
};

const BED_TEMPLATES: Record<string, (x: number, y: number, w: number, h: number) => string> = {
    KING: (x, y, w, h) => {
        const bx = x + w * 0.337;
        const by = y + h * 0.01;
        const bw = w * 0.325;
        const bh = h * 0.376;
        const headH = h * 0.114;
        return `
        <g class="bed-icon pointer-events-none">
            <path d="M${bx} ${by}H${bx + bw}V${by + bh}H${bx}Z" fill="#C8A755"/>
            <line x1="${bx + bw / 2}" y1="${by}" x2="${bx + bw / 2}" y2="${by + headH}" stroke="white" stroke-width="0.9"/>
            <line x1="${bx}" y1="${by + headH}" x2="${bx + bw}" y2="${by + headH}" stroke="white" stroke-width="0.9"/>
        </g>`
    },

    TWIN: (x, y, w, h) => {
    const by = y + h * 0.01;
    const bh = h * 0.376;
    const headH = h * 0.114;
    const bw = w * 0.157;
    const b1x = x + w * 0.285; // bed kiri (offsetX 28.5%)
    const b2x = x + w * 0.544; // bed kanan (offsetX 54.4%)
    return `
        <g class="bed-icon pointer-events-none">
        <path d="M${b1x} ${by}H${b1x + bw}V${by + bh}H${b1x}Z" fill="#C8A755"/>
        <line x1="${b1x}" y1="${by + headH}" x2="${b1x + bw}" y2="${by + headH}" stroke="white" stroke-width="0.9"/>
        <path d="M${b2x} ${by}H${b2x + bw}V${by + bh}H${b2x}Z" fill="#C8A755"/>
        <line x1="${b2x}" y1="${by + headH}" x2="${b2x + bw}" y2="${by + headH}" stroke="white" stroke-width="0.9"/>
        </g>`
    },

    SINGLE: (x, y, w, h) => {
        const by = y + h * 0.01;
        const bh = h * 0.376;
        const headH = h * 0.114;
        const bw = w * 0.157;
        const bx = x + (w - bw) / 2;
        return `
        <g class="bed-icon pointer-events-none">
            <path d="M${bx} ${by}H${bx + bw}V${by + bh}H${bx}Z" fill="#C8A755"/>
            <line x1="${bx}" y1="${by + headH}" x2="${bx + bw}" y2="${by + headH}" stroke="white" stroke-width="0.9"/>
        </g>`
    },
};

const injectBedIcons = async (container: HTMLDivElement) => {
const res = await fetch("/api/room/bedtype");
const bedTypes: Record<string, string> = await res.json();

const rooms = container.querySelectorAll<SVGGElement>('g[id^="room-"]');

rooms.forEach((room) => {
    const roomNumber = room.id.replace("room-", "");
    const mappedType = BED_TYPE_MAP[bedTypes[roomNumber]];
    if (!mappedType) return;

    room.querySelectorAll(".bed-icon").forEach((el) => el.remove());

    const bgRect = room.querySelector<SVGRectElement>("rect");
    if (!bgRect) return;

    const rx = parseFloat(bgRect.getAttribute("x") ?? "0");
    const ry = parseFloat(bgRect.getAttribute("y") ?? "0");
    const rw = parseFloat(bgRect.getAttribute("width") ?? "0");
    const rh = parseFloat(bgRect.getAttribute("height") ?? "0");

    const template = BED_TEMPLATES[mappedType];
    room.insertAdjacentHTML("beforeend", template(rx, ry, rw, rh));
});
};

export const useSvgLoader = (
    containerRef: RefObject<HTMLDivElement | null>,
    onLoaded: () => void
) => {
    const svgLoadedRef = useRef(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || svgLoadedRef.current) return;

        fetch("/floorplans/floorplan2nd.svg")
        .then((res) => res.text())
        .then(async (svgText) => {
            container.innerHTML = svgText;
            svgLoadedRef.current = true;
            await injectBedIcons(container);
            onLoaded();
        });
    }, []);
};