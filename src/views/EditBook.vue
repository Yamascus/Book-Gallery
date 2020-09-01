<template>
  <i-form
      :data="this.book"
      :id="this.bookId"
      edit
      form-name="Редактирование книги"
  />
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {Book} from '@/views/types';
  import IForm from '../components/IForm.vue';

  @Component({
    components: {
      IForm,
    },
  })
  export default class EditBook extends Vue {
    private bookId!: number;
    private book!: Book;
    private bookList: Book[] = [];

    private get books() {
      return this.bookList = JSON.parse(localStorage.getItem('book-list') || '[]');
    }

    private created() {
      this.bookId = +this.$route.params.id;
      this.book = this.books[this.bookId];
    }
  }
</script>

