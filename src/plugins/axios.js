import Vue from 'vue';
import axios from 'axios';

axios.defaults.baseURL = 'http://todo-list.test/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

Vue.prototype.$axios = axios;