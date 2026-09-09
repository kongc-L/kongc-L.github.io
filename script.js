const artworks = [
  {
    image: "images/1.png",
    alt: "粉色头发、身穿黑白女仆服的角色肖像",
    kicker: "ROSE ETIQUETTE",
    title: "玫瑰礼序",
    description: "温柔外表之下，藏着一枚闪着金色光泽的勋章。",
  },
  {
    image: "images/2.png",
    alt: "戴着墨镜、身穿蓝白服装的蓝发角色",
    kicker: "BUBBLE SUMMER",
    title: "夏日气泡",
    description: "一只墨镜，一点海风，还有不想融化的好心情。",
  },
  {
    image: "images/3.png",
    alt: "坐在地面、背着大型武器的白发角色",
    kicker: "AFTERNOON IDLE",
    title: "午后待机",
    description: "安静坐下来的时刻，也可以拥有自己的战斗力。",
  },
];

const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxKicker = document.querySelector("#lightbox-kicker");
const lightboxTitle = document.querySelector("#lightbox-title");
const lightboxDescription = document.querySelector("#lightbox-description");
const lightboxCount = document.querySelector(".lightbox-count");
const artButtons = document.querySelectorAll(".art-button");
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");
let currentIndex = 0;
let lastFocusedElement = null;

function renderArtwork(index) {
  currentIndex = (index + artworks.length) % artworks.length;
  const artwork = artworks[currentIndex];
  lightboxImage.src = artwork.image;
  lightboxImage.alt = artwork.alt;
  lightboxKicker.textContent = artwork.kicker;
  lightboxTitle.textContent = artwork.title;
  lightboxDescription.textContent = artwork.description;
  lightboxCount.textContent = String(currentIndex + 1).padStart(2, "0") + " / 03";
}

function openLightbox(index) {
  lastFocusedElement = document.activeElement;
  renderArtwork(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  document.querySelector(".lightbox-close").focus();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
  if (lastFocusedElement) lastFocusedElement.focus();
}

artButtons.forEach((button) => {
  button.addEventListener("click", () => openLightbox(Number(button.dataset.index)));
});

document.querySelectorAll("[data-close]").forEach((element) => {
  element.addEventListener("click", closeLightbox);
});

document.querySelector("[data-prev]").addEventListener("click", () => renderArtwork(currentIndex - 1));
document.querySelector("[data-next]").addEventListener("click", () => renderArtwork(currentIndex + 1));

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("is-open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") renderArtwork(currentIndex - 1);
  if (event.key === "ArrowRight") renderArtwork(currentIndex + 1);
});

menuButton.addEventListener("click", () => {
  const isVisible = navLinks.classList.toggle("is-visible");
  menuButton.setAttribute("aria-expanded", String(isVisible));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-visible");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const carouselItems = [
  ["第二把赤霄", "#决战#"],
  ["笔记", "#企鹅物流的秘密#"],
  ["安洁莉娜", "#信使#"],
  ["莱茵生命", "#科研#"],
  ["端午", "#炎国水乡#"],
  ["龙门", "#邻街一角#"],
  ["谜团", "#源石#"],
  ["启航", "#任务外出#"],
  ["企鹅物流", "#办公室#"],
  ["启示", "#大厅#"],
  ["死灰复燃", "#不死的黑蛇#"],
  ["苏醒", "#石棺之间#"],
  ["乌萨斯学生自治团", "#回忆中的教室#"],
  ["瑕光", "#胜利的荣光#"],
  ["谢拉格", "#喀兰贸易#"],
  ["预备组", "#行动预备组A4#"],
  ["整装出发", "#印象图#"],
  ["追忆", "#过去的村庄#"],
];

const carouselRoot = document.querySelector(".parallax-carousel");
const carouselView = document.querySelector("#carousel-view");
const carouselFront = document.querySelector(".carousel-front");
const carouselRail = document.querySelector(".carousel-rail");
const carouselMarkers = document.querySelector(".carousel-markers");
const carouselLayers = document.querySelectorAll(".carousel-main-image");
const carouselSerial = document.querySelector(".carousel-serial");
const carouselTitle = document.querySelector(".carousel-title");
const carouselDetail = document.querySelector(".carousel-detail");
const carouselPrev = document.querySelector(".carousel-arrow-prev");
const carouselNext = document.querySelector(".carousel-arrow-next");
const carouselScrollNote = document.querySelector(".carousel-scroll-note");
const particleCanvas = document.querySelector(".carousel-particles");
let carouselIndex = 0;
let carouselLayerIndex = 0;
let carouselTouchStartX = 0;

function carouselImage(index) {
  return "carousel-images/carousel_" + String(index + 1) + ".png";
}

function buildCarouselControls() {
  carouselItems.forEach((item, index) => {
    const marker = document.createElement("button");
    marker.className = "carousel-marker";
    marker.type = "button";
    marker.dataset.index = String(index);
    marker.setAttribute("aria-label", "查看第 " + String(index + 1) + " 张作品：" + item[0]);
    marker.addEventListener("click", () => switchCarousel(index));
    carouselMarkers.appendChild(marker);

    const thumb = document.createElement("button");
    thumb.className = "carousel-thumb";
    thumb.type = "button";
    thumb.dataset.index = String(index);
    thumb.setAttribute("aria-label", "查看第 " + String(index + 1) + " 张作品：" + item[0]);
    thumb.innerHTML = '<span class="carousel-thumb-image"></span><span class="carousel-thumb-label">' + item[0] + "</span>";
    thumb.querySelector(".carousel-thumb-image").style.backgroundImage = "url('" + carouselImage(index) + "')";
    thumb.addEventListener("click", () => switchCarousel(index));
    carouselRail.appendChild(thumb);
  });
}

function updateCarouselMeta(index) {
  const item = carouselItems[index];
  carouselSerial.textContent = String(index + 1).padStart(2, "0");
  carouselTitle.textContent = item[0];
  carouselDetail.textContent = item[1];
  carouselScrollNote.innerHTML = '<span></span> ' + String(index + 1).padStart(2, "0") + " — 18";
  carouselMarkers.querySelectorAll(".carousel-marker").forEach((marker, markerIndex) => {
    marker.classList.toggle("is-active", markerIndex === index);
  });
  carouselRail.querySelectorAll(".carousel-thumb").forEach((thumb, thumbIndex) => {
    thumb.classList.toggle("is-active", thumbIndex === index);
  });
}

function positionCarouselThumbs() {
  const thumbs = [...carouselRail.querySelectorAll(".carousel-thumb")];
  if (!thumbs.length) return;
  const railWidth = carouselRail.clientWidth;
  const thumbWidth = thumbs[0].getBoundingClientRect().width;
  const gap = window.innerWidth <= 800 ? 10 : 15;
  const activeLeft = Math.max(0, (railWidth - thumbWidth) / 2);

  thumbs.forEach((thumb, index) => {
    const left = activeLeft + (index - carouselIndex) * (thumbWidth + gap);
    const visible = left > -thumbWidth * 0.72 && left < railWidth - thumbWidth * 0.28;
    thumb.style.transform = "translateX(" + left + "px) scale(" + (index === carouselIndex ? "1.03" : "0.96") + ")";
    thumb.classList.toggle("is-visible", visible);
  });
}

function switchCarousel(nextIndex, direction) {
  const normalizedIndex = (nextIndex + carouselItems.length) % carouselItems.length;
  if (normalizedIndex === carouselIndex) return;
  const moveDirection = direction || (normalizedIndex > carouselIndex ? "left" : "right");
  const oldLayer = carouselLayers[carouselLayerIndex];
  carouselLayerIndex = carouselLayerIndex === 0 ? 1 : 0;
  const newLayer = carouselLayers[carouselLayerIndex];
  newLayer.style.backgroundImage = "url('" + carouselImage(normalizedIndex) + "')";
  newLayer.href = carouselImage(normalizedIndex);
  newLayer.style.transformOrigin = moveDirection === "left" ? "right bottom" : "left top";
  oldLayer.style.transformOrigin = moveDirection === "left" ? "left top" : "right bottom";
  newLayer.classList.remove("is-visible", "is-leaving");
  oldLayer.classList.remove("is-visible", "is-entering");
  newLayer.classList.add("is-entering");
  requestAnimationFrame(() => {
    newLayer.classList.add("is-visible");
    newLayer.classList.remove("is-entering");
    oldLayer.classList.add("is-leaving");
  });
  window.setTimeout(() => {
    oldLayer.classList.remove("is-leaving");
    oldLayer.style.backgroundImage = "";
  }, 560);

  carouselIndex = normalizedIndex;
  updateCarouselMeta(carouselIndex);
  positionCarouselThumbs();
}

function initializeCarousel() {
  if (!carouselRoot) return;
  buildCarouselControls();
  carouselLayers[0].style.backgroundImage = "url('" + carouselImage(0) + "')";
  carouselLayers[1].style.backgroundImage = "url('" + carouselImage(1) + "')";
  updateCarouselMeta(0);
  positionCarouselThumbs();

  carouselPrev.addEventListener("click", () => switchCarousel(carouselIndex - 1, "right"));
  carouselNext.addEventListener("click", () => switchCarousel(carouselIndex + 1, "left"));
  window.addEventListener("resize", positionCarouselThumbs);
  carouselRoot.addEventListener("touchstart", (event) => {
    carouselTouchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  carouselRoot.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - carouselTouchStartX;
    if (Math.abs(distance) > 45) switchCarousel(carouselIndex + (distance < 0 ? 1 : -1), distance < 0 ? "left" : "right");
  }, { passive: true });
}

function initializeCarouselParallax() {
  if (!carouselRoot || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let pointerInside = false;
  let animationActive = false;

  function startParallaxAnimation() {
    if (animationActive) return;
    animationActive = true;
    requestAnimationFrame(animateParallax);
  }

  carouselRoot.addEventListener("pointerenter", () => {
    pointerInside = true;
    startParallaxAnimation();
  });
  carouselRoot.addEventListener("pointerleave", () => { pointerInside = false; targetX = 0; targetY = 0; });
  carouselRoot.addEventListener("pointermove", (event) => {
    const bounds = carouselRoot.getBoundingClientRect();
    targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    startParallaxAnimation();
  });

  function animateParallax() {
    if (!pointerInside && Math.abs(currentX) < 0.01 && Math.abs(currentY) < 0.01) {
      animationActive = false;
      return;
    }
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    carouselView.style.transform = "translate3d(" + (currentX * 7) + "px, " + (currentY * 5) + "px, 0) rotateX(" + (currentY * -2.2) + "deg) rotateY(" + (currentX * 2.6) + "deg)";
    carouselFront.style.transform = "translate3d(" + (currentX * 20) + "px, " + (currentY * 8) + "px, 50px) rotateX(" + (currentY * -2.2) + "deg) rotateY(" + (currentX * 2.6) + "deg)";
    requestAnimationFrame(animateParallax);
  }

  startParallaxAnimation();
}

function initializeCarouselParticles() {
  if (!particleCanvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const context = particleCanvas.getContext("2d");
  const particles = [];
  const particleCount = 24;

  function resizeCanvas() {
    const scale = window.devicePixelRatio || 1;
    particleCanvas.width = particleCanvas.clientWidth * scale;
    particleCanvas.height = particleCanvas.clientHeight * scale;
    context.setTransform(scale, 0, 0, scale, 0, 0);
  }

  function seedParticles() {
    particles.length = 0;
    for (let index = 0; index < particleCount; index += 1) {
      particles.push({
        x: Math.random() * particleCanvas.clientWidth,
        y: Math.random() * particleCanvas.clientHeight,
        radius: Math.random() * 1.6 + 0.5,
        speed: Math.random() * 0.22 + 0.08,
        alpha: Math.random() * 0.35 + 0.12,
      });
    }
  }

  function drawParticles() {
    const width = particleCanvas.clientWidth;
    const height = particleCanvas.clientHeight;
    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      particle.y -= particle.speed;
      if (particle.y < -5) particle.y = height + 5;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = "rgba(199, 127, 130, " + particle.alpha + ")";
      context.fill();
    });
    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  seedParticles();
  window.addEventListener("resize", () => { resizeCanvas(); seedParticles(); });
  drawParticles();
}

initializeCarousel();
initializeCarouselParallax();
initializeCarouselParticles();
