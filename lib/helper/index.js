const responses  = require("./responses") 

const isEmailValid = (email) => {
  const normalize = email.toLowerCase()
    return normalize.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g);
  };



  module.exports = {
    isEmailValid,
    responses
  }