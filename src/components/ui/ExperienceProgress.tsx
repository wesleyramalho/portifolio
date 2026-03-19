"use client";

interface ExperienceProgressProps {
  total: number;
  active: number;
  companies: string[];
  isMobile?: boolean;
  onSelect?: (index: number) => void;
}

export default function ExperienceProgress({
  total,
  active,
  companies,
  isMobile = false,
  onSelect,
}: ExperienceProgressProps) {
  if (isMobile) {
    return (
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-400 max-w-[220px] truncate">
          {companies[active]}
        </span>

        <div className="flex items-center gap-2">
          {Array.from({ length: total }).map((_, i) => {
            const isCurrent = i === active;

            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelect?.(i)}
                aria-label={`Go to experience ${i + 1}: ${companies[i]}`}
                aria-current={isCurrent ? "true" : undefined}
                className="pointer-events-auto p-3 -m-3"
              >
                <div
                  style={{
                    width: isCurrent ? 18 : 6,
                    height: 6,
                    borderRadius: 999,
                    backgroundColor: isCurrent ? "#ffffff" : "#52525b",
                    boxShadow: isCurrent
                      ? "0 0 6px 2px rgba(255,255,255,0.35)"
                      : "none",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end gap-3 z-20">
      {Array.from({ length: total }).map((_, i) => {
        const isCurrent = i === active;

        return (
          <div key={i} className="flex items-center gap-2">
            {isCurrent && (
              <span
                className="font-mono text-[10px] tracking-widest uppercase text-zinc-400 whitespace-nowrap"
                style={{
                  maxWidth: 120,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {companies[i]}
              </span>
            )}

            <button
              type="button"
              onClick={() => onSelect?.(i)}
              aria-label={`Go to experience ${i + 1}: ${companies[i]}`}
              aria-current={isCurrent ? "true" : undefined}
              className="pointer-events-auto p-5 flex items-center justify-center"
            >
              <div
                style={{
                  width: isCurrent ? 8 : 4,
                  height: isCurrent ? 8 : 4,
                  borderRadius: "50%",
                  backgroundColor: isCurrent ? "#ffffff" : "#52525b",
                  boxShadow: isCurrent
                    ? "0 0 6px 2px rgba(255,255,255,0.5), 0 0 14px 4px rgba(255,255,255,0.2)"
                    : "none",
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
