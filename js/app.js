// ===============================
// Получаем элементы
// ===============================

const gallery = document.getElementById("gallery");

const modal = document.getElementById("modal");

const modalImageWrap = document.getElementById("modalImageWrap");
const modalImage = document.getElementById("modalImage");

const modalTitle = document.getElementById("modalTitle");
const modalButton = document.querySelector(".modal-button");
const modalClose = document.querySelector(".modal-close");

const modalPrev = document.querySelector(".modal-prev");
const modalNext = document.querySelector(".modal-next");

const modalOverlay = document.querySelector(".modal-overlay");
const filterButtons = document.querySelectorAll(".filter");
// ===============================
// Контакты
// ===============================

const TELEGRAM_USERNAME = "vikitoriaviw";
// Здесь будут храниться все шаблоны
let templates = [];
let selectedTemplate = null;

// Список, который сейчас показан в галерее (с учётом фильтра) —
// именно по нему листаем стрелками/свайпом в модалке
let displayedTemplates = [];
let currentIndex = 0;

// Состояние зума/панорамирования фото в модалке
let scale = 1;
let translateX = 0;
let translateY = 0;

// ===============================
// Форматирование цены
// ===============================

function formatPrice(value) {

    return `${value.toLocaleString("ru-RU")} ₽`;

}

// ===============================
// Загрузка JSON
// ===============================

async function loadTemplates() {

    try {

        const response = await fetch("data/templates.json");

        if (!response.ok) {
            throw new Error("Не удалось загрузить templates.json");
        }

        templates = await response.json();

        console.log("Шаблоны загружены:", templates);

        renderTemplates(templates);

    }

    catch (error) {

        console.error(error);

        gallery.innerHTML = `
            <p style="text-align:center">
                Ошибка загрузки шаблонов
            </p>
        `;

    }

}


// ===============================
// Создание карточек
// ===============================

function renderTemplates(data) {

    gallery.innerHTML = "";

    displayedTemplates = data;

    data.forEach((template, index) => {

        const card = document.createElement("div");

        card.className = "template-card";

        card.innerHTML = `

            <div class="template-image">

                <img
                    src="${template.image}"
                    alt="${template.title}"
                >

            </div>

            <div class="template-info">

                <h3>${template.title}</h3>

                ${template.price ? `<span class="template-price">${formatPrice(template.price)}</span>` : ""}

            </div>

        `;

        gallery.appendChild(card);
        card.addEventListener("click", () => {

            openModal(index);

        });

    });

}

// ===============================
// Открытие / навигация фулскрин-просмотра
// ===============================

function openModal(index) {

    currentIndex = index;

    selectedTemplate = displayedTemplates[currentIndex];

    modalButton.style.display = "inline-block";

    updateModalContent();

    modal.classList.add("active");

    document.body.classList.add("modal-open");

}

function updateModalContent() {

    resetZoom();

    modalImage.src = selectedTemplate.image;

    modalImage.alt = selectedTemplate.title;

    modalTitle.textContent = selectedTemplate.title;

    // Стрелки/навигация нужны только если в списке больше одного шаблона

    const multiple = displayedTemplates.length > 1;

    modalPrev.classList.toggle("is-hidden", !multiple);

    modalNext.classList.toggle("is-hidden", !multiple);

}

function showNext() {

    if (displayedTemplates.length < 2) return;

    currentIndex = (currentIndex + 1) % displayedTemplates.length;

    selectedTemplate = displayedTemplates[currentIndex];

    updateModalContent();

}

function showPrev() {

    if (displayedTemplates.length < 2) return;

    currentIndex = (currentIndex - 1 + displayedTemplates.length) % displayedTemplates.length;

    selectedTemplate = displayedTemplates[currentIndex];

    updateModalContent();

}


// ===============================
// Запуск
// ===============================

loadTemplates();


// ===========================
// Фильтрация
// ===========================

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>

            btn.classList.remove("active")

        );

        button.classList.add("active");

        const category = button.dataset.category;

        if (category === "Все") {

            renderTemplates(templates);

            return;

        }

        const filtered = templates.filter(item =>

            item.category === category

        );

        renderTemplates(filtered);

    });

    

});

function closeModal() {

    modal.classList.remove("active");

    document.body.classList.remove("modal-open");

}

modalClose.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", closeModal);

// Закрытие по Esc, стрелки клавиатуры — тоже листают (удобно на десктопе)

document.addEventListener("keydown", (event) => {

    if (!modal.classList.contains("active")) return;

    if (event.key === "Escape") closeModal();

    if (event.key === "ArrowRight") showNext();

    if (event.key === "ArrowLeft") showPrev();

});

modalNext.addEventListener("click", showNext);

modalPrev.addEventListener("click", showPrev);


modalButton.addEventListener("click", (event) => {

    event.preventDefault();

    if (!selectedTemplate) return;

    const message =
`Здравствуйте!

Мне понравился шаблон:

"${selectedTemplate.title}"

Хочу узнать стоимость 😊`;

    const url =
`https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

});

// =====================================
// Карусель отзывов (стрелки для мыши)
// =====================================

const reviewsGallery = document.getElementById("reviewsGallery");
const reviewsPrev = document.querySelector(".reviews-prev");
const reviewsNext = document.querySelector(".reviews-next");

function scrollReviews(direction) {

    if (!reviewsGallery) return;

    const firstImg = reviewsGallery.querySelector("img");

    if (!firstImg) return;

    const gap = parseFloat(getComputedStyle(reviewsGallery).columnGap) || 30;

    const step = firstImg.getBoundingClientRect().width + gap;

    reviewsGallery.scrollBy({ left: direction * step, behavior: "smooth" });

}

if (reviewsPrev && reviewsNext) {

    reviewsPrev.addEventListener("click", () => scrollReviews(-1));
    reviewsNext.addEventListener("click", () => scrollReviews(1));

}

// =====================================
// Увеличение отзывов
// =====================================

const reviewImages = document.querySelectorAll(".reviews-gallery img");

reviewImages.forEach(image => {

    image.addEventListener("click", () => {

        resetZoom();

        selectedTemplate = null;

        modalImage.src = image.src;

        modalImage.alt = "";

        modalTitle.textContent = "";

        modalButton.style.display = "none";

        modalPrev.classList.add("is-hidden");

        modalNext.classList.add("is-hidden");

        modal.classList.add("active");

        document.body.classList.add("modal-open");

    });

});

// ======================================
// FAQ
// ======================================

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const button = item.querySelector(".faq-question");

    button.addEventListener("click", () => {

        item.classList.toggle("active");

    });

});

// =========================================
// МОБИЛЬНОЕ МЕНЮ
// =========================================

const menuButton = document.getElementById("menuButton");

const mobileMenu = document.getElementById("mobileMenu");

const mobileMenuClose = document.getElementById("mobileMenuClose");


// Открыть меню

menuButton.addEventListener("click", () => {

    mobileMenu.classList.add("active");

    document.body.style.overflow = "hidden";

});


// Закрыть меню

mobileMenuClose.addEventListener("click", () => {

    mobileMenu.classList.remove("active");

    document.body.style.overflow = "";

});


// Закрытие при нажатии на ссылку

const mobileLinks = mobileMenu.querySelectorAll("a");

mobileLinks.forEach(link => {

    link.addEventListener("click", () => {

        mobileMenu.classList.remove("active");

        document.body.style.overflow = "";

    });

});

// =========================================
// ФУЛСКРИН-ПРОСМОТР: ЗУМ, ПАН, СВАЙП
// =========================================

const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.2;
const SWIPE_THRESHOLD = 60;

const activePointers = new Map();

let isDragging = false;
let panStart = { x: 0, y: 0 };
let translateStart = { x: 0, y: 0 };

let pinchStartDistance = 0;
let pinchStartScale = 1;

let swipeStartX = 0;
let swipeStartY = 0;
let swipeStartTime = 0;

let lastTapTime = 0;
let lastTapX = 0;
let lastTapY = 0;

function getDistance(p1, p2) {

    return Math.hypot(p1.x - p2.x, p1.y - p2.y);

}

function applyTransform() {

    modalImage.style.transform =
        `translate(${translateX}px, ${translateY}px) scale(${scale})`;

}

function clampTranslate() {

    const wrapRect = modalImageWrap.getBoundingClientRect();

    const maxX = (wrapRect.width * (scale - 1)) / 2;
    const maxY = (wrapRect.height * (scale - 1)) / 2;

    translateX = Math.min(maxX, Math.max(-maxX, translateX));
    translateY = Math.min(maxY, Math.max(-maxY, translateY));

}

function resetZoom() {

    scale = 1;
    translateX = 0;
    translateY = 0;

    modalImageWrap.classList.remove("zoomed");

    applyTransform();

}

function toggleZoom() {

    if (scale > 1) {

        resetZoom();

    } else {

        scale = DOUBLE_TAP_SCALE;
        translateX = 0;
        translateY = 0;

        modalImageWrap.classList.add("zoomed");

        applyTransform();

    }

}

function handlePossibleDoubleTap(x, y) {

    const now = Date.now();

    const isDoubleTap =
        now - lastTapTime < 300 &&
        Math.abs(x - lastTapX) < 30 &&
        Math.abs(y - lastTapY) < 30;

    if (isDoubleTap) {

        toggleZoom();

        lastTapTime = 0;

    } else {

        lastTapTime = now;
        lastTapX = x;
        lastTapY = y;

    }

}

modalImageWrap.addEventListener("pointerdown", (event) => {

    modalImageWrap.setPointerCapture(event.pointerId);

    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (activePointers.size === 1) {

        isDragging = true;

        modalImageWrap.classList.add("dragging");

        panStart = { x: event.clientX, y: event.clientY };
        translateStart = { x: translateX, y: translateY };

        swipeStartX = event.clientX;
        swipeStartY = event.clientY;
        swipeStartTime = Date.now();

    }

    if (activePointers.size === 2) {

        const points = [...activePointers.values()];

        pinchStartDistance = getDistance(points[0], points[1]);
        pinchStartScale = scale;

        translateStart = { x: translateX, y: translateY };

    }

});

modalImageWrap.addEventListener("pointermove", (event) => {

    if (!activePointers.has(event.pointerId)) return;

    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    // --- Зум двумя пальцами ---

    if (activePointers.size === 2) {

        const points = [...activePointers.values()];

        const distance = getDistance(points[0], points[1]);

        let newScale = pinchStartScale * (distance / pinchStartDistance);

        newScale = Math.min(MAX_SCALE, Math.max(1, newScale));

        scale = newScale;

        translateX = translateStart.x;
        translateY = translateStart.y;

        clampTranslate();

        modalImageWrap.classList.toggle("zoomed", scale > 1);

        applyTransform();

        return;

    }

    // --- Один палец: пан по увеличенному фото или свайп между шаблонами ---

    if (activePointers.size === 1 && isDragging) {

        const point = [...activePointers.values()][0];

        const dx = point.x - panStart.x;
        const dy = point.y - panStart.y;

        if (scale > 1) {

            translateX = translateStart.x + dx;
            translateY = translateStart.y + dy;

            clampTranslate();

            applyTransform();

        } else {

            // Небольшое сопротивление для приятного ощущения свайпа

            translateX = dx * 0.4;

            applyTransform();

        }

    }

});

function onPointerEnd(event) {

    if (!activePointers.has(event.pointerId)) return;

    activePointers.delete(event.pointerId);

    if (activePointers.size === 0) {

        isDragging = false;

        modalImageWrap.classList.remove("dragging");

        if (scale === 1) {

            const dx = event.clientX - swipeStartX;
            const dy = event.clientY - swipeStartY;
            const elapsed = Date.now() - swipeStartTime;

            const isSwipe =
                Math.abs(dx) > SWIPE_THRESHOLD &&
                Math.abs(dx) > Math.abs(dy) * 1.5;

            const isTap =
                Math.abs(dx) < 10 &&
                Math.abs(dy) < 10 &&
                elapsed < 300;

            if (isSwipe) {

                if (dx < 0) {

                    showNext();

                } else {

                    showPrev();

                }

            } else {

                translateX = 0;

                applyTransform();

            }

            if (isTap && event.pointerType !== "mouse") {

                handlePossibleDoubleTap(event.clientX, event.clientY);

            }

        }

    } else if (activePointers.size === 1) {

        // Один палец убрали во время пинча — продолжаем панорамирование оставшимся

        const remaining = [...activePointers.values()][0];

        panStart = { x: remaining.x, y: remaining.y };
        translateStart = { x: translateX, y: translateY };

    }

}

modalImageWrap.addEventListener("pointerup", onPointerEnd);
modalImageWrap.addEventListener("pointercancel", onPointerEnd);

// Двойной клик мышью — зум для десктопа

modalImage.addEventListener("dblclick", () => {

    toggleZoom();

});