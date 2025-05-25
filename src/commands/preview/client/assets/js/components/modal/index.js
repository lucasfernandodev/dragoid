import { makeElement } from "../../utils/make-element.js";
import { iconClose } from "../icons.js";

 

export class Modal {
  #modal = null;
  #id = null;

  /**
   * Cria e configura um modal com cabeçalho e conteúdo fornecidos.
   *
   * @private
   * @param {string} id - Identificador único do modal (atributo `data-id`).
   * @param {string} [titleText=''] - Texto do título do modal (aparece dentro do <h2>).
   * @param {HTMLElement} content - Elemento HTML que será inserido na área interna do modal.
   * @returns {void}
   */
  #create = (id, titleText = '', content) => {
    const modal = makeElement('div', {
      class: 'modal',
      'data-hidden': true,
      'data-id': id
    });
    const wrapper = makeElement('div', { class: 'wrapper' })
    const heading = makeElement('div', { class: 'heading' })
    const title = makeElement('h2', { class: 'title' }, titleText);
    const buttonClose = makeElement('button', { class: 'btn-close' });
    buttonClose.innerHTML = iconClose;
    buttonClose.onclick = () => {
      modal.setAttribute('data-hidden', true);
    }
    const innerWrapper = makeElement('div', { class: 'inner-wrapper' });
    innerWrapper.appendChild(content)

    heading.append(title, buttonClose);
    wrapper.append(heading, innerWrapper)
    modal.appendChild(wrapper)
    this.#modal = modal;
  }

  getModal = () => {
    return document.querySelector(`.modal[data-id="${this.#id}"]`);
  }


  setView = (newTitle, view) => {
    const title = this.#modal.querySelector('.title');
    title.textContent = newTitle;
    const innerWrapper = this.#modal.querySelector(".inner-wrapper");
    innerWrapper.innerHTML = '';
    innerWrapper.appendChild(view)
  }



  // Seleciona um elemento para abrir o modal[target = htmlElement]
  attach = (target) => {
    target.addEventListener('click', () => {
      this.#modal.setAttribute("data-hidden", false);
    })
  }

  constructor(id, title = '', content) {
    this.#create(id, title, content);
    this.#id = id;
    document.body.appendChild(this.#modal);
  }
}