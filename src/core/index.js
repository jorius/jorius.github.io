// @http
import { addHttpInterceptors } from './http-interceptors';

// @store
import { reduxStore } from '../store';

const getCore = () => {
  if (global.core) {
    return global.core;
  }

  const core = {
    store: reduxStore,
  };

  addHttpInterceptors({ store: core.store });

  global.core = core;
  return global.core;
};

export const { store } = getCore();
