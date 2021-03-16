import Vue from 'vue';
import router from '@/router';
import store from '@/store';
import App from '@/App.vue';
import '@/plugins/vee-validate';
import '@/plugins/axios';
import TheAlertMessage from '@/components/Partials/TheAlertMessage';
import TheMessageValidate from '@/components/Partials/TheMessageValidate';

import '@/assets/css/tailwind.css';

Vue.component('AlertMessage', TheAlertMessage);
Vue.component('ErrorMessageValidate', TheMessageValidate);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
