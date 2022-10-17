import createElement from '../../../assets/lib/create-element.js';

export default class ProductCard {
  constructor(product) {
    this.product = product;
    this.elem(); 
    this.productAdd();
  }
  elem() {
    this.elem = createElement(`
      <div class="card">
        <div class="card__top">
          <img src="/Bangkok-Express/assets/images/products/${this.product.image}" class="card__image" alt="product">
          <span class="card__price">€${this.product.price.toFixed(2)}</span>
        </div>
        <div class="card__body">
          <div class="card__title">${this.product.name}</div>
          <button type="button" class="card__button">
            <img src="/Bangkok-Express/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>
    `);      
  }
  productAdd() {
    this.elem.addEventListener('click', event => {
      let btn = document.querySelector('.card__button');
      if (btn) {
        let myEvent = new CustomEvent("product-add", {
          detail: this.product.id, 
          bubbles: true
        });
        this.elem.dispatchEvent(myEvent);
      }
    });       
  }
}