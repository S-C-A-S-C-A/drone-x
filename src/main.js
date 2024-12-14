import Vue from 'vue';
import App from './App.vue';

new Vue({
  el: '#app',
  render: h => h(App)
});

const obvious_bug = 3;
obvious_bug = 45;
