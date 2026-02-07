const params = new URLSearchParams(window.location.search);
const selectedEvent = params.get("event") || "Neon Nights Festival";

const eventTitle = document.getElementById("eventTitle");
const eventMeta = document.getElementById("eventMeta");
if (eventTitle && eventMeta) {
  eventTitle.textContent = selectedEvent;
  eventMeta.textContent = `Featuring top artists • Live at premium venue • Book your plan now.`;
}

const bookingForm = document.getElementById("bookingForm");
if (bookingForm && eventTitle) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const plan = document.getElementById("planSelect")?.value || "Standard";
    window.location.href = `confirmation.html?event=${encodeURIComponent(selectedEvent)}&plan=${encodeURIComponent(plan)}`;
  });
}

const confirmText = document.getElementById("confirmText");
if (confirmText) {
  const plan = params.get("plan") || "Standard";
  confirmText.textContent = `Your ${plan} ticket for ${selectedEvent} is confirmed. E-ticket sent to your email.`;
}

const searchInput = document.getElementById("searchInput");
const planFilter = document.getElementById("planFilter");
const femaleFilter = document.getElementById("femaleFilter");
const cards = Array.from(document.querySelectorAll(".event-card"));

function filterCards() {
  const query = (searchInput?.value || "").toLowerCase().trim();
  const plan = planFilter?.value || "all";
  const female = femaleFilter?.value || "all";

  cards.forEach((card) => {
    const searchable = [
      card.dataset.name,
      card.dataset.artist,
      card.dataset.city,
      card.dataset.venue,
      card.dataset.plan,
      card.dataset.female
    ].join(" ").toLowerCase();

    const matchQuery = query === "" || searchable.includes(query);
    const matchPlan = plan === "all" || card.dataset.plan === plan;
    const matchFemale = female === "all" || card.dataset.female === female;

    card.style.display = matchQuery && matchPlan && matchFemale ? "block" : "none";
  });
}

[searchInput, planFilter, femaleFilter].forEach((node) => {
  if (!node) return;
  node.addEventListener("input", filterCards);
  node.addEventListener("change", filterCards);
});
filterCards();
