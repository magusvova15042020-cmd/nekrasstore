const products = [
  { id: 1, title: "Nekras Classic", category: "skins", price: 799, badge: "популярный", desc: "Классический скин в фирменном стиле Nekras." },
  { id: 2, title: "Nekras Black", category: "skins", price: 999, badge: "хит", desc: "Тёмный премиальный вариант скина для основного образа." },
  { id: 3, title: "Nekras White", category: "skins", price: 949, badge: "новый", desc: "Светлая версия скина с чистым стильным образом." },
  { id: 4, title: "Michael Versetti", category: "skins", price: 1299, badge: "редкий", desc: "Яркий персонажный скин для заметного игрового стиля." },
  { id: 5, title: "Charles Henderson", category: "skins", price: 1199, badge: "редкий", desc: "Строгий и статусный образ для RP-игры." },
  { id: 6, title: "Fabiano Polker", category: "skins", price: 1399, badge: "премиум", desc: "Премиальный скин для лидерского и статусного вида." },
  { id: 7, title: "Jony Polker", category: "skins", price: 1349, badge: "премиум", desc: "Стильный игровой образ с выразительной подачей." },
  { id: 8, title: "Keo Sykes", category: "skins", price: 1249, badge: "новый", desc: "Современный скин с аккуратным визуальным стилем." },

  { id: 9, title: "Стартовый набор", category: "packs", price: 349, badge: "выгодно", desc: "Базовый комплект для нового игрока и быстрого старта." },
  { id: 10, title: "VIP набор", category: "packs", price: 999, badge: "популярный", desc: "Набор бонусов, валюты и приятных игровых преимуществ." },
  { id: 11, title: "Лидерский набор", category: "packs", price: 1699, badge: "топ", desc: "Расширенный комплект для тех, кто хочет выделяться." },
  { id: 12, title: "RP набор", category: "packs", price: 749, badge: "новый", desc: "Подборка для комфортной RP-игры и оформления персонажа." },

  { id: 13, title: "Премиум статус", category: "services", price: 599, badge: "услуга", desc: "Статус аккаунта с дополнительными возможностями." },
  { id: 14, title: "Смена ника", category: "services", price: 299, badge: "услуга", desc: "Быстрая смена ника для обновления образа персонажа." },
  { id: 15, title: "Смена внешности", category: "services", price: 399, badge: "услуга", desc: "Изменение внешнего вида персонажа через магазин." },
  { id: 16, title: "Разблокировка слота", category: "services", price: 549, badge: "полезно", desc: "Открывает дополнительный слот под игрового персонажа." }
];

const categoryNames = {
  all: "Все",
  skins: "Скины",
  packs: "Наборы",
  services: "Услуги"
};

let activeCategory = "all";
let cart = [];
let authMode = "login";

const chips = document.getElementById("chips");
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const resultText = document.getElementById("resultText");

const cartEl = document.getElementById("cart");
const cartBody = document.getElementById("cartBody");
const cartTotal = document.getElementById("cartTotal");

const authModal = document.getElementById("authModal");
const authTitle = document.getElementById("authTitle");
const nameField = document.getElementById("nameField");
const loginField = document.getElementById("loginField");
const passwordField = document.getElementById("passwordField");
const successBox = document.getElementById("successBox");

function renderChips() {
  chips.innerHTML = "";
  Object.entries(categoryNames).forEach(([key, label]) => {
    const btn = document.createElement("button");
    btn.className = `chip ${activeCategory === key ? "active" : ""}`;
    btn.textContent = label;
    btn.addEventListener("click", () => {
      activeCategory = key;
      renderChips();
      renderProducts();
    });
    chips.appendChild(btn);
  });
}

function filteredProducts() {
  const query = searchInput.value.toLowerCase().trim();

  let result = products.filter((product) => {
    const matchCategory = activeCategory === "all" || product.category === activeCategory;
    const matchText = `${product.title} ${product.desc} ${product.category}`.toLowerCase().includes(query);
    return matchCategory && matchText;
  });

  if (sortSelect.value === "cheap") {
    result.sort((a, b) => a.price - b.price);
  }

  if (sortSelect.value === "expensive") {
    result.sort((a, b) => b.price - a.price);
  }

  return result;
}

function renderProducts() {
  const list = filteredProducts();
  productsGrid.innerHTML = "";
  resultText.textContent = `${list.length} товаров найдено`;

  list.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product";

    card.innerHTML = `
      <div class="thumb">${product.title}</div>
      <div class="product-body">
        <h4>${product.title}</h4>
        <p>${product.desc}</p>
        <div class="meta">
          <div class="price">${product.price} ₽</div>
          <div class="badge">${product.badge}</div>
        </div>
        <div class="mini-actions">
          <button class="btn primary">В корзину</button>
          <button class="btn">Купить</button>
        </div>
      </div>
    `;

    const buttons = card.querySelectorAll(".btn");
    buttons[0].addEventListener("click", () => addToCart(product));
    buttons[1].addEventListener("click", () => {
      addToCart(product);
      toggleCart(true);
    });

    productsGrid.appendChild(card);
  });
}

function addToCart(product) {
  cart.push(product);
  renderCart();
}

function renderCart() {
  cartBody.innerHTML = "";

  if (!cart.length) {
    cartBody.innerHTML = `<div class="empty">Корзина пока пустая</div>`;
    cartTotal.textContent = "0 ₽";
    return;
  }

  let sum = 0;

  cart.forEach((product, index) => {
    sum += product.price;

    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <strong>${product.title}</strong>
      <span>${product.price} ₽</span>
      <div style="margin-top:10px;">
        <button class="btn full-width">Удалить</button>
      </div>
    `;

    item.querySelector("button").addEventListener("click", () => {
      cart.splice(index, 1);
      renderCart();
    });

    cartBody.appendChild(item);
  });

  cartTotal.textContent = `${sum} ₽`;
}

function toggleCart(force) {
  const open = force !== undefined ? force : !cartEl.classList.contains("open");
  cartEl.classList.toggle("open", open);
}

function openAuth(mode) {
  authMode = mode;
  authModal.classList.add("open");
  document.body.style.overflow = "hidden";
  successBox.style.display = "none";
  updateAuthMode();
}

function closeAuth() {
  authModal.classList.remove("open");
  document.body.style.overflow = "";
}

function updateAuthMode() {
  const switchLogin = document.getElementById("switchLogin");
  const switchRegister = document.getElementById("switchRegister");

  if (authMode === "login") {
    authTitle.textContent = "Вход";
    nameField.style.display = "none";
    switchLogin.classList.add("primary");
    switchRegister.classList.remove("primary");
  } else {
    authTitle.textContent = "Регистрация";
    nameField.style.display = "block";
    switchRegister.classList.add("primary");
    switchLogin.classList.remove("primary");
  }
}

function submitAuth() {
  if (!loginField.value.trim() || !passwordField.value.trim()) {
    successBox.style.display = "block";
    successBox.style.background = "rgba(255,123,137,.10)";
    successBox.style.borderColor = "rgba(255,123,137,.18)";
    successBox.style.color = "#ffb1bb";
    successBox.textContent = "Заполни логин и пароль";
    return;
  }

  if (authMode === "register" && !nameField.value.trim()) {
    successBox.style.display = "block";
    successBox.style.background = "rgba(255,123,137,.10)";
    successBox.style.borderColor = "rgba(255,123,137,.18)";
    successBox.style.color = "#ffb1bb";
    successBox.textContent = "Заполни имя";
    return;
  }

  successBox.style.display = "block";
  successBox.style.background = "rgba(63,211,162,.10)";
  successBox.style.borderColor = "rgba(63,211,162,.18)";
  successBox.style.color = "#8de7c8";
  successBox.textContent = authMode === "login"
    ? "Вход выполнен успешно"
    : "Регистрация прошла успешно";

  loginField.value = "";
  passwordField.value = "";
  nameField.value = "";
}

document.getElementById("cartToggle").addEventListener("click", () => toggleCart());
document.getElementById("cartClose").addEventListener("click", () => toggleCart(false));

document.getElementById("loginBtn").addEventListener("click", () => openAuth("login"));
document.getElementById("registerBtn").addEventListener("click", () => openAuth("register"));
document.getElementById("authIconBtn").addEventListener("click", () => openAuth("login"));

document.getElementById("authClose").addEventListener("click", closeAuth);
document.getElementById("authOverlay").addEventListener("click", closeAuth);

document.getElementById("switchLogin").addEventListener("click", () => {
  authMode = "login";
  updateAuthMode();
});

document.getElementById("switchRegister").addEventListener("click", () => {
  authMode = "register";
  updateAuthMode();
});

document.getElementById("submitAuth").addEventListener("click", submitAuth);

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAuth();
    toggleCart(false);
  }
});

renderChips();
renderProducts();
renderCart();
updateAuthMode();