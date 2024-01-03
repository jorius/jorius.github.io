// @packages
import axios from 'axios';

// @actions
import { toggleLoadingPageVisibility } from '../store/actions';

const handleLoadingPageVisibility = ({ show, store }) => {
  store.dispatch(toggleLoadingPageVisibility(false));

  if (!store.getState().loading.visible && show) {
    store.dispatch(toggleLoadingPageVisibility(true));
  }

  if (store.getState().loading.visible && !show) {
    store.dispatch(toggleLoadingPageVisibility(false));
  }
};

export const addRequestInterceptors = ({ store }) => {
  axios.interceptors.request.use(
    (request) => {
      handleLoadingPageVisibility({ show: true, store });
      return request;
    },
    (error) => Promise.reject(error)
  );
};

export const addResponseInterceptors = ({ store }) => {
  axios.interceptors.response.use(
    (response) => {
      handleLoadingPageVisibility({ show: false, store });
      return response.data;
    },
    (error) => {
      handleLoadingPageVisibility({ show: false, store });
      return Promise.reject(error);
    }
  );
};

export const addHttpInterceptors = ({ store }) => {
  addRequestInterceptors({ store });
  addResponseInterceptors({ store });
};
