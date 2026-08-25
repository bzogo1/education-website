document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mousemove", ({ clientX, clientY }) => {
    const { left, top } = card.getBoundingClientRect();
    card.style.setProperty("--x", `${clientX - left}px`);
    card.style.setProperty("--y", `${clientY - top}px`);
  });
});
