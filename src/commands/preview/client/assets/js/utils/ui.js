/**
 * Checks if a key represents a DOM event (starts with "on") and the value is a function.
 *
 * @param {string} k - The property key.
 * @param {*} v - The value associated with the key.
 * @returns {boolean} True if the key is an event listener.
 */
const isEvent = (k, v) => k.startsWith("on") && typeof v === "function";

/**
 * Converts a property key like "onClick" to an event name like "click".
 *
 * @param {string} k - The property key.
 * @returns {string} The corresponding event name in lowercase.
 */
const eventName = k => k.substring(2).toLowerCase();

/**
 * Applies attributes and event listeners to a given HTML element.
 *
 * @template {HTMLElement} T
 * @param {T} el - The element to apply attributes to.
 * @param {Object.<string, any>} props - Key-value pairs of attributes or event handlers.
 * @returns {T} The updated element.
 */
function attrs(el, props) {
  for (let [k, val] of Object.entries(props)) {
    if (isEvent(k, val)) {
      el.addEventListener(eventName(k), val);
    } else if (k === "class") {
      const classes = Array.isArray(val) ? val : [val];
      el.classList.add(...classes);
    } else {
      el.setAttribute(k, val);
    }
  }
  return el;
}

/**
 * Creates a factory for generating HTML elements with typed access.
 *
 * @example
 * const { form, div, span } = ui();
 * const myForm = form({ class: 'form-class' }, [span('Text')]);
 * document.body.appendChild(myForm);
 *
 * @returns {{
 *   [K in keyof HTMLElementTagNameMap]: (
 *     props?: Partial<HTMLElementTagNameMap[K]> | string | Array<Node|string>,
 *     children?: Node | Array<Node|string> | string
 *   ) => HTMLElementTagNameMap[K]
 * }} An object mapping tag names to element creation functions with typing.
 */
export const ui = () => {
  const isString = s => typeof s === "string";

  return new Proxy(
    {},
    {
      get(_, tag) {
        return function (props = {}, children) {
          if (Array.isArray(props)) {
            children = props;
            props = {};
          }

          if (isString(props)) {
            children = [props];
            props = {};
          }

          if (!Array.isArray(children)) {
            children = [children];
          }

          /** @type {HTMLElement} */
          const el = attrs(document.createElement(tag), props);

          children.forEach(child => {
            if (isString(child)) {
              el.textContent = child;
            } else if (child instanceof Node) {
              el.appendChild(child);
            }
          });

          return el;
        };
      }
    }
  );
};
