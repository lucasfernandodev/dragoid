import { makeElement } from "../../utils/make-element.js";
import { iconClose } from "../icons.js";


/**
 * A modal dialog component that can be shown, hidden, and updated dynamically.
 */
export class Modal {
  #modal = null;
  #id = null;
  #onShowCallback = () => { };

  /**
   * Creates the modal element and appends content.
   *
   * @param {string} id - Unique identifier for the modal (used as data-id).
   * @param {string} [titleText=''] - Text for the modal header title.
   * @param {HTMLElement} content - Node to place inside the modal body.
   * @param {Object<string, string>} [attr={}] - Additional attributes to set on the modal container.
   * @private
   */
  #create = (id, titleText = '', content, attr = {}) => {

    const attributes = {
      class: 'modal',
      id: id,
      'data-hidden': true,
      'data-id': id,
      role: "dialog",
      tabindex: "-1",
      ...attr
    }

    const modal = makeElement('div', attributes);

    const wrapper = makeElement('div', { class: 'wrapper' })
    const heading = makeElement('div', { class: 'heading' })
    const title = makeElement('h2', { class: 'title' }, titleText);

    const buttonClose = makeElement('button', {
      class: 'btn-close',
      'aria-label': 'Close Modal',
      autofocus: true
    }, iconClose());



    buttonClose.onclick = () => {
      modal.setAttribute('data-hidden', true);
    }

    const innerWrapper = makeElement('div', { class: 'inner-wrapper', role: "document" });
    innerWrapper.appendChild(content)

    heading.append(title, buttonClose);
    wrapper.append(heading, innerWrapper)
    modal.appendChild(wrapper)
    this.#modal = modal;
  }


  /**
   * Retrieves the DOM element for this modal instance.
   * @returns {HTMLElement|null} The modal element, or null if not attached.
   */
  getModal = () => {
    return document.querySelector(`.modal[data-id="${this.#id}"]`);
  }

  /**
   * Updates modal title and body content.
   * @param {string} newTitle - New title text for the modal header.
   * @param {HTMLElement} view - New content node for the modal body.
   */
  setView = (newTitle, view) => {
    const title = this.#modal.querySelector('.title');
    title.textContent = newTitle;
    const innerWrapper = this.#modal.querySelector(".inner-wrapper");
    innerWrapper.innerHTML = '';
    innerWrapper.appendChild(view)
  }

  /**
    * Attaches the modal show behavior to a target element's click event.
    * @param {HTMLElement} target - Element that triggers modal show when clicked.
    */
  attach = (target) => {
    target.addEventListener('click', () => {
      this.show()
    })
  }


  /**
   * Displays the modal and invokes the onShow callback.
   */
  show = () => {
    this.#modal.setAttribute("data-hidden", false);
    this.#modal.focus()
    this.#onShowCallback(this.#modal)?.catch(console.error)
  }


  /**
   * Hides the modal from view.
   */
  hidden = () => {
    this.#modal.setAttribute("data-hidden", true);
  }

  /**
   * Registers a callback to be executed when the modal is shown.
   * @param {(modalElement: HTMLElement) => Promise<any>|void} callback - Function called on show.
   */
  onShow = (callback = () => { }) => {
    this.#onShowCallback = callback;
  }

  /**
   * Constructs a new Modal instance, creates its DOM, and appends to document.body.
   *
   * @param {Object} config - Configuration object for the modal.
   * @param {string} config.id - Unique identifier for the modal.
   * @param {string} [config.title=''] - Initial title text.
   * @param {HTMLElement} config.content - Initial content node.
   * @param {Object<string, string>} [config.attr={}] - Additional attributes for the modal container.
   */
  constructor({ id, title = '', content, attr = { } }) {
    this.#create(id, title, content);
    this.#id = id;
    document.body.appendChild(this.#modal);
  }
}