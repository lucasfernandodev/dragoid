/**
 * Creates a new DOM element with given tag, attributes, and children.
 *
 * @function makeElement
 * @param {string} - The HTML tag name to create.
 * @param {Object.<string, string>} [attributes={}] - An object of attribute key-value pairs to set on the element.
 * @param {(string|number|Node|(string|number|Node)[])} [children=[]] - A single or array of child nodes or text content. Strings and numbers are converted to text nodes.
 *   Nested arrays are flattened recursively.
 * @returns {HTMLElement} The newly created DOM element with applied attributes and appended children.
 *
 * @example
 * // Create a <button> with text and an event listener
 * const btn = makeElement('button', { id: 'saveBtn', onclick: handleSave }, 'Save');
 * document.body.appendChild(btn);
 *
 * @example
 * // Create a <ul> list with three <li> items
 * const items = ['One', 'Two', 'Three'].map(text => makeElement('li', {}, text));
 * const list = makeElement('ul', { class: 'list' }, items);
 * document.body.appendChild(list);
 */

export const makeElement = (tag, attributes = {}, children = []) => {
  const element = document.createElement(tag);

  if (!Array.isArray(children)) {
    children = [children];
  }

  for (const [name, value] of Object.entries(attributes)) {
    if (name.startsWith('on') && typeof value === 'function') {
      element.addEventListener(name.slice(2), value);
    } 
    else if (name === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } 
    else if (name === 'dataset' && typeof value === 'object') {
      Object.assign(element.dataset, value);
    } 
    else {
      element.setAttribute(name, value);
    }
  }

  const flatChildren = children.flat(Infinity);

  flatChildren.forEach(child => {
    if (child == null) return;
    if (typeof child === 'string' || typeof child === 'number') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    } else {
      console.warn('makeElement: filho inválido', child);
    }
  });
  return element;
}