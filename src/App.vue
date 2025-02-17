<template>
  <div>
    <nav  class="flex justify-between  px-3 shadow-md">
      <router-link to="/" class="">
        <img src="/src/assets/logo.svg" alt="logo"  class="p-3"/>
      </router-link>
      <div class="flex gap-5 items-center">
<router-link to="/" class="font-medium text-base">General Knowledge</router-link>
<router-link to="/maths" class="font-medium text-base">Algebra</router-link>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
}
</script>

<style scoped></style>
