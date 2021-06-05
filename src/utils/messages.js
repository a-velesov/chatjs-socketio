const dateFns = require("date-fns");

const generateMessage = (text, username) => {
  return {
    text,
    username,
    createdAt: dateFns.format(new Date(), 'HH:mm:ss'),
  };
};

module.exports = {
  generateMessage,
};