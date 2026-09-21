import { useState } from 'react';
import Discovery from './Discovery';
import './search.css';

function localDate() {
  const d = new Date();
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
export default function App() {
  const [explore, setExplore] = useState(false);
  const [trip, setTrip] = useState('one-way');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [out, setOut] = useState(localDate);
  const [back, setBack] = useState('');
  const [dateOpen, setDateOpen] = useState(false);
  const [passengersOpen, setPassengersOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [railcard, setRailcard] = useState('None');
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [genius, setGenius] = useState(true);
  const [message, setMessage] = useState('');
  const dateLabel = (value: string) =>
    value
      ? new Date(value).toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }) +
        ' • ' +
        new Date(value).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Choose return';
  if (explore)
    return (
      <>
        <button className="back-search" onClick={() => setExplore(false)}>
          ← Back to ticket search
        </button>
        <Discovery />
      </>
    );
  return (
    <main className="ticket-page" id="journeys">
      <h1 className="sr-only">Railjoy train ticket search</h1>
      <form
        className="ticket-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
            setMessage('Choose different departure and arrival stations.');
            return;
          }
          if (new Date(out).getTime() < Date.now() - 60000) {
            setMessage('Choose a future departure time.');
            return;
          }
          if (trip === 'return' && (!back || back < out)) {
            setDateOpen(true);
            setMessage('Choose a return date after your outward journey.');
            return;
          }
          setMessage(
            `Search prepared: ${from.trim()} → ${to.trim()}, ${dateLabel(out)}${trip === 'return' ? `; return ${dateLabel(back)}` : ''}, ${adults} ${adults === 1 ? 'adult' : 'adults'}. Live fares and booking are not connected yet. No tickets or hotel reservations have been made.`,
          );
        }}
      >
        <div className="stations">
          <label>
            <span>From</span>
            <input
              aria-label="From city or station"
              required
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="City or station"
            />
          </label>
          <label>
            <span>To</span>
            <input
              aria-label="To city or station"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="City or station"
            />
          </label>
        </div>
        <div className="trip-toggle" aria-label="Journey type">
          <button
            type="button"
            aria-pressed={trip === 'one-way'}
            onClick={() => setTrip('one-way')}
          >
            One-way
          </button>
          <button
            type="button"
            aria-pressed={trip === 'return'}
            onClick={() => setTrip('return')}
          >
            Return
          </button>
        </div>
        <button
          className="date-row"
          type="button"
          aria-expanded={dateOpen}
          onClick={() => setDateOpen(!dateOpen)}
        >
          <span>Out</span>
          <strong>{dateLabel(out)}</strong>
        </button>
        {trip === 'return' && (
          <button
            className="date-row return-row"
            type="button"
            onClick={() => setDateOpen(true)}
          >
            <span>Back</span>
            <strong>{dateLabel(back)}</strong>
          </button>
        )}
        {dateOpen && (
          <div className="form-panel">
            <label>
              Departure
              <input
                type="datetime-local"
                required
                value={out}
                onChange={(e) => setOut(e.target.value)}
              />
            </label>
            {trip === 'return' && (
              <label>
                Return
                <input
                  type="datetime-local"
                  required
                  min={out}
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                />
              </label>
            )}
            <button type="button" onClick={() => setDateOpen(false)}>
              Done
            </button>
          </div>
        )}
        <button
          className="passenger-row"
          type="button"
          aria-expanded={passengersOpen}
          onClick={() => setPassengersOpen(!passengersOpen)}
        >
          <svg
            viewBox="0 0 32 36"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="20" cy="10" r="7" />
            <path d="M17 10q3 4 6 0M12 35V25q0-5 5-5h7q5 0 5 5v10ZM10 4C2 4 2 16 9 16M9 22H7q-5 0-5 5v8h6" />
          </svg>
          <span>
            <strong>
              {adults} {adults === 1 ? 'Adult' : 'Adults'} (26–59)
            </strong>
            <small>{railcard === 'None' ? 'Add railcards' : railcard}</small>
          </span>
          <span className="chevron">›</span>
        </button>
        {passengersOpen && (
          <div className="form-panel">
            <label>
              Adults (26–59)
              <input
                type="number"
                min="1"
                max="9"
                value={adults}
                onChange={(e) =>
                  setAdults(
                    Math.max(1, Math.min(9, Number(e.target.value) || 1)),
                  )
                }
              />
            </label>
            <label>
              Railcard
              <select
                value={railcard}
                onChange={(e) => setRailcard(e.target.value)}
              >
                <option>None</option>
                <option>26–30 Railcard</option>
                <option>Two Together Railcard</option>
                <option>Disabled Persons Railcard</option>
              </select>
            </label>
            <button type="button" onClick={() => setPassengersOpen(false)}>
              Done
            </button>
          </div>
        )}
        <button
          className="voucher-link"
          type="button"
          aria-expanded={voucherOpen}
          onClick={() => setVoucherOpen(!voucherOpen)}
        >
          <span aria-hidden="true">{voucherOpen ? '−' : '+'}</span> Add a
          voucher code
        </button>
        {voucherOpen && (
          <label className="form-panel voucher-input">
            Voucher code
            <input placeholder="Enter code" />
            <small>
              Voucher eligibility will be checked when booking becomes
              available.
            </small>
          </label>
        )}
        <div className="genius-row">
          <label>
            <input
              type="checkbox"
              checked={genius}
              onChange={(e) => setGenius(e.target.checked)}
            />
            <span>
              Get up to 20% off stays
              <br />
              with Genius
            </span>
          </label>
          <span className="booking-badge">Booking.com</span>
        </div>
        <button className="find-tickets" type="submit">
          Find cheap tickets
        </button>
        {message && (
          <p className="search-message" role="status">
            {message}
          </p>
        )}
      </form>
      <div className="search-footer">
        <a href="#journeys" aria-label="Railjoy home">
          railjoy.
        </a>
        <p>
          Interface preview · Live fares, vouchers and hotel offers are not
          connected.
        </p>
        <button onClick={() => setExplore(true)}>
          Explore sample routes & saved journeys →
        </button>
      </div>
    </main>
  );
}
