const regex = (url) => {
  const urlRegex = /https?:\/\/(?:www\.)?[\w@:%.\-+~#=]{1,256}\.[a-zA-Z]{1,10}\b([\w\-.~:/?#[\]@!$&'()*+,;=]+#?)?/g;

  return urlRegex.test(url);
};

module.exports.regex = regex;

module.exports.joiRegex = (value, helper) => {
  if (regex(value)) {
    return value;
  }
  return helper.message('Передан не валидный url');
};
