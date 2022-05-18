<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Hello Vue 3 + Vite" /> -->
  <n-config-provider :theme="theme">
    <n-loading-bar-provider>
      <!-- <div>
        <n-space justify="end">
          <n-button quaternary @click="toggleTheme">深色</n-button>
        </n-space>
      </div> -->

      <n-message-provider>
        <Content></Content>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Content from './views/content/index.vue'
import { ref } from 'vue'
import { darkTheme } from 'naive-ui'


const theme = ref(null);

const toggleTheme = () => {
  if (theme.value) {
    theme.value = null;

    document.body.style.backgroundColor = '';
  }
  else {
    theme.value = darkTheme;

    document.body.style.backgroundColor = 'rgb(16, 16, 20)';
  }
};
</script>

<style>
body {
  transition: background-color .3s;
}

#app {
  padding: 12px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}
</style>
