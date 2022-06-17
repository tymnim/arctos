
import { reactiveFunction } from "/core/reactivity/hooks.mjs";

export function component(func) {
  const self = (...contextData) => {
    return new Promise((resolve, reject) => {
      // console.log({contextData});
      const instance = {
        contextData,
        template: self,
      };
      instance.dom = instance.dom = func(...contextData);
      resolve(instance);
      return instance;
      // instance.scope = reactiveFunction(scope => {
      //   console.log("inside of reactive scope");
      //   // CHECK: I think since we set dom inside of this anyways. it's
      //   //        less expencive to check for it instead of firstRun
      //   if (/*scope.firstRun*/ !instance.dom) {
      //     // NOTE: running for the first time. We want to initial render dom.
      //     console.log("creating new instance", contextData);
      //     instance.dom = func(...contextData);
      //     resolve(instance);
      //     return instance;
      //   }
      //   // NOTE: if it made here, means some reactive variable in the contextData has changed
      //   // TODO: ask scope what it was triggered by and provide only that data to the func
      //   console.log("reusing old instance", contextData);
      //   func(...contextData, instance.dom);
      // });
    });
  }

  self._renderedListeners = [];

  self._rendered = async (instance) => {
    let listenerResult = [instance.dom, instance.contextData];
    // NOTE: chaining then statements based on returns of previous then statement
    for (let listener of self._renderedListeners) {
      // NOTE: if listener returned no result we want to keep the previous one.
      listenerResult = [await listener(...listenerResult)] ?? listenerResult;
    }
  };

  self.then = listener => {
    // is an event listener that is triggered when component is rendered
    self._renderedListeners.push(listener);
    return self;
  };

  self.finally = listener => {
    // is an event listener that is triggered when component is destroyed
    // listener(self.currentData);
    return self;
  };

  return self;
}