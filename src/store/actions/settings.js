// @constants
export const SET_LANGUAGE_CODE = 'SET_LANGUAGE_CODE';

export const setLanguageCode = (languageCode) => ({
  payload: { languageCode },
  type: SET_LANGUAGE_CODE,
});
