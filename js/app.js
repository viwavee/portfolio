// ===============================
// Получаем элементы
// ===============================

const gallery = document.getElementById("gallery");

const modal = document.getElementById("modal");

const modalImage = document.getElementById("modalImage");

const modalTitle = document.getElementById("modalTitle");
const modalButton = document.querySelector(".modal-button");
const modalClose = document.querySelector(".modal-close");

const modalOverlay = document.querySelector(".modal-overlay");
const filterButtons = document.querySelectorAll(".filter");
// ===============================
// Контакты
// ===============================

const TELEGRAM_USERNAME = "vikitoriaviw";
// Здесь будут храниться все шаблоны
let templates = [];
let selectedTemplate = null;

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

    data.forEach(template => {

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

            </div>

        `;

        gallery.appendChild(card);
        card.addEventListener("click", () => {

            selectedTemplate = template;

            modalImage.src = template.image;

            modalTitle.textContent = template.title;

            modalButton.style.display = "inline-block";

            modal.classList.add("active");

        });

    });

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

modalClose.addEventListener("click", () => {

        modal.classList.remove("active");

});

modalOverlay.addEventListener("click", () => {

        modal.classList.remove("active");

});


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
// Увеличение отзывов
// =====================================

const reviewImages = document.querySelectorAll(".reviews-gallery img");

reviewImages.forEach(image => {

    image.addEventListener("click", () => {

        modalImage.src = image.src;

        modalTitle.textContent = "";

        modalButton.style.display = "none";

        modal.classList.add("active");

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