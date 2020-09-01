import Vue from 'vue';
import Router from 'vue-router';
import BookGallery from './views/BookGallery.vue';
import AddBook from '@/views/AddBook.vue';
import EditBook from '@/views/EditBook.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: BookGallery,
    },
    {
      path: '/add-book',
      name: 'add-book',
      component: AddBook,
    },
    {
      path: '/edit-book/:id',
      name: 'edit-book',
      component: EditBook,
    },
  ],
});
