const dateFns = require("date-fns");

const generateMessage = (text) => {
  return {
    text,
    createdAt: dateFns.format(new Date(), 'HH:mm:ss'),
  };
};

module.exports = {
  generateMessage,
};