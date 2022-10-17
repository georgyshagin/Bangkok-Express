import createElement from '../../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.render();
    this.selector();
    this.slideShift();
    this.selectCategory();    
  }
  render() {
    this.elem = createElement(`
      <div class="ribbon">
        <button class="ribbon__arrow ribbon__arrow_left">
          <img src="/Bangkok-Express/assets/images/icons/angle-icon.svg" alt="icon">
        </button>
        <nav class="ribbon__inner">          
        </nav>
        <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
          <img src="/Bangkok-Express/assets/images/icons/angle-icon.svg" alt="icon">
        </button>
      </div>
    `);
    let categories = this.categories.map(item => createElement(`
      <a href="#" class="ribbon__item" data-id="${item.id}">${item.name}</a>
    `))
    .forEach(item => this.selector('.ribbon__inner').append(item));
  }   
  selector(selector) {
    return this.elem.querySelector(`${selector}`);    
  }
  slideShift() {
    const arrowRight = this.selector('.ribbon__arrow_right');
    const arrowLeft = this.selector('.ribbon__arrow_left');
    const inner = this.selector('.ribbon__inner');    
    arrowRight.addEventListener('click', () => { 
      inner.scrollBy(350, 0);
    });  
    arrowLeft.addEventListener('click', () => {  
      inner.scrollBy(-350, 0);
    }); 
    inner.addEventListener('scroll', () => {        
      this.checkArrows();     
    });   
  } 
  checkArrows() {
    const arrowRight = this.selector('.ribbon__arrow_right');
    const arrowLeft = this.selector('.ribbon__arrow_left');
    const inner = this.selector('.ribbon__inner');
    let scrollLeft = inner.scrollLeft;
    let scrollWidth = inner.scrollWidth;
    let clientWidth = inner.clientWidth;
    let scrollRight = scrollWidth - scrollLeft - clientWidth;
    if (scrollLeft == 0) {      
      arrowLeft.classList.remove('ribbon__arrow_visible');
    } else {        
      arrowLeft.classList.add('ribbon__arrow_visible');
    }
    if (scrollRight < 1) {
      arrowRight.classList.remove('ribbon__arrow_visible');
    } else {
      arrowRight.classList.add('ribbon__arrow_visible');
    }
  }
  selectCategory() {
    this.elem.addEventListener('click', event => { 
      event.preventDefault();  
      let currentCategory = event.target.closest('.ribbon__item');       
      if (currentCategory) {        
        let id = currentCategory.dataset.id;
        let myEvent = new CustomEvent("ribbon-select", {
          detail: id, 
          bubbles: true
        });
        this.elem.dispatchEvent(myEvent);
        let currentActiveCategory = this.selector('.ribbon__item_active');
        if (currentActiveCategory) {
          currentActiveCategory.classList.remove('ribbon__item_active');
        }
        event.target.classList.add('ribbon__item_active');
      }
    });       
  }
}