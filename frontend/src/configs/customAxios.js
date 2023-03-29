import axios from 'axios';

// defaults for some reason wouldn't work
const instance = axios.create({
    baseURL: 'http://localhost:8000/rest-auth/'
  });
  
  export default instance