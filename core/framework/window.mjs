
const w = window;

export const Window = {
  
}

function body(doc) {
  const domBody = doc.body;
  return {
    mount(...frame) {
      for (let element of frame) {
        domBody.appendChild(element);
      }
    },
    async render(...components) {
      for (let component of components) {
        // NOTE: relyes that last child will not be removed while the component building.
        const lastChild = domBody.lastChild;
        const instance = await component;
        if (lastChild) {
          lastChild.after(instance.dom)
        }
        else {
          domBody.appendChild(instance.dom)
        }
        // NOTE: lets template know that an instance is rendered.
        instance.template._rendered(instance);
      }
    },
  }
}

export const Body = body(document);