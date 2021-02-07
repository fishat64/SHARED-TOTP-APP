import axios from 'axios';
const config = require('../config.json'); 

export default axios.create({
  baseURL: config.baseURL,
});