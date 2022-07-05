import { helper } from '@ember/component/helper';
import require from 'require';

import { css } from '@lit/reactive-element';
import resolve from 'consul-ui/utils/path/resolve';


const appName = 'consul-ui';

const container = new Map();

// `css` already has a caching mechanism under the hood so rely on that, plus
// we get the advantage of laziness here, i.e. we only call css as and when we
// need to
export default helper(([path = ''], { from }) => {
  const fullPath = resolve(`${appName}${from}`, path);

  let module;
  if(require.has(fullPath)) {
    module = require(fullPath).default;
  } else {
    throw new Error(`Unable to resolve '${fullPath}' does the file exist?`)
  }

  switch(true) {
    case fullPath.endsWith('.css'):
      return module(css);
    case fullPath.endsWith('.xstate'):
      return module;
    default: {
      if(container.has(fullPath)) {
        return container.get(fullPath);
      }
      const component = module(HTMLElement);
      container.set(fullPath, component);
      return component;
    }
  }
});