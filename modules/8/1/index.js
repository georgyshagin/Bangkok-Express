import createElement from '../../../assets/lib/create-element.js';

export default class CartIcon {
  constructor() {
    this.render();

    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() {    
    if (this.elem.offsetWidth && document.documentElement.clientWidth > 767) {
      let initialTopCoord = this.elem.getBoundingClientRect().top;  
      let containerRight = document.querySelector('.container').getBoundingClientRect().right;
      let firstElementOffset = containerRight + 20;
      let rightOffsetScreen = document.documentElement.clientWidth - this.elem.offsetWidth - 10;
      let minOffset = Math.min(firstElementOffset, rightOffsetScreen) + 'px';      
      if (document.documentElement.scrollTop > initialTopCoord) {
        Object.assign(this.elem.style, {
          position: 'fixed',
          top: '50px',
          zIndex: 1e3,
          right: '10px',
          left: minOffset
        });
      } else {
        Object.assign(this.elem.style, {
          position: '',
          top: '',
          zIndex: '',
          left: ''
        });
      }
    }
  }
}
