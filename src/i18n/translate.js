const messages = require("./messages");

module.exports = function translate(lang, key, vars = {}) {
  const keys = key.split(".");

  let text = messages[lang];
  for (const k of keys) {
    if (!text || !text[k]) {
      console.warn(`Chave não encontrada: ${key} para o idioma ${lang}`);
      return key;
    }
    text = text[k];
  }

  return Object.keys(vars).reduce((acc, curr) => {
    return acc.replaceAll(`{${curr}}`, vars[curr]);
  }, text);
};
