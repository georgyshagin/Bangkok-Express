import createElement from '../../../assets/lib/create-element.js';
import ProductCard from '../../6/2/index.js';

export default class ProductsGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};    
    this.render();
    this.selector();
    this.renderCard();
  }
  render() {
    this.elem = createElement(`
      <div class="products-grid">
        <div class="products-grid__inner"></div>
      </div>
    `); 
  }
  selector(selector) {
    return this.elem.querySelector(`${selector}`);
  }
  renderCard() {
    let inner = this.selector('.products-grid__inner');
    inner.innerHTML = '';
    let products = this.products;    
    for (let product of products) {
      if (this.filters.noNuts && product.nuts) { /* должны получить для применения фильтра NO */
        continue;
      }
      if (this.filters.vegeterianOnly && !product.vegeterian) {
        continue;
      }
      if (this.filters.maxSpiciness < product.spiciness) {
        continue;
      }
      if (this.filters.category !== product.category && this.filters.category) {
        continue;
      }
      let card = new ProductCard(product);
      inner.append(card.elem);
    }
  }
  updateFilter(filters) {
    Object.assign(this.filters, filters);
    this.renderCard();
  }
}