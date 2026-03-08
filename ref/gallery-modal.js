const galleryImages = [
  "./assets/images/card-sample-01.svg",
  "./assets/images/card-sample-02.svg",
  "./assets/images/card-sample-03.svg",
  "./assets/images/card-sample-04.svg",
  "./assets/images/card-sample-05.svg",
  "./assets/images/card-sample-06.svg",
  "./assets/images/card-sample-07.svg",
  "./assets/images/card-sample-08.svg",
  "./assets/images/card-sample-09.svg",
  "./assets/images/card-sample-10.svg",
  "./assets/images/card-sample-11.svg",
  "./assets/images/card-sample-12.svg",
  "./assets/images/section-rsvp.svg",
  "./assets/images/section-share.svg",
  "./assets/images/section-guestbook.svg",
  "./assets/images/phone-mockup-01.svg",
  "./assets/images/phone-mockup-02.svg",
  "./assets/images/review-avatar-01.svg",
];

const thumbGrid = document.getElementById("thumbGrid");
const modal = document.getElementById("zoomModal");
const modalInner = document.querySelector("#zoomModal .inner");
const zoomImage = document.getElementById("zoomImage");
const prevBtn = document.getElementById("zoomPrev");
const nextBtn = document.getElementById("zoomNext");
const closeBtn = document.getElementById("zoomClose");
const currentNode = document.getElementById("currentIndex");
const totalNode = document.getElementById("totalCount");

let currentIndex = 0;

function renderThumbs() {
  const fragment = document.createDocumentFragment();

  galleryImages.forEach((src, idx) => {
    const button = document.createElement("button");
    button.className = "thumb";
    button.type = "button";
    button.setAttribute("aria-label", `사진 ${idx + 1} 크게 보기`);

    const img = document.createElement("img");
    img.src = src;
    img.loading = "lazy";
    img.alt = `갤러리 썸네일 ${idx + 1}`;

    button.appendChild(img);
    button.addEventListener("click", () => openModal(idx));
    fragment.appendChild(button);
  });

  thumbGrid.appendChild(fragment);
  totalNode.textContent = String(galleryImages.length);
}

function renderCurrentImage() {
  zoomImage.src = galleryImages[currentIndex];
  currentNode.textContent = String(currentIndex + 1);
}

function openModal(index) {
  currentIndex = index;
  renderCurrentImage();

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function move(step) {
  currentIndex = (currentIndex + step + galleryImages.length) % galleryImages.length;
  renderCurrentImage();
}

prevBtn.addEventListener("click", () => move(-1));
nextBtn.addEventListener("click", () => move(1));
closeBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (!modalInner.contains(event.target)) {
    closeModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (!modal.classList.contains("open")) {
    return;
  }
  if (event.key === "Escape") {
    closeModal();
  } else if (event.key === "ArrowLeft") {
    move(-1);
  } else if (event.key === "ArrowRight") {
    move(1);
  }
});

renderThumbs();
