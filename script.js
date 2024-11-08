const getProducts = async () => { 
  const response = await fetch("test");
  const products = await response.json();
  return products;
};

const renderProducts = async () => {
  const products = await getProducts();
  const container = document.querySelector(".products-container");
  for (const item of products) {
    const productWrapper = document.createElement("li");
    const productImg = document.createElement("img");
    const productTitle = document.createElement("h4");
    const productDescription = document.createElement("p");
    const productPriceSection = document.createElement("section");
    const productPrice = document.createElement("span");
    const productBuyBtn = document.createElement("button");

    productWrapper.classList.add("product-item");
    productPriceSection.classList.add("product-item-price");
    productImg.src = item.image;
    productTitle.innerText = item.title;
    productDescription.innerText = item.description;
    productPrice.innerText = `${item.price}$`;
    productBuyBtn.innerText = "Піднести до магічної скринькі";
    productBuyBtn.addEventListener("click", () => addToCart(item));

    productPriceSection.append(productPrice, productBuyBtn);
    productWrapper.append(
      productImg,
      productTitle,
      productDescription,
      productPriceSection
    );
    container.append(productWrapper);
  }
};

const removeProductFromCart = (event) => {
  event.target.parentElement.parentElement.remove();
  updateCartTotal();
  checkCartEmpty();
};

const addToCart = (product) => {
  const cartItems = document.getElementsByClassName("cart-list-item");
  for (const item of cartItems) {
    if (product.id === +item.getAttribute("id")) {
      const quantityInput = item.querySelector(".cart-list-quantity-section > input");
      quantityInput.value++;
      updateCartTotal();
      return;
    }
  }

  const cart = document.querySelector(".cart-list");
  const cartListWrapper = document.querySelector(".cart-list-wrapper");
  const emptyCartTitle = document.querySelector(".cart-empty-title");

  const cartListItem = document.createElement("li");
  const cartListImgSection = document.createElement("section");
  const cartListPriceSection = document.createElement("section");
  const cartListQuantitySection = document.createElement("section");
  const image = document.createElement("img");
  const title = document.createElement("h4");
  const price = document.createElement("span");
  const quantity = document.createElement("input");
  const removeBtn = document.createElement("button");

  quantity.addEventListener("change", updateCartTotal);
  removeBtn.addEventListener("click", removeProductFromCart);

  cartListItem.classList.add("cart-list-item");
  cartListImgSection.classList.add("cart-list-item-section", "cart-list-img-section");
  cartListPriceSection.classList.add("cart-list-item-section", "cart-list-price-section");
  cartListQuantitySection.classList.add("cart-list-item-section", "cart-list-quantity-section");

  image.src = product.image;
  title.innerText = product.title;
  price.innerText = `${product.price}$`;
  quantity.type = "number";
  quantity.value = 1;
  quantity.min = 1;
  removeBtn.innerText = "Розвіяти, як дим";

  emptyCartTitle.style.display = "none";
  cartListWrapper.style.display = "block";

  cartListImgSection.append(image, title);
  cartListPriceSection.appendChild(price);
  cartListQuantitySection.append(quantity, removeBtn);
  cartListItem.setAttribute("id", product.id);
  cartListItem.append(cartListImgSection, cartListPriceSection, cartListQuantitySection);
  cart.appendChild(cartListItem);
  
  updateCartTotal();
};

const updateCartTotal = () => {
  const totalAmount = document.querySelector(".total-amount > span");
  const cartItems = document.getElementsByClassName("cart-list-item");
  let total = 0;
  for (const item of cartItems) {
    const price = item.querySelector(".cart-list-price-section > span");
    const quantity = item.querySelector(".cart-list-quantity-section > input");
    const currentAmount = parseFloat(price.innerText) * quantity.value;
    total += currentAmount;
  }
  totalAmount.innerText = `${total}$`;
};

const checkCartEmpty = () => {
  const cartItems = document.getElementsByClassName("cart-list-item");
  const cartListWrapper = document.querySelector(".cart-list-wrapper");
  const emptyCartTitle = document.querySelector(".cart-empty-title");
  if (!cartItems.length) {
    cartListWrapper.style.display = "none";
    emptyCartTitle.style.display = "block";
  }
};

const buyButton = document.querySelector(".buy-button");
buyButton.addEventListener("click", async () => {
  const cartItems = document.getElementsByClassName("cart-list-item");
  if (cartItems.length === 0) {
    alert("Ваш кошик порожній! Додайте товари, щоб завершити покупку.");
    return;
  }

  const productsInCart = [];
  for (const item of cartItems) {
    const id = +item.getAttribute("id");
    const title = item.querySelector("h4").innerText;
    const quantity = item.querySelector(".cart-list-quantity-section > input").value;
    productsInCart.push({ id, title, quantity });
  }

  try {
    const response = await fetch("checkout-endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: productsInCart }),
    });
    if (response.ok) {
      alert("Дякуємо за покупку! Ваше замовлення успішно оформлено.");
      clearCart();
    } else {
      alert("Сталася помилка при оформленні замовлення.");
    }
  } catch (error) {
    console.error("Помилка:", error);
    alert("Неможливо завершити покупку. Спробуйте пізніше.");
  }
});


const clearCart = () => {
  const cartList = document.querySelector(".cart-list");
  cartList.innerHTML = "";
  updateCartTotal();
  checkCartEmpty();
};

renderProducts();
