const modal = document.getElementById("bookingModal");
const closeModalBtn = document.getElementById("closeModal");
const bookingForm = document.getElementById("bookingForm");
const successMsg = document.getElementById("successMsg");
const selectedEventText = document.getElementById("selectedEventText");
const scrollProgress = document.getElementById("scrollProgress");
const cursorGlow = document.getElementById("cursorGlow");

const openBookingButtons = [
  document.getElementById("openBooking"),
  document.getElementById("heroBook"),
  ...document.querySelectorAll(".book-btn"),
  ...document.querySelectorAll("[data-event]")
].filter(Boolean);

function openModal(eventName = "General Admission") {
  selectedEventText.textContent = `Event: ${eventName}`;
  successMsg.hidden = true;
  bookingForm.reset();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

openBookingButtons.forEach((node) => {
  node.addEventListener("click", () => {
    const card = node.closest?.("[data-event]") || node;
    const eventName = node.dataset?.event || card?.dataset?.event || "General Admission";
    openModal(eventName);
  });
});

closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  successMsg.hidden = false;
});

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
revealItems.forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target || 0);
    const duration = 1000;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = `${Math.floor(progress * target)}`;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = `${target}`;
    }

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll(".stat-value").forEach((counter) => counterObserver.observe(counter));

const tiltCards = document.querySelectorAll(".tilt");
tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
});

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollProgress.style.width = `${ratio}%`;
}
window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

window.addEventListener("pointermove", (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});
