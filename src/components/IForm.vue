<template>
  <v-row justify="center">
    <v-col cols="12" sm="8" md="6" lg="4">
      <v-form ref="form" @submit.prevent="submit">
        <v-card>
          <v-card-title v-if="formName">{{ formName }}</v-card-title>
          <v-card-text>
            <img v-if="image" :src="image" alt=""/>

            <v-text-field
                v-model="title"
                name="title"
                :rules="[
                  () => !!title || 'Это поле обязательно к заполнению',
                  () => !!title && title.length <= 30 || 'Заголовок должен быть не более 30 символов',
                ]"
                label="Заголовок книги"
                autofocus
                counter="30"
            />

            <v-text-field
                v-model="firstNameAuthor"
                name="firstNameAuthor"
                :rules="[
                  () => !!firstNameAuthor || 'Это поле обязательно к заполнению',
                  () => !!firstNameAuthor && firstNameAuthor.length <= 20 || 'Имя автора должен быть не более 20 символов',
                ]"
                label="Имя автора"
                counter="20"
            />

            <v-text-field
                v-model="lastNameAuthor"
                name="lastNameAuthor"
                :rules="[
                  () => !!lastNameAuthor || 'Это поле обязательно к заполнению',
                  () => !!lastNameAuthor && lastNameAuthor.length <= 20 || 'Фамилия автора должен быть не более 20 символов',
                ]"
                label="Фамилия автора"
                counter="20"
            />

            <v-text-field
                v-model="numberOfPages"
                name="numberOfPages"
                :rules="[
                  () => !!numberOfPages || 'Это поле обязательно к заполнению',
                  () => !!numberOfPages && +numberOfPages < 10000 || 'Количество страниц должено быть не более 10000 страниц',
                ]"
                label="Количество страниц"
                maxlength="5"
                @input.native="checkNumber($event, 'numberOfPages')"
            />

            <v-text-field
                v-model="publisher"
                name="publisher"
                :rules="[
                  () => !!publisher && publisher.length <= 20 || 'Название издательства должен быть не более 30 символов',
                ]"
                label="Название издательства"
                counter="30"
            />

            <v-text-field
                v-model="yearOfPublication"
                name="yearOfPublication"
                :rules="[
                  () => !!yearOfPublication && +yearOfPublication >= 1800 || 'Год публикации должен быть не раньше 1800 год',
                ]"
                label="Год публикации"
                maxlength="4"
                @input.native="checkNumber($event, 'yearOfPublication')"
            />

            <v-text-field
                v-model="releaseDate"
                name="releaseDate"
                label="Дата выхода в тираж"
                type="date"
                :error-messages="errorMessage"
                @input.native="checkReleaseDate($event, 'releaseDate')"
            />

            <v-spacer class="mt-12"></v-spacer>

            <v-file-input
                v-model="file"
                type="file"
                label="Загрузить обложку"
                @change="createImage">
            </v-file-input>
          </v-card-text>

          <v-spacer class="mt-12"></v-spacer>

          <v-card-actions>
            <v-btn
                text
                :to="{ name: 'main' }"
            >
              Отмена
            </v-btn>
            <v-spacer/>
            <v-btn
                color="primary"
                :disabled="!isFormValid"
                @click="submit"
            >
              {{ edit ? 'Сохранить' : 'Добавить' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {Book} from '@/views/types';

  type NumbersField = 'numberOfPages' | 'yearOfPublication';

  @Component
  export default class IForm extends Vue {
    private title: string = '';
    private firstNameAuthor: string = '';
    private lastNameAuthor: string = '';
    private numberOfPages: string = '';
    private yearOfPublication: string = '';
    private publisher: string = '';
    private releaseDate: Date | null = null;
    private image: any = null;
    private bookId!: number;
    private bookList: Book[] = [];
    private file: any = null;
    private errorMessage: string = '';
    private localData!: Book;

    @Prop({
      type: Object,
      default: {},
    })
    private data!: Book;

    @Prop({type: Number})
    private id!: number;

    @Prop({type: String, default: ''})
    private formName!: string;

    @Prop({type: Boolean, default: false})
    private edit?: boolean;

    private get isFormValid(): boolean {
      return !!(
          this.title &&
          this.firstNameAuthor &&
          this.lastNameAuthor &&
          this.numberOfPages
      );
    }

    private get books() {
      return this.bookList = JSON.parse(localStorage.getItem('book-list') || '[]');
    }

    protected createImage(file: Blob) {
      const image = new Image();
      const reader = new FileReader();

      reader.onload = (e: Event) => {
        this.image = (e.target as IDBOpenDBRequest).result;
        this.set('img');
      };

      reader.readAsDataURL(file);
    }

    protected get(key: string) {
      if (!this.image) {
        return;
      }

      this.image = localStorage.getItem(key) as string;
    }

    protected set(key: string) {
      if (!this.image) {
        return;
      }

      try {
        localStorage.setItem(key, this.image);
      } catch (e) {
        console.log('=>', e);
      }
    }

    protected submit() {
      this.bookList = JSON.parse(localStorage.getItem('book-list') || '[]');

      this.localData = {
        title: this.title,
        firstNameAuthor: this.firstNameAuthor,
        lastNameAuthor: this.lastNameAuthor,
        numberOfPages: this.numberOfPages,
      };

      if (this.publisher) {
        this.localData.publisher = this.publisher;
      }

      if (this.yearOfPublication) {
        this.localData.yearOfPublication = this.yearOfPublication;
      }

      if (this.releaseDate) {
        this.localData.releaseDate = this.releaseDate;
      }

      if (this.image) {
        this.localData.image = this.image;
      }

      if (this.edit) {
        // Редактирование
        this.bookList[this.id] = this.localData;
      } else {
        // Новая запись
        this.bookList.push(this.localData);
      }

      const serialBookList = JSON.stringify(this.bookList);

      localStorage.setItem('book-list', serialBookList);
      localStorage.removeItem('img');

      this.$router.push({name: 'main'});
    }

    private created() {
      if (!this.data) {
        return;
      }

      this.localData = this.data;
      this.title = this.localData.title;
      this.firstNameAuthor = this.localData.firstNameAuthor;
      this.lastNameAuthor = this.localData.lastNameAuthor;
      this.numberOfPages = this.localData.numberOfPages;

      if (this.localData.publisher) {
        this.publisher = this.localData.publisher;
      }

      if (this.localData.yearOfPublication) {
        this.yearOfPublication = this.localData.yearOfPublication;
      }

      if (this.localData.releaseDate) {
        this.releaseDate = this.localData.releaseDate;
      }

      if (this.localData.image) {
        this.image = this.localData.image;
      }
    }

    private checkNumber(ev: KeyboardEvent, field: NumbersField) {
      const input = (ev.target as HTMLInputElement);
      let value = input.value;

      if (!value) {
        return;
      }

      this[field] = value.replace(/[^\d]/gi, '');
      value = this[field];
    }

    private checkReleaseDate(ev: KeyboardEvent, field: NumbersField) {
      const input = (ev.target as HTMLInputElement);
      const value = input.value;

      if (!value) {
        return;
      }

      this[field] = value;

      const minDate = new Date('1800-01-01T00:00:00');
      const date = new Date(this[field] + 'T00:00:00');
      const invalidDate: boolean = date.getTime() < minDate.getTime();

      if (invalidDate) {
        this.errorMessage = 'Дата выхода в тираж должно быть не раньше 01.01.1800';
        return;
      }

      this.errorMessage = '';
    }
  }
</script>

<style lang="stylus">
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #fff inset;
    box-shadow: 0 0 0 30px #fff inset;
  }

  img {
    height: 200px;
    display: block;
    margin: 0 auto;
  }
</style>
