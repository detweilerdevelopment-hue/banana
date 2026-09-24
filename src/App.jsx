import { useEffect, useState } from "react";
const items = [
  [
    "original",
    "individual",
    "Original Banana",
    "Vanilla pudding, fresh bananas, and vanilla wafers.",
    8,
    "Signature",
    "classic-pudding.png",
  ],
  [
    "chocolate",
    "individual",
    "Chocolate Cream",
    "Chocolate pudding, banana, and cocoa crumble.",
    9,
    "Chocolate",
    "chocolate-pudding.png",
  ],
  [
    "peach",
    "individual",
    "Peach Cobbler",
    "Vanilla pudding, cinnamon peaches, and crumble.",
    9,
    "Seasonal",
    "peach-pudding.png",
  ],
  [
    "party",
    "party",
    "Classic Party Pan",
    "Our original pudding in a generous pan for 10–12.",
    58,
    "Serves 10–12",
    "banana-pudding-hero.png",
  ],
].map(([id, category, name, description, price, tag, image]) => ({
  id,
  category,
  name,
  description,
  price,
  tag,
  image,
}));
const money = (x) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    x,
  );
const minimumDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
export default function App() {
  const [filter, setFilter] = useState("all"),
    [cart, setCart] = useState([]),
    [drawer, setDrawer] = useState(false),
    [method, setMethod] = useState("pickup"),
    [date, setDate] = useState(minimumDate()),
    [note, setNote] = useState(""),
    [toast, setToast] = useState(""),
    [hasScrolled, setHasScrolled] = useState(false);
  useEffect(() => {
    const updateScrollState = () => setHasScrolled(window.scrollY > 260);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);
  const visible =
      filter === "all" ? items : items.filter((x) => x.category === filter),
    total = cart.reduce((s, x) => s + x.price * x.quantity, 0),
    count = cart.reduce((s, x) => s + x.quantity, 0);
  const flash = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 2000);
  };
  const add = (p) => {
    setCart((c) => {
      const found = c.find((x) => x.id === p.id);
      return found
        ? c.map((x) => (x.id === p.id ? { ...x, quantity: x.quantity + 1 } : x))
        : [...c, { ...p, quantity: 1 }];
    });
    flash(`${p.name} added to your bag`);
  };
  return (
    <>
      <div className="bar">
        MADE FRESH TO ORDER <span>•</span> NEXT-DAY PICKUP AVAILABLE
      </div>
      <header>
        <a href="#top" className="logo">
          GOLDEN <i>SPOON</i>
        </a>
        <nav>
          <a href="#shop">Shop</a>
          <a href="#story">Our story</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div>
          <a className="phone" href="tel:+15551234567">
            (555) 123-4567
          </a>
          <button className="bag" onClick={() => setDrawer(true)}>
            Bag <b>{count}</b>
          </button>
        </div>
      </header>
      <button className={hasScrolled ? "floating-bag visible" : "floating-bag"} onClick={() => setDrawer(true)} aria-label={`Open bag with ${count} items`}>
        <span>Bag</span><b>{count}</b>
      </button>
      <main id="top">
        <section className="hero">
          <div>
            <p className="eyebrow">SMALL-BATCH BANANA PUDDING</p>
            <h1>
              Comfort food,
              <br />
              <em>made beautifully.</em>
            </h1>
            <p>
              Classic banana pudding made fresh with real ingredients. Available
              for everyday treats, gatherings, and celebrations.
            </p>
            <a className="btn dark" href="#shop">
              Order pudding →
            </a>
            <small>Serving the greater Nashville area</small>
          </div>
          <img
            src="/images/banana-pudding-hero.png"
            alt="Fresh banana pudding"
          />
        </section>
        <section className="benefits">
          <span>Made fresh daily</span>
          <span>Local pickup & delivery</span>
          <span>Preorders welcome</span>
        </section>
        <section className="methods">
          <div>
            <p className="eyebrow">BEFORE YOU ORDER</p>
            <h2>How would you like it?</h2>
          </div>
          <div className="method-list">
            {[
              ["pickup", "Pickup", "Ready tomorrow"],
              ["delivery", "Local delivery", "Available in Nashville"],
              ["party", "Party order", "48 hours notice"],
            ].map(([id, label, sub], i) => (
              <button
                key={id}
                onClick={() => {
                  setMethod(id);
                  setFilter(id === "party" ? "party" : "individual");
                  document.querySelector("#shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  flash(`${label} selected`);
                }}
                className={method === id ? "selected" : ""}
              >
                <span>0{i + 1}</span>
                <b>{label}</b>
                <small>{sub}</small>
              </button>
            ))}
          </div>
        </section>
        <section id="shop" className="shop">
          <div className="heading">
            <div>
              <p className="eyebrow">ORDER ONLINE</p>
              <h2>
                Choose your <em>favorite.</em>
              </h2>
            </div>
            <p>
              Thoughtfully made desserts for everyday moments and special
              occasions.
            </p>
          </div>
          <div className="filters">
            <p>
              {filter === "party"
                ? "Party pans require 48 hours notice."
                : filter === "individual"
                  ? "Individual cups are available for next-day pickup."
                  : "All items are made fresh to order."}
            </p>
            <div>
              {[
                ["all", "All treats"],
                ["individual", "Individual"],
                ["party", "Party size"],
              ].map(([id, label]) => (
                <button
                  onClick={() => setFilter(id)}
                  className={filter === id ? "active" : ""}
                  key={id}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid">
            {visible.map((p) => (
              <article className="product" key={p.id}>
                <div>
                  <img src={`/images/${p.image}`} alt={p.name} />
                  <span>{p.tag}</span>
                </div>
                <section>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <footer>
                    <b>
                      {p.category === "party"
                        ? money(p.price)
                        : `from ${money(p.price)}`}
                    </b>
                    <button onClick={() => add(p)}>Add +</button>
                  </footer>
                </section>
              </article>
            ))}
          </div>
          <small className="allergy">
            Please let us know about allergies or special requests at checkout.
            Our kitchen handles dairy, eggs, wheat, and nuts.
          </small>
        </section>
        <section className="party">
          <p className="eyebrow">FOR GATHERINGS</p>
          <h2>
            Dessert for the <em>whole table.</em>
          </h2>
          <p>
            Party pans serve 10–12 and are ideal for birthdays, office lunches,
            and everything in between.
          </p>
          <button
            className="btn"
            onClick={() => {
              setFilter("party");
              document
                .querySelector("#shop")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            View party pans →
          </button>
        </section>
        <section id="story" className="story">
          <img
            src="/images/banana-pudding-hero.png"
            alt="Banana pudding made fresh"
          />
          <div>
            <p className="eyebrow">OUR STORY</p>
            <h2>
              Simple ingredients.
              <br />
              <em>Exceptional comfort.</em>
            </h2>
            <p>
              Golden Spoon began with a love for the classic banana pudding we
              grew up enjoying. We make every batch with care, using quality
              ingredients and a recipe that lets each one shine.
            </p>
            <a href="sms:+15551234567">Ask about catering →</a>
          </div>
        </section>
        <section id="faq" className="faq">
          <p className="eyebrow">NEED TO KNOW</p>
          <h2>Questions, answered.</h2>
          {[
            [
              "How far ahead should I order?",
              "Individual cups are available for next-day pickup. Party pans need 48 hours notice.",
            ],
            [
              "Do you offer delivery?",
              "Yes. Choose local delivery and add your address in the order notes.",
            ],
            [
              "Can I customize an order?",
              "Absolutely. Add notes at checkout or text us before placing your order.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
      </main>
      <footer className="site-footer">
        <div className="logo">
          GOLDEN <i>SPOON</i>
        </div>
        <p>Made with care in Nashville, TN.</p>
        <div>
          <a href="sms:+15551234567">Text us</a>
          <a href="tel:+15551234567">Call us</a>
        </div>
      </footer>
      <div
        className={drawer ? "backdrop show" : "backdrop"}
        onClick={() => setDrawer(false)}
      />
      <aside className={drawer ? "cart show" : "cart"}>
        <div className="cart-title">
          <h2>Your order</h2>
          <button onClick={() => setDrawer(false)}>×</button>
        </div>
        <div className="cart-list">
          {cart.length ? (
            cart.map((x) => (
              <div className="cart-row" key={x.id}>
                <span>
                  <b>{x.name}</b>
                  <small>
                    {money(x.price)} × {x.quantity}
                  </small>
                </span>
                <button
                  onClick={() => setCart((c) => c.filter((y) => y.id !== x.id))}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>Your bag is ready for something sweet.</p>
          )}
        </div>
        <div className="checkout">
          <label>
            Fulfillment
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="pickup">Pickup</option>
              <option value="delivery">Local delivery</option>
              <option value="party">Party order</option>
            </select>
          </label>
          <label>
            Pickup / delivery date
            <input
              type="date"
              min={minimumDate()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label>
            Special requests
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Allergies, delivery notes, or requests..."
            />
          </label>
          <strong>
            Total <span>{money(total)}</span>
          </strong>
          <button
            className="btn dark checkout-btn"
            onClick={() =>
              cart.length && date
                ? flash(
                    "Order saved. Connect Stripe or Square for live payments.",
                  )
                : flash("Add a pudding and select a date first.")
            }
          >
            Secure checkout →
          </button>
        </div>
      </aside>
      <div className={toast ? "toast visible" : "toast"}>{toast}</div>
    </>
  );
}
