/* Shown while the profile page is fetched — matches the intro curtain so the
   two read as one continuous animation. */
export default function Loading() {
  return (
    <div className="aura-backdrop aura-page-loading">
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle className="ring r1" cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1.6" />
        <circle className="ring r2" cx="24" cy="24" r="14.5" stroke="currentColor" strokeWidth="1.7" />
        <circle className="ring r3" cx="24" cy="24" r="8.5" stroke="currentColor" strokeWidth="1.8" />
        <circle className="ring r4" cx="24" cy="24" r="2.8" fill="currentColor" />
      </svg>
    </div>
  );
}
