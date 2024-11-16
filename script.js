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
    productImg.alt = item.title; 
    productTitle.innerText = item.title;
    productDescription.innerText = item.description;
    productPrice.innerText = `${item.price}$`;
    productBuyBtn.innerText = "Піднести до магічної скриньки";
    productBuyBtn.addEventListener("click", () => addToCart(item));

    productImg.addEventListener("click", () => zoomImage(productImg));

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

const zoomImage = (image) => {
  const modal = document.createElement("div");
  modal.classList.add("image-modal");
  
  const modalImg = document.createElement("img");
  modalImg.src = image.src;
  modalImg.alt = image.alt;
  modal.appendChild(modalImg);

  const closeButton = document.createElement("button");
  closeButton.innerText = "Закрити";
  closeButton.classList.add("close-button");
  closeButton.addEventListener("click", () => {
    modal.remove();
  });
  
  modal.appendChild(closeButton);

  document.body.appendChild(modal);
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



const clearCart = () => {
  const cartList = document.querySelector(".cart-list");
  cartList.innerHTML = "";
  updateCartTotal();
  checkCartEmpty();
};

const buyButton = document.querySelector(".buy-button");

buyButton.addEventListener("click", () => {
  const cartItems = document.getElementsByClassName("cart-list-item");
  
  if (cartItems.length === 0) {
    alert("Ваша магічна скринька порожня!");
    return;
  }
  
  alert("Покупка оформлена! Дякуємо за придбання артефактів.");
  clearCart();
});

renderProducts();