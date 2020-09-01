<template>
  <i-form form-name="Добавить книгу"/>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import IForm from '@/components/IForm.vue';

  @Component({
    components: {
      IForm,
    },
  })
  export default class AddBook extends Vue {}
</script>
