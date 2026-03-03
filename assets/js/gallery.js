document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("gallery-container");

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("closeBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  const filterButtons = document.querySelectorAll(".filter-btn");

  let images = [];
  let currentIndex = 0;

  // --- Підвантаження JSON ---
  fetch("../assets/data/gallery.json")
    .then(response => response.json())
    .then(data => {

      data.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("gallery-item");

        // додаємо категорію для фільтрів
        card.dataset.category = item.category;

        card.innerHTML = `
          <img src="${item.image}" loading="lazy">
        `;

        container.appendChild(card);
      });

      // Отримуємо картинки після створення
      images = document.querySelectorAll("#gallery-container img");

      initFilters();    // фільтри
      initLightbox();   // лайтбокс
    });

  // --- Фільтри ---
  function initFilters() {

    filterButtons.forEach(button => {
      button.addEventListener("click", () => {

        const filter = button.dataset.filter;
        const galleryItems = document.querySelectorAll(".gallery-item");

        // активна кнопка
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        galleryItems.forEach(item => {
          if (filter === "all" || item.dataset.category === filter) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });

      });
    });
  }

  // --- Лайтбокс ---
  function initLightbox() {

    images.forEach((img, index) => {
      img.addEventListener("click", () => {
        currentIndex = index;
        showImage(currentIndex);
        lightbox.style.display = "flex";
      });
    });

    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(currentIndex);
    });

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
    });

    closeBtn.addEventListener("click", closeLightbox);

    // клік на фон
    lightbox.addEventListener("click", function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // клавіатура
    document.addEventListener("keydown", function(e) {
      if (lightbox.style.display !== "flex") return;

      if (e.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
      }
      if (e.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
      }
      if (e.key === "Escape") {
        closeLightbox();
      }
    });

    // swipe для мобільного
    let startX = 0;
    let endX = 0;

    lightbox.addEventListener("touchstart", function(e) {
      startX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener("touchend", function(e) {
      endX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      let diff = startX - endX;
      if (Math.abs(diff) < 50) return;

      if (diff > 0) {
        currentIndex = (currentIndex + 1) % images.length;
      } else {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
      }

      showImage(currentIndex);
    }
  }

  function showImage(index) {
    lightboxImg.src = images[index].src;
  }

  function closeLightbox() {
    lightbox.style.display = "none";
  }

});