<template>
  <div class="wrapper">
    <div class="nav">
      <span>Сортировка по:</span>

      <v-btn
          name="sort-title"
          color="blue-grey"
          class="white--text"
          @click="sortByTitle"
      >
        заголовкам
      </v-btn>

      <v-btn
          name="sort-publication"
          color="blue-grey"
          class="white--text"
          @click="sortByPublication"
      >
        году публикации
      </v-btn>
    </div>

    <div class="card-container">
      <v-card class="card card-add-book">
        <v-btn
            text
            color="success"
            :to="{ name: 'add-book' }"
        >
          <v-icon>mdi-plus-circle-outline</v-icon>
        </v-btn>
      </v-card>

      <v-card
          v-model="bookList"
          v-for="(item, index) in books"
          class="card"
      >
        <img :src="item.image" alt="">

        <v-card-text v-if="item">
          <h2 v-if="item.title">{{ item.title }}</h2>
          <p v-if="item.firstNameAuthor" class="card__author">
            автор: <span>{{ item.firstNameAuthor }} {{ item.lastNameAuthor }}</span>
          </p>
          <p v-if="item.numberOfPages" class="card__details">
            кол-во страниц: <span>{{ item.numberOfPages }}</span>
          </p>
          <p v-if="item.publisher" class="card__details">
            издатель: <span>{{ item.publisher }}</span>
          </p>
          <p v-if="item.yearOfPublication" class="card__details">
            год публикации: <span>{{ item.yearOfPublication }}</span>
          </p>
          <p v-if="item.releaseDate" class="card__details">
            дата выхода в тираж: <span>{{ item.releaseDate }}</span>
          </p>
        </v-card-text>

        <v-card-actions>
          <v-btn
              text
              color="success"
              :to="{ name: 'edit-book', params: {id: index } }"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>

          <v-spacer/>

          <v-btn
              text
              color="error"
              @click="deleteBook(index)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div><!-- /card-container -->
  </div><!-- /wrapper -->
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {Book} from '@/views/types';

  @Component
  export default class BookGallery extends Vue {
    private bookList: Book[] = [];

    private get books() {
      return this.bookList = JSON.parse(localStorage.getItem('book-list') || '[]');
    }

    protected sortByTitle() {
      this.bookList.sort((a: Book, b: Book) => a.title > b.title ? 1 : -1);
    }

    protected sortByPublication() {
      this.bookList.sort((a: Book, b: Book) => {
        if (!a.yearOfPublication && b.yearOfPublication) {
          return 1;
        }

        if (a.yearOfPublication && !b.yearOfPublication) {
          return -1;
        }

        if (a.yearOfPublication && b.yearOfPublication) {
          if (a.yearOfPublication > b.yearOfPublication) {
            return 1;
          }
          if (a.yearOfPublication < b.yearOfPublication) {
            return -1;
          }
        }

        return 0;
      });
    }

    protected editBook(index: number) {
      this.$router.push({name: 'edit-book'});
    }

    protected deleteBook(index: number) {
      this.bookList.splice(index, 1);
      localStorage['book-list'] = JSON.stringify(this.bookList);
    }
  }
</script>

<style lang="stylus">
  .wrapper {
    margin: 10%;
  }

  .nav {
    display: flex;
    flex-wrap: wrap;

    > * {
      margin-right: 12px;

      @media (max-width: 480px) {
        width: 100%;
        margin-bottom: 12px;
      }
    }

    span {
      font-size: 0.875rem;
      font-weight 500;
      text-transform: uppercase;
      letter-spacing: 0.0892857143em;
      display: flex;
      align-items: center;
    }
  }

  .card-container {
    margin-top: 40px;
    display: flex;
    flex-wrap: wrap;
  }

  .card {
    width: 300px;
    min-height: 400px;
    padding: 16px;
    border: 1px solid #8a969e;
    border-radius: 4px;
    margin: 16px;

    img {
      width: 100%;
      height: 300px;
      display: block;
      margin: 0 auto;
    }

    h2 {
      font-size: 1.3rem;
      font-weight: bold;
      line-height: 1.4rem;
      margin-bottom: 12px;
    }

    span {
      font-weight: bold;
    }

    &__author {
      font-size: .9rem;
      margin-bottom: 20px !important;
    }

    &__details {
      font-size: .8rem;
      margin-bottom: 4px !important;
    }

    &-add-book {
      display: flex;
      justify-content: center;

      .v-icon {
        font-size 10rem;
      }

      a {
        width: 100%;
        height: 100% !important;
      }
    }

    .v-card__text {
      margin-bottom: 40px;
    }

    .v-card__actions {
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
    }
  }
</style>
