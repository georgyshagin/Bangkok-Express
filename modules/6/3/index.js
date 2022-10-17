import createElement from '../../../assets/lib/create-element.js';

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this.counter = 1;
    this.render();
    this.selector();
    this.slideShift();
    this.productAdd();
  }
  render() {
    this.elem = createElement(`
      <div class="carousel">      
        <div class="carousel__arrow carousel__arrow_right">
          <img src="/Bangkok-Express/assets/images/icons/angle-icon.svg" alt="icon">
        </div>
        <div class="carousel__arrow carousel__arrow_left">
          <img src="/Bangkok-Express/assets/images/icons/angle-left-icon.svg" alt="icon">
        </div>
        <div class="carousel__inner">    
        </div>
      </div>
    `);       
    let slide = this.slides.map(item => createElement(`
      <div class="carousel__slide" data-id="${item.id}">
        <img src="/Bangkok-Express/assets/images/carousel/${item.image}" class="carousel__img" alt="slide">
        <div class="carousel__caption">
          <span class="carousel__price">€${item.price.toFixed(2)}</span>
          <div class="carousel__title">${item.name}</div>
          <button type="button" class="carousel__button">
            <img src="/Bangkok-Express/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>   
    `))
    .forEach(item => this.selector('.carousel__inner').append(item));
  }   
  selector(selector) {
    return this.elem.querySelector(`${selector}`);    
  }
  slideShift() {
    const arrowRight = this.selector('.carousel__arrow_right');
    const arrowLeft = this.selector('.carousel__arrow_left');
    const inner = this.selector('.carousel__inner');
    this.checkCounter();  
    arrowRight.addEventListener('click', () => { 
      this.counter = ++this.counter;
      inner.style.transform = `translateX(-${inner.offsetWidth * (this.counter - 1)}px)`;
      this.checkCounter();
    });  
    arrowLeft.addEventListener('click', () => {  
      this.counter = --this.counter;  
      inner.style.transform = `translateX(-${inner.offsetWidth * (this.counter - 1)}px)`;
      this.checkCounter();
    }); 
  }
  checkCounter() {
    const arrowRight = this.selector('.carousel__arrow_right');
    const arrowLeft = this.selector('.carousel__arrow_left');
    if (this.counter == this.slides.length) {
      arrowRight.style.display = 'none';
    } else if (this.counter == 1) {
      arrowLeft.style.display = 'none';
    } else if (this.counter > 1 && this.counter < this.slides.length) {
      arrowRight.style.display = '';
      arrowLeft.style.display = '';
    }
  }
  productAdd() {
    this.elem.addEventListener('click', event => {   
      let btn = event.target.closest('.carousel__button');   
      if (btn) {        
        let currentSLide = btn.closest('.carousel__slide');
        let id = currentSLide.dataset.id;
        let myEvent = new CustomEvent("product-add", {
          detail: id, 
          bubbles: true
        });
        this.elem.dispatchEvent(myEvent);
      }
    });       
  }
}