import { makeElement } from "../../utils/make-element.js";
import { iconClose } from "../icons.js";



export class Modal {
  #modal = null;
  #id = null;
  #onShowCallback = () => { };

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
      id: id,
      'data-hidden': true,
      'data-id': id,
      role: "dialog",
      tabindex:"-1",
    });

    const wrapper = makeElement('div', { class: 'wrapper' })
    const heading = makeElement('div', { class: 'heading' })
    const title = makeElement('h2', { class: 'title' }, titleText);

    const buttonClose = makeElement('button', {
      class: 'btn-close',
      'aria-label': 'Close Modal',
      autofocus: true
    });

    buttonClose.innerHTML = iconClose;

    buttonClose.onclick = () => {
      modal.setAttribute('data-hidden', true);
    }

    const innerWrapper = makeElement('div', { class: 'inner-wrapper', role:"document" });
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




  /**
   * add a listener to the target event, when clicked open the modal
   * 
   * @method
   * @name attach
   * @kind property
   * @memberof Modal
   * @param {any} target
   * @returns {void}
   */
  attach = (target) => {
    target.addEventListener('click', () => {
      this.show()
    })
  }

  show = () => {
    this.#modal.setAttribute("data-hidden", false);
    this.#modal.focus()
    this.#onShowCallback(this.#modal)?.catch(console.error)
  }

  hidden = () => {
    this.#modal.setAttribute("data-hidden", true);
  }

   
  /**
   * Description
   * 
   * @method
   * @name onShow
   * @kind property
   * @memberof Modal
   * @param {(modal: HTMLElement) => void} callback?
   * @returns {void}
   */
  onShow = (callback = () => { }) => {
    this.#onShowCallback = callback;
  }

  constructor(id, title = '', content) {
    this.#create(id, title, content);
    this.#id = id;
    document.body.appendChild(this.#modal);
  }
}