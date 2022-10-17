import createElement from '../../../assets/lib/create-element.js';
import escapeHtml from '../../../assets/lib/escape-html.js';

import Modal from '../../7/2/index.js';

export default class Cart {
  // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartItems = []; 
    this.cartIcon = cartIcon;
    
    this.addEventListeners();
  }

  addProduct(product) {
    if (!product) {
      return;
    }
    let cartItem = this.cartItems.find(item => item.product.id == product.id);

    if (!cartItem) {
      cartItem = {product: product, count: 1};
      this.cartItems.push(cartItem);
    } else {
      cartItem.count++;
    }   
    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    let cartItem = this.cartItems.find(item => item.product.id == productId);
    if (cartItem) {
      cartItem.count += amount;
      if (cartItem.count == 0) {
        this.cartItems = this.cartItems.filter(item => item.product.id != productId);
      }
    }
    this.onProductUpdate(cartItem);
  }

  isEmpty() {
    if (this.cartItems.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  getTotalCount() {
    let counter = 0;
    for (let cartItem of this.cartItems) {
      counter += cartItem.count;
    }
    return counter;
  }

  getTotalPrice() {
    let totalPrice = 0;
    for (let cartItem of this.cartItems) {
      totalPrice += cartItem.product.price * cartItem.count;
    }
    return totalPrice;
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/Bangkok-Express/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/Bangkok-Express/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/Bangkok-Express/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${(product.price * count).toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    let modal = new Modal(); 
    this.modal = modal;   
    let modalBody = createElement('<div></div>');
    this.modalBody = modalBody;
    
    modal.setTitle("Your order");
    for (let cartItem of this.cartItems) {
      modalBody.append(this.renderProduct(cartItem.product, cartItem.count));
    }
    modalBody.append(this.renderOrderForm());
    modal.setBody(modalBody);
    modal.open();

    modalBody.addEventListener('click', event => {
      if (event.target.closest('.cart-counter__button_minus')) {
        this.updateProductCount(event.target.closest('.cart-product').dataset.productId, -1);
      }
      if (event.target.closest('.cart-counter__button_plus')) {
        this.updateProductCount(event.target.closest('.cart-product').dataset.productId, 1);
      }
    });

    let submitForm = modalBody.querySelector('.cart-form');
    submitForm.addEventListener('submit', event => {
      this.onSubmit(event);
    });
  }

  onProductUpdate(cartItem) {    
    if (document.body.classList.contains('is-modal-open')) {
      let modalBody = document.querySelector('.modal__body');
      let productId = cartItem.product.id;
      let productCart = modalBody.querySelector(`[data-product-id="${productId}"]`);
      let productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
      let productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
      let infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);
      productCount.innerHTML = cartItem.count;
      productPrice.innerHTML = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;
      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;

      if (!cartItem.count) {
        productCart.innerHTML = '';
      }
      if (!this.getTotalPrice()) {        
        this.modal.close();
      }
    }  
    this.cartIcon.update(this);
  }

  async onSubmit(event) {
    event.preventDefault();
    let modal = document.querySelector('.modal');
    let form = modal.querySelector('.cart-form');
    let buttonSubmit = modal.querySelector('[type="submit"]');
    buttonSubmit.classList.add('is-loading');
    let formData = new FormData(form);
    let url = 'https://httpbin.org/post';
    let response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
      this.modal.setTitle("Success!");
      this.cartItems.length = 0;
      this.modalBody.innerHTML = `
      <div class="modal__body-inner">
        <p>
          Order successful! Your order is being cooked :) <br>
          We’ll notify you about delivery time shortly.<br>
          <img src="/Bangkok-Express/assets/images/delivery.gif">
        </p>
      </div>
      `;
      this.cartIcon.update(this);
    } 
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}