import { useState, useRef, useEffect } from "react";

export default function ReadMore({ text }: { text: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [height, setHeight] = useState("0px");
    const contentRef = useRef<HTMLParagraphElement | null>(null);

    useEffect(() => {
    if (contentRef.current) {
        setHeight(isExpanded 
        ? `${contentRef.current.scrollHeight}px` 
        : "60px" // tinggi awal (sekitar 2-3 baris)
        );
    }
    }, [isExpanded]);

    return (
        <div className="max-w-md">
            <div
            style={{ maxHeight: height }}
            className="overflow-hidden transition-all duration-300 ease-in-out"
            >
            <p
                ref={contentRef}
                className="py-1 text-sm text-justify font-light tracking-wider line-height-0"
            >
                {text}
            </p>
            </div>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-400 text-sm hover:underline"
            >
                {isExpanded ? "Show less" : "Read more"}
            </button>
        </div>
    );
}