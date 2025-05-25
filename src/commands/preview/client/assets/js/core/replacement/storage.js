import { isObjectWithStringValues } from "../../utils.js";

export class ReplacementStorage {
  #storage = {};
  #name = 'replacement-storage'

  #store = () => {
    window.localStorage.setItem(this.#name, JSON.stringify(this.#storage))
    window.dispatchEvent(new Event('storage-replacement'))
  }

  #load = () => {
    const storaged = window.localStorage.getItem(this.#name)
    if (!storaged) {
      this.#storage = {}
      return;
    }

    this.#storage = JSON.parse(storaged)
  }

  create = (id, list = {}) => {
    const isExistId = id in this.#storage;
    if (isExistId) {
      throw new Error('Id exist')
    }

    if (id.length === 0) {
      throw new Error('Id invalid')
    }

    this.#storage[id] = list;
    this.#store()
  }

  /**
   * Retorna o valor associado a um ID do armazenamento, ou null se não existir.
   *
   * @param {string} id - O identificador a ser buscado.
   * @returns {object|null} O valor associado ao ID, ou null se não existir.
   */
  get = (id) => {
    const isExistId = id in this.#storage;
    if (!isExistId) return null;
    return this.#storage[id]
  }

  update = (id, list) => {
    const isExistId = id in this.#storage;
    if (!isExistId) {
      throw new Error('Id not found')
    }

    const isValidList = isObjectWithStringValues(list);

    if (!isValidList) {
      throw new Error('Invalid List')
    }

    this.#storage[id] = list;
    this.#store();
  }

  getAllIds = () => {
    return Object.entries(this.#storage).map(([key, _]) => key)
  }

  size = () => {
    return Object.entries(this.#storage).length
  }

  delete = (id) => {
    const isExistId = id in this.#storage;
    if (!isExistId) {
      throw new Error('Id not found')
    }

    delete this.#storage[id];
    this.#store()
  }

  constructor() {
    this.#load()
  }
}