import createElement from '../../../assets/lib/create-element.js';

export default class Modal {
  constructor() {   
    this.render();
    this.selector();
    this.closeOnButton();
  }
  render() {
    this.elem = createElement(`
      <div class="modal">      
        <div class="modal__overlay"></div>
        <div class="modal__inner">
          <div class="modal__header">          
            <button type="button" class="modal__close">
              <img src="/Bangkok-Express/assets/images/icons/cross-icon.svg" alt="close-icon" />
            </button>
            <h3 class="modal__title"></h3>
          </div>
          <div class="modal__body"></div>
        </div>
      </div>
    `);    
  }
  open() {
    let body = document.querySelector('body');
    body.append(this.elem);
    body.classList.add('is-modal-open');
    this.closeOnEscListener = (event) => this.closeOnEsc(event);
    document.addEventListener('keydown', this.closeOnEscListener);
  }
  closeOnEscListener(event) {
    this.closeOnEsc(event);
  }
  selector(selector) {
    return this.elem.querySelector(`${selector}`);
  }
  setTitle(title) {    
    this.selector('.modal__title').innerHTML = title;    
  }  
  setBody(modalBody) {
    let body = this.selector('.modal__body');
    body.innerHTML = '';
    body.append(modalBody);
  }
  close() {
    document.removeEventListener('keydown', this.closeOnEscListener);
    this.elem.remove();
    document.querySelector('body').classList.remove('is-modal-open');
  }
  closeOnButton() {
    this.selector('.modal__close').addEventListener('click', () => {
      this.close();
    });
  }  
  closeOnEsc(event) {
    if (event.code === 'Escape') {
      this.close();
    }  
  }
}