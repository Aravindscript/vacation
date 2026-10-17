import React, { useState } from "react";
import "./App.css";

const adventures = {
  kayaking: {
    id: "kayaking",
    name: "Kayaking",
    price: 3299,
    duration: "4hrs",
    location: "Azure Beach, India",
    description: "Explore turquoise waters and discover the coastline.",
    background: "/images/sea.jpg",
    layers: [
      { src: "/images/water.png", className: "layer-water", alt: "Ocean water" },
      { src: "/images/rock.png", className: "layer-rock", alt: "Coastal rock" },
      { src: "/images/boat.png", className: "layer-boat", alt: "Kayak boat" },
    ],
  },
  camping: {
    id: "camping",
    name: "Camping",
    price: 2499,
    duration: "8hrs",
    location: "Pine Valley, India",
    description: "Enjoy a peaceful night surrounded by nature.",
    background: "/images/grass.jpg",
    layers: [
      { src: "/images/rock.png", className: "layer-camp-rock", alt: "Mossy rock" },
      { src: "/images/tree.png", className: "layer-tree", alt: "Forest tree" },
      { src: "/images/tent.png", className: "layer-tent", alt: "Camping tent" },
    ],
  },
};

function ExperienceCard({ adventure, onChooseDate }) {
  return (
    <article className={`experience-card ${adventure.id}-card`}>
      <div className="scene">
        <div className="scene-background">
          <img src={adventure.background} alt="" />
        </div>
        <div className="scene-shade" />

        {adventure.layers.map((layer) => (
          <img
            key={layer.className}
            src={layer.src}
            className={`scene-layer ${layer.className}`}
            alt={layer.alt}
            draggable="false"
          />
        ))}

        <span className="scene-label">
          {adventure.id === "kayaking" ? "01" : "02"} / EXPERIENCE
        </span>
      </div>

      <div className="card-content">
        <span className="card-category">
          {adventure.id === "kayaking" ? "WATER ADVENTURE" : "NATURE ESCAPE"}
        </span>
        <h1>{adventure.name}</h1>
        <div className="price-line">
          <strong>₹{adventure.price.toLocaleString("en-IN")}</strong>
          <span>/ {adventure.duration}</span>
        </div>
        <span className="per-person">per person</span>
        <p className="card-location">⌖ &nbsp;{adventure.location}</p>
        <p className="card-description">{adventure.description}</p>
        <button className="choose-date-main" onClick={() => onChooseDate(adventure.id)}>
          Choose Date
        </button>
      </div>
    </article>
  );
}

function BookingDetails({ bookings, onChooseDate }) {
  const total = Object.values(bookings).reduce(
    (sum, booking) => sum + (booking.date ? booking.price : 0),
    0
  );

  return (
    <aside className="booking-panel">
      <h2 className="panel-title">▤ &nbsp;Booking Details</h2>

      {Object.values(bookings).map((booking) => (
        <div className="booking-item" key={booking.id}>
          <div className="booking-item-top">
            <strong>
              {booking.id === "kayaking" ? "🌊" : "🏕️"} {booking.name}
            </strong>
            <strong>₹{booking.price.toLocaleString("en-IN")}</strong>
          </div>
          <div className="booking-item-bottom">
            <span className={booking.date ? "booked-status" : ""}>
              {booking.date ? `Booked · ${booking.date}` : "Not Booked"}
            </span>
            <button onClick={() => onChooseDate(booking.id)}>
              {booking.date ? "Change Date" : "Choose Date"}
            </button>
          </div>
        </div>
      ))}

      <div className="payable-row">
        <span>Total Payable</span>
        <strong>₹{total.toLocaleString("en-IN")}</strong>
      </div>
      <p className="panel-note">Choose a date for each experience you want to book.</p>
    </aside>
  );
}

function DateModal({ type, onClose, onConfirm }) {
  const adventure = adventures[type];
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  function quickDate(days) {
    const chosen = new Date();
    chosen.setDate(chosen.getDate() + days);
    setDate([
      chosen.getFullYear(),
      String(chosen.getMonth() + 1).padStart(2, "0"),
      String(chosen.getDate()).padStart(2, "0"),
    ].join("-"));
  }

  function submit() {
    if (!date) return;
    onConfirm({
      id: adventure.id,
      name: adventure.name,
      price: adventure.price * guests,
      date,
      guests,
    });
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="date-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="date-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" aria-label="Close" onClick={onClose}>×</button>
        <span className="modal-eyebrow">PLAN YOUR ESCAPE</span>
        <h2 id="date-modal-title">Choose Date</h2>
        <p className="modal-subtitle">Select a date for your {adventure.name.toLowerCase()} adventure.</p>

        <label className="date-label" htmlFor="adventure-date">Booking date</label>
        <input
          id="adventure-date"
          className="date-input"
          type="date"
          min={minDate}
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />

        <div className="quick-dates">
          <button onClick={() => quickDate(1)}>Tomorrow</button>
          <button onClick={() => quickDate(2)}>In 2 days</button>
          <button onClick={() => quickDate(7)}>In 1 week</button>
        </div>

        <div className="guest-select-row">
          <span>Guests</span>
          <div className="guest-control">
            <button disabled={guests <= 1} onClick={() => setGuests((g) => Math.max(1, g - 1))}>−</button>
            <strong>{guests}</strong>
            <button disabled={guests >= 12} onClick={() => setGuests((g) => Math.min(12, g + 1))}>+</button>
          </div>
        </div>

        <div className="modal-total">
          <span>Estimated total</span>
          <strong>₹{(adventure.price * guests).toLocaleString("en-IN")}</strong>
        </div>

        <button className="confirm-button" onClick={submit} disabled={!date}>
          Confirm Booking <span>↗</span>
        </button>
      </section>
    </div>
  );
}

function ConfirmationModal({ booking, onClose }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="date-modal confirmation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="success-icon">✓</div>
        <span className="modal-eyebrow">YOUR ADVENTURE AWAITS</span>
        <h2 id="confirmation-title">Booking Confirmed</h2>
        <p className="modal-subtitle">{booking.name} has been added to your booking details.</p>
        <div className="confirmation-row"><span>Date</span><strong>{booking.date}</strong></div>
        <div className="confirmation-row"><span>Guests</span><strong>{booking.guests}</strong></div>
        <div className="confirmation-row"><span>Total</span><strong>₹{booking.price.toLocaleString("en-IN")}</strong></div>
        <p className="demo-note">Demo only — no real reservation or payment has been made.</p>
        <button className="confirm-button" onClick={onClose}>Done ✓</button>
      </section>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("kayaking");
  const [modalType, setModalType] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [bookings, setBookings] = useState({
    kayaking: { ...adventures.kayaking, date: null, guests: 1 },
    camping: { ...adventures.camping, date: null, guests: 1 },
  });

  function saveBooking(booking) {
    setBookings((current) => ({
      ...current,
      [booking.id]: {
        ...current[booking.id],
        date: booking.date,
        guests: booking.guests,
        price: adventures[booking.id].price * booking.guests,
      },
    }));
    setModalType(null);
    setConfirmation(booking);
  }

  return (
    <main className="app-shell">
      <header className="navbar">
        <a className="brand" href="#" aria-label="Drift home">drift<span>.</span></a>
        <span className="nav-caption">FIND YOUR OUTDOOR ESCAPE</span>
        <button className="nav-book-button" onClick={() => setModalType(active)}>Book now ↗</button>
      </header>

      <section className="main-layout">
        <div className="experiences">
          <div className="experience-tabs" role="tablist" aria-label="Experiences">
            <button
              role="tab"
              aria-selected={active === "kayaking"}
              className={active === "kayaking" ? "active" : ""}
              onClick={() => setActive("kayaking")}
            >KAYAKING</button>
            <button
              role="tab"
              aria-selected={active === "camping"}
              className={active === "camping" ? "active" : ""}
              onClick={() => setActive("camping")}
            >CAMPING</button>
          </div>

          <div className="card-stage" key={active}>
            <ExperienceCard
              adventure={adventures[active]}
              onChooseDate={setModalType}
            />
          </div>
        </div>

        <BookingDetails bookings={bookings} onChooseDate={setModalType} />
      </section>

      <footer className="footer">
        <span>DRIFT® — OUTDOOR EXPERIENCES</span>
        <span>FIND YOUR OWN WAY.</span>
      </footer>

      {modalType && (
        <DateModal
          key={modalType}
          type={modalType}
          onClose={() => setModalType(null)}
          onConfirm={saveBooking}
        />
      )}

      {confirmation && (
        <ConfirmationModal
          booking={confirmation}
          onClose={() => setConfirmation(null)}
        />
      )}
    </main>
  );
}
