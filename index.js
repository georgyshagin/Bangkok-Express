import Carousel from '../Bangkok-Express/modules/6/3/index.js';
import slides from '../Bangkok-Express/modules/6/3/slides.js';

import RibbonMenu from '../Bangkok-Express/modules/7/1/index.js';
import categories from '../Bangkok-Express/modules/7/1/categories.js';

import StepSlider from '../Bangkok-Express/modules/7/4/index.js';
import ProductsGrid from '../Bangkok-Express/modules/8/2/index.js';

import CartIcon from '../Bangkok-Express/modules/8/1/index.js';
import Cart from '../Bangkok-Express/modules/8/4/index.js';

export default class Main {

  constructor() {    
  }

  async render() {
    this.carousel = new Carousel(slides);
    let carouselHolder = document.querySelector('[data-carousel-holder]');
    carouselHolder.append(this.carousel.elem);

    this.ribbonMenu = new RibbonMenu(categories);
    let ribbonHolder = document.querySelector('[data-ribbon-holder]');
    ribbonHolder.append(this.ribbonMenu.elem);

    this.stepSlider = new StepSlider({steps: 5, value: 3});
    let sliderHolder = document.querySelector('[data-slider-holder]');
    sliderHolder.append(this.stepSlider.elem);

    this.cartIcon = new CartIcon();
    let cartIconHolder = document.querySelector('[data-cart-icon-holder]');
    cartIconHolder.append(this.cartIcon.elem);
    
    this.cart = new Cart(this.cartIcon);
    
    let url = 'products.json';
    let response = await fetch(url);    
    this.products = await response.json();

    this.productsGrid = new ProductsGrid(this.products);
    let productsHolder = document.querySelector('[data-products-grid-holder]');
    productsHolder.innerHTML = '';
    productsHolder.append(this.productsGrid.elem);
    this.productsGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: this.stepSlider.value,
      category: this.ribbonMenu.value
    });
    // addEventListeners
    document.body.addEventListener('product-add', ({detail: productId}) => {
      let findCart = this.products.find(product => product.id == productId);
      this.cart.addProduct(findCart);      
    });

    document.body.addEventListener('slider-change', ({detail: value}) => {     
      this.productsGrid.updateFilter({ maxSpiciness: value });
    });

    document.body.addEventListener('ribbon-select', ({detail: categoryId}) => {
      this.productsGrid.updateFilter({ category: categoryId });
    });

    let checkNoNuts = document.querySelector('#nuts-checkbox');
    checkNoNuts.addEventListener('change', event => {
      this.productsGrid.updateFilter({
        noNuts: event.target.checked
      });      
    });

    let checkVegeterianOnly = document.querySelector('#vegeterian-checkbox');
    checkVegeterianOnly.addEventListener('change', event => {
      this.productsGrid.updateFilter({
        vegeterianOnly: event.target.checked
      });
    });
  }  
}
