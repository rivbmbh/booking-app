import clsx from "clsx";

const SectionLabel = ({ step, label, className }: { step: number; label: string; className?: string }) => (
    <div className={clsx("flex items-center gap-2", className)}>
        <p className="rounded-full bg-primary w-7 h-7 text-center font-semibold text-white border-2 border-black">
        {step}
        </p>
        <p className="tracking-wider text-base font-semibold">{label}</p>
    </div>
);

export default SectionLabel;