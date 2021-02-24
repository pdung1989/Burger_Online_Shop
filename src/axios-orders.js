import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burger-builder-react-c41d4-default-rtdb.firebaseio.com/'
});

export default instance;