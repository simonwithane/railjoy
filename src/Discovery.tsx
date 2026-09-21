import { useEffect, useRef, useState } from 'react';
import {
  durationLabel,
  filterJourneys,
  journeys,
  parseSaved,
  themes,
  type Journey,
} from './journeys';
const storageKey = 'railjoy.saved.v1';
function Icon({
  name,
  filled = false,
}: {
  name: 'train' | 'heart' | 'arrow' | 'search';
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === 'heart' ? (
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
      ) : name === 'arrow' ? (
        <path d="M4 12h16m-6-6 6 6-6 6" />
      ) : name === 'search' ? (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 5 5" />
        </>
      ) : (
        <>
          <rect x="5" y="3" width="14" height="15" rx="4" />
          <path d="M5 11h14M9 3v8M8 21l2-3m6 3-2-3M8 15h1m6 0h1" />
        </>
      )}
    </svg>
  );
}
function Landscape({
  scene,
  hero = false,
}: {
  scene: Journey['scene'];
  hero?: boolean;
}) {
  return (
    <div
      className={`landscape ${scene} ${hero ? 'hero-landscape' : ''}`}
      aria-hidden="true"
    >
      <div className="sun" />
      <div className="mountain mountain-back" />
      <div className="mountain mountain-front" />
      <div className="water" />
      <div className="land" />
      <div className="rail-line" />
      <div className="little-train">
        <i />
        <i />
        <i />
      </div>
      {scene === 'city' && <div className="buildings">▥ ▤ ▥ ▤ ▥</div>}
      <div className="grain" />
    </div>
  );
}
export default function App() {
  const [page, setPage] = useState<'explore' | 'saved'>('explore');
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState<string>('All journeys');
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      return parseSaved(localStorage.getItem(storageKey));
    } catch {
      return [];
    }
  });
  const [notice, setNotice] = useState('');
  const [selected, setSelected] = useState<Journey | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === storageKey || e.key === null)
        setSaved(parseSaved(e.newValue));
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  function toggleSaved(j: Journey) {
    const next = saved.includes(j.id)
      ? saved.filter((id) => id !== j.id)
      : [...saved, j.id];
    setSaved(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setNotice(
        `${j.from} to ${j.to} ${next.includes(j.id) ? 'saved to' : 'removed from'} your journeys.`,
      );
    } catch {
      setNotice(
        'Your selection is saved for this visit. Browser storage is unavailable.',
      );
    }
  }
  function navigate(next: 'explore' | 'saved') {
    setPage(next);
    setQuery('');
    setTheme('All journeys');
  }
  const results = filterJourneys(
    page === 'saved' ? journeys.filter((j) => saved.includes(j.id)) : journeys,
    query,
    theme,
  );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a
          className="brand"
          href="#"
          onClick={() => navigate('explore')}
          aria-label="Railjoy home"
        >
          <span className="brand-mark">
            <Icon name="train" />
          </span>
          railjoy<span className="brand-dot">.</span>
        </a>
        <nav aria-label="Main navigation">
          <button
            className={page === 'explore' ? 'nav-link active' : 'nav-link'}
            onClick={() => navigate('explore')}
            aria-current={page === 'explore' ? 'page' : undefined}
          >
            Explore
          </button>
          <button
            className={page === 'saved' ? 'nav-link active' : 'nav-link'}
            onClick={() => navigate('saved')}
            aria-current={page === 'saved' ? 'page' : undefined}
          >
            <Icon name="heart" /> My journeys{' '}
            <span className="count">{saved.length}</span>
          </button>
        </nav>
        <span className="edition">THE JOY IS IN THE JOURNEY</span>
      </header>
      <main id="main">
        {page === 'explore' ? (
          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow">
                <span /> LESS RUSH. MORE WONDER.
              </p>
              <h1>
                Make room for
                <br />
                the <em>journey.</em>
              </h1>
              <p className="hero-description">
                Big windows. New perspectives. Discover your next escape, one
                rail journey at a time.
              </p>
              <a className="primary-button" href="#journeys">
                Find your next journey <Icon name="arrow" />
              </a>
              <p className="hero-footnote">
                <Icon name="train" /> A different way to get away.
              </p>
            </div>
            <div className="hero-art">
              <Landscape scene="alps" hero />
              <div className="art-label">
                <span>THE WINDOW SEAT COLLECTION</span>
                <strong>A little further from ordinary.</strong>
                <span>01 / SWITZERLAND</span>
              </div>
              <div className="round-stamp">
                TAKE IT
                <br />
                <b>SLOW</b>
                <br />↗
              </div>
            </div>
          </section>
        ) : (
          <section className="saved-intro">
            <p className="eyebrow">YOUR NEXT CHAPTER</p>
            <h1>
              Good journeys.
              <br />
              <em>Worth keeping.</em>
            </h1>
            <p>
              Your shortlist of somewhere-new. Saved on this browser, ready when
              you are.
            </p>
          </section>
        )}
        <section
          id="journeys"
          className="journey-section"
          aria-labelledby="journeys-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                {page === 'saved'
                  ? 'A LITTLE INSPIRATION, KEPT CLOSE'
                  : 'GO SOMEWHERE THAT MOVES YOU'}
              </p>
              <h2 id="journeys-title">
                {page === 'saved'
                  ? 'My journeys'
                  : 'Where will the rails take you?'}
              </h2>
            </div>
            <p>
              {page === 'saved'
                ? `${saved.length} saved ${saved.length === 1 ? 'journey' : 'journeys'}`
                : 'A few ideas to get you going.'}
            </p>
          </div>
          <div className="discovery-controls">
            <div className="filters" aria-label="Journey categories">
              {themes.map((t) => (
                <button
                  key={t}
                  aria-pressed={theme === t}
                  className={theme === t ? 'filter selected' : 'filter'}
                  onClick={() => setTheme(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <label className="search">
              <Icon name="search" />
              <span className="sr-only">Search cities or countries</span>
              <input
                type="search"
                placeholder="Search a city or country"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
          <p className="demo-note">
            <span>EARLY EXPLORER</span> Inspiration with sample routes and
            estimated durations. No live schedules or booking yet.
          </p>
          <div className="sr-only" role="status">
            {results.length} journeys shown
          </div>
          {results.length ? (
            <div className="journey-grid">
              {results.map((j) => (
                <article className="journey-card" key={j.id}>
                  <div className="card-art">
                    <button
                      className="art-open"
                      onClick={() => setSelected(j)}
                      aria-label={`Explore ${j.from} to ${j.to}`}
                    >
                      <Landscape scene={j.scene} />
                    </button>
                    <span className="country-tag">{j.country}</span>
                    <button
                      className={`save-button ${saved.includes(j.id) ? 'is-saved' : ''}`}
                      onClick={() => toggleSaved(j)}
                      aria-label={`${saved.includes(j.id) ? 'Unsave' : 'Save'} ${j.from} to ${j.to}`}
                      aria-pressed={saved.includes(j.id)}
                    >
                      <Icon name="heart" filled={saved.includes(j.id)} />
                    </button>
                  </div>
                  <div className="card-copy">
                    <p className="card-theme">{j.theme}</p>
                    <h3>
                      <button onClick={() => setSelected(j)}>
                        {j.from}
                        <span>→</span>
                        {j.to}
                      </button>
                    </h3>
                    <p className="card-description">{j.title}</p>
                    <div className="card-bottom">
                      <span>
                        <Icon name="train" /> About {durationLabel(j.duration)}
                      </span>
                      <button
                        onClick={() => setSelected(j)}
                        aria-label={`View ${j.from} to ${j.to} details`}
                      >
                        <Icon name="arrow" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Icon
                name={page === 'saved' && !saved.length ? 'heart' : 'search'}
              />
              <h3>
                {page === 'saved' && !saved.length
                  ? 'Your next adventure starts with a heart.'
                  : 'No journeys found just yet.'}
              </h3>
              <p>
                {page === 'saved' && !saved.length
                  ? 'Tap the heart on a journey to keep it here.'
                  : 'Try another city, country, or category.'}
              </p>
              <button
                className="primary-button"
                onClick={() => {
                  if (page === 'saved' && !saved.length) navigate('explore');
                  else {
                    setQuery('');
                    setTheme('All journeys');
                  }
                }}
              >
                {page === 'saved' && !saved.length
                  ? 'Explore journeys'
                  : 'Clear filters'}
                <Icon name="arrow" />
              </button>
            </div>
          )}
        </section>
        <section className="closing-note">
          <Icon name="train" />
          <p>
            Not just getting there.
            <br />
            <em>Enjoying the way.</em>
          </p>
          <span>That’s the Railjoy idea.</span>
        </section>
      </main>
      <footer>
        <a className="brand" href="#" onClick={() => navigate('explore')}>
          railjoy.
        </a>
        <p>A little curiosity. A window seat. A world to explore.</p>
        <span>Railjoy · First edition</span>
      </footer>
      <div
        className="status-toast"
        role="status"
        aria-live="polite"
        key={notice}
      >
        {notice}
      </div>
      <dialog
        aria-labelledby="journey-dialog-title"
        ref={dialog}
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
      >
        {selected && (
          <div className="dialog-content">
            <button
              className="dialog-close"
              aria-label="Close journey details"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <Landscape scene={selected.scene} />
            <div className="dialog-copy">
              <p className="eyebrow">
                {selected.country} · {selected.theme}
              </p>
              <h2 id="journey-dialog-title">
                {selected.from} → {selected.to}
              </h2>
              <p>{selected.description}</p>
              <p className="duration-detail">
                <Icon name="train" /> Sample journey · About{' '}
                {durationLabel(selected.duration)}
              </p>
              <div className="detail-note">
                This is an inspiration preview, not a travel offer. Routes and
                durations are illustrative; check current services with the rail
                operator before making travel plans.
              </div>
              <button
                className="primary-button"
                onClick={() => toggleSaved(selected)}
              >
                <Icon name="heart" filled={saved.includes(selected.id)} />
                {saved.includes(selected.id)
                  ? 'Remove from my journeys'
                  : 'Save this journey'}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
