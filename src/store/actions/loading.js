// @constants
export const TOGGLE_LOADING_PAGE_VISIBILITY = 'TOGGLE_LOADING_PAGE_VISIBILITY';

export const toggleLoadingPageVisibility = (visible) => ({
  type: TOGGLE_LOADING_PAGE_VISIBILITY,
  payload: visible
});
