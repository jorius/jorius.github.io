export const parseStringParams = (string, ...params) => {
  let formattedString = string;

  params.forEach((param, index) => {
    while (formattedString.indexOf(`{${index}}`) >= 0) {
      formattedString = formattedString.replace(`{${index}}`, param);
    }
  });

  return formattedString;
};
