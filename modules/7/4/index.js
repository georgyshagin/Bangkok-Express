import createElement from '../../../assets/lib/create-element.js';

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this.value = value;
    this.render();
    this.selector();
    this.changeOnClick();
    this.changeOnMove();
    this.valuePercent();
  }
  render() {
    this.elem = createElement(`
      <div class="slider">
        <div class="slider__thumb">
          <span class="slider__value">${this.value}</span>
        </div>      
        <div class="slider__progress"></div>
        <div class="slider__steps"></div>
      </div>
    `);
    let stepsWrapper = this.selector('.slider__steps');
    for (let i = 0; i < this.steps; i++) {
      stepsWrapper.insertAdjacentHTML('beforeEnd', '<span></span>');   
      if (i == this.value) {
        stepsWrapper.childNodes[i].classList.add('slider__step-active');
      }   
    }    
  }
  selector(selector) {
    return this.elem.querySelector(`${selector}`);
  }
  // Изменение значения при клике пошагово
  changeOnClick() {       
    this.elem.addEventListener('click', event => {
      this.valuePercent();
      this.changeSliderEvent();
      this.sliderStepActive();
      
    });
  }  
  // Установка класса активности делениям
  sliderStepActive() {
    let stepActive = this.selector('.slider__step-active');    
    let spans = this.selector('.slider__steps').querySelectorAll('span');
    stepActive.classList.remove('slider__step-active');
    for (let i = 0; i < this.steps; i++) {
      if (this.value == i) {
        spans[i].classList.add('slider__step-active');
      }
    }
  }  
  // Событие изменения шага
  changeSliderEvent() {
    let myEvent = new CustomEvent("slider-change", {
      detail: this.value, 
      bubbles: true
    });
    this.elem.dispatchEvent(myEvent);
  }
  // Возврат значения перемещения в процентах кратно шагу
  valuePercent() {  
    let thumb = this.selector('.slider__thumb');    
    let progress = this.selector('.slider__progress');
    let sliderValue = this.selector('.slider__value');
    let target = this.elem.getBoundingClientRect();
    let segments = this.steps - 1;
    let valueX;
    let leftRelative;
    if (event) {
      valueX = event.clientX - target.left;
      leftRelative = valueX / this.elem.offsetWidth; /* % */
      if (leftRelative < 0) {
        leftRelative = 0;
      }
      if (leftRelative > 1) {
        leftRelative = 1;
      }
    } else {      
      leftRelative = this.value / segments; /* % */
    }    
    let approximateValue = leftRelative * segments; 
    let value = Math.round(approximateValue); /* значение деления */
    this.value = value;
    let valuePercents = value / segments * 100; /* процент на каждом шаге */
    sliderValue.innerText = value;
    thumb.style.left = `${valuePercents}%`;
    progress.style.width = `${valuePercents}%`; 
  }
  // Изменение значения при движении
  changeOnMove() {
    let thumb = this.elem.querySelector('.slider__thumb');
    thumb.ondragstart = () => false;
    thumb.style.touchAction = 'none';
    let slider = this.elem;
    function onPointerMove(event) {
      event.preventDefault();
      let left = event.clientX - slider.getBoundingClientRect().left;
      let leftRelative = left / slider.offsetWidth;
      let thumb = document.querySelector('.slider__thumb');    
      let progress = document.querySelector('.slider__progress');
      if (leftRelative < 0) {
        leftRelative = 0;
      }
      if (leftRelative > 1) {
        leftRelative = 1;
      }
      let valuePercents = leftRelative * 100;
      thumb.style.left = `${valuePercents}%`;
      progress.style.width = `${valuePercents}%`;      
    }
    thumb.onpointerdown = (event) => {
      event.preventDefault();
      slider.classList.add('slider_dragging'); 
      thumb.setPointerCapture(event.pointerId);      

      thumb.onpointermove = (event) => {        
        thumb.addEventListener('pointermove', onPointerMove);
        this.valuePercent();
        this.changeSliderEvent();
        this.sliderStepActive();       
      };
      
      thumb.onpointerup = () => {
        thumb.removeEventListener('pointermove', onPointerMove); 
        this.valuePercent();       
        this.changeSliderEvent();
        this.sliderStepActive();
        slider.classList.remove('slider_dragging');
        thumb.onpointermove = null;
        thumb.onpointerup = null;                
      };      
    };
  } 
}

