import axios from '../axios/customAxious';

const getCrsf = () => {
  axios.post('/get-csrf-token/', {})
    .then(response => {
      // get the CSRF token from the response data
      const csrfToken = response.data.csrfToken;

      // save the CSRF token as a cookie
      document.cookie = `csrf=${csrfToken}; path=/;`;

    })
    .catch(error => {
      // handle the error here
      console.error(error);
    });
}

export default getCrsf;