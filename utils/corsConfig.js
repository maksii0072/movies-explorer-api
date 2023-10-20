const allowedCors = [
  'http://movies-choice.nomoreparties.co',
  'https://movies-choice.nomoreparties.co',
  'http://localhost:3000',
  'http://localhost:3001',
  'localhost:3000',
  'localhost:3001',

];

const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

module.exports = {
  allowedCors,
  DEFAULT_ALLOWED_METHODS
};