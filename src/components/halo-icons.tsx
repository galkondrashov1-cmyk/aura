// אייקוני "הילה" — סט מאויר בעבודת יד. הקו המזהה: כל אייקון חובש הילה —
// אליפסה זהובה מוטה מעל הראש, כמו של מלאך. זה הטאץ' של המותג.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

/** The signature tilted halo that floats above every icon. */
function Halo({ cx = 12, cy = 4.2 }: { cx?: number; cy?: number }) {
  return (
    <g className="halo-icon-ring">
      <ellipse
        cx={cx}
        cy={cy}
        rx="5"
        ry="1.8"
        fill="none"
        stroke="var(--halo-ring, #f0b429)"
        strokeWidth="1.6"
        transform={`rotate(-8 ${cx} ${cy})`}
      />
    </g>
  );
}

function Base({ size = 24, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

/** לוח שנה עם הילה — זימון תורים */
export function HaloCalendar(props: IconProps) {
  return (
    <Base {...props}>
      <Halo />
      <rect x="4" y="9" width="16" height="12" rx="2.5" />
      <path d="M4 13.5h16" />
      <path d="M8.5 9V7.5M15.5 9V7.5" />
      <circle cx="12" cy="17.2" r="1.3" fill="currentColor" stroke="none" />
    </Base>
  );
}

/** מכחול עם הילה — סטודיו העיצוב */
export function HaloBrush(props: IconProps) {
  return (
    <Base {...props}>
      <Halo />
      <path d="M17.5 8.5 12 14l-2-2 5.5-5.3a1.4 1.4 0 0 1 2 2Z" />
      <path d="M10 12c-2.6.3-3.2 2-3.4 3.6-.1 1.2-.7 2-1.8 2.4 1.4 1.5 5 1.9 6.6-.4.9-1.3.7-2.7.6-3.6" />
    </Base>
  );
}

/** טלפון עם הילה — מושלם בנייד */
export function HaloPhone(props: IconProps) {
  return (
    <Base {...props}>
      <Halo />
      <rect x="8" y="8" width="8" height="13" rx="2" />
      <path d="M11 18.5h2" />
    </Base>
  );
}

/** מגן עם הילה — אימות SMS */
export function HaloShield(props: IconProps) {
  return (
    <Base {...props}>
      <Halo />
      <path d="M12 8.5 6.5 10v3.8c0 3.4 2.3 5.6 5.5 7 3.2-1.4 5.5-3.6 5.5-7V10L12 8.5Z" />
      <path d="m9.8 14.3 1.6 1.6 3-3" />
    </Base>
  );
}

/** גרף עם הילה — סטטיסטיקות */
export function HaloChart(props: IconProps) {
  return (
    <Base {...props}>
      <Halo />
      <path d="M5 9v10.5a1.5 1.5 0 0 0 1.5 1.5H20" />
      <path d="M8.5 17v-3M12.5 17v-5.5M16.5 17V9.5" />
    </Base>
  );
}

/** שעון עם הילה — מוכן בדקות */
export function HaloClock(props: IconProps) {
  return (
    <Base {...props}>
      <Halo />
      <circle cx="12" cy="15" r="6" />
      <path d="M12 12.2V15l2 1.6" />
    </Base>
  );
}

/** לב עם הילה — הלקוחות מרגישים */
export function HaloHeart(props: IconProps) {
  return (
    <Base {...props}>
      <Halo />
      <path d="M12 20.5s-6-3.5-6-8a3.3 3.3 0 0 1 6-1.9 3.3 3.3 0 0 1 6 1.9c0 4.5-6 8-6 8Z" />
    </Base>
  );
}

/** חנות עם הילה — העסק עצמו */
export function HaloStore(props: IconProps) {
  return (
    <Base {...props}>
      <Halo />
      <path d="M5.5 12v7.5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V12" />
      <path d="M4.5 9.5 6 7h12l1.5 2.5c.5 1-.3 2.5-1.8 2.5-1 0-1.9-.6-1.9-1.5 0 .9-.8 1.5-1.9 1.5s-1.9-.6-1.9-1.5c0 .9-.8 1.5-1.9 1.5s-1.9-.6-1.9-1.5c0 .9-.9 1.5-1.9 1.5-1.5 0-2.3-1.5-1.8-2.5Z" />
      <path d="M10 20.5v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4" />
    </Base>
  );
}

/** ניצוץ עם הילה — הקסם */
export function HaloSpark(props: IconProps) {
  return (
    <Base {...props}>
      <Halo />
      <path d="M12 8.5c.5 3.2 1.8 4.5 5 5-3.2.5-4.5 1.8-5 5-.5-3.2-1.8-4.5-5-5 3.2-.5 4.5-1.8 5-5Z" />
    </Base>
  );
}

/** גלגל שיניים עם הילה — הגדרות */
export function HaloGear(props: IconProps) {
  return (
    <Base {...props}>
      <Halo />
      <circle cx="12" cy="15" r="2.2" />
      <path d="M12 9.5v1.6M12 18.9v1.6M6.5 15h1.6M15.9 15h1.6M8.1 11.1l1.1 1.1M14.8 17.8l1.1 1.1M15.9 11.1l-1.1 1.1M9.2 17.8l-1.1 1.1" />
    </Base>
  );
}

/** שקל עם הילה — מחירים */
export function HaloShekel(props: IconProps) {
  return (
    <Base {...props}>
      <Halo />
      <path d="M8 20v-8.5A2.5 2.5 0 0 1 10.5 9h2A2.5 2.5 0 0 1 15 11.5V15" />
      <path d="M11 13v4.5a2.5 2.5 0 0 0 2.5 2.5h0A2.5 2.5 0 0 0 16 17.5" transform="translate(1 0)" />
    </Base>
  );
}
