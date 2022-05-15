<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Hello Vue 3 + Vite" /> -->
  <div class="content">
    <n-tabs type="line" animated>
      <n-tab-pane tab="应用" name="0">
        <n-form inline label-placement="left" label-width="auto" :model="form" :rules="rules">
          <n-form-item path="url" label="地址">
            <!-- {{ form }} -->
            <n-input v-model:value="form.url" @keydown.enter.prevent />
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleOpen">确定</n-button>
          </n-form-item>
        </n-form>

        <n-alert title="应用状态" type="info">
          打开
        </n-alert>
      </n-tab-pane>
      <n-tab-pane tab="服务" name="1">
        <n-form inline label-placement="left" :model="form" :rules="rules">
          <n-form-item path="url" label="端口号">
            <!-- {{ form }} -->
            <n-input-number v-model:value="form.port" placeholder="默认端口号：8070" />
          </n-form-item>

          <n-form-item>
            <n-space>
              <n-button type="primary" @click="handleCreate">启动</n-button>

              <n-button @click="handleClose">关闭</n-button>
            </n-space>
          </n-form-item>
        </n-form>

        <n-alert title="服务状态" type="info">
          http://localhost:{{port || 8070}}
        </n-alert>
      </n-tab-pane>

      <template #suffix>
        <n-button quaternary circle type="primary" @click="openDevTools">
          <template #icon>
            <n-icon><BugOutline /></n-icon>
          </template>
        </n-button>
      </template>
    </n-tabs>
  </div>
</template>

<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from './components/HelloWorld.vue'
import { reactive } from 'vue'
import { useMessage } from 'naive-ui'
import { BugOutline } from '@vicons/ionicons5'

const message = useMessage();

const form = reactive({
  url: 'https://baidu.com',
  port: 8070,
});

const rules = {};

const handleOpen = () => {
  message.info('正在打开 https://baidu.com');

  toolkit.open(form.url);
};

const handleCreate = () => {
  message.success('服务已启动');

  toolkit.createServe(form.port);
};

const handleClose = () => {
  message.success('服务已关闭');

  toolkit.closeServe();
};

const openDevTools = () => {
  toolkit.openDevTools();
};
</script>

<style>
.content {
  padding: 100px;
}
</style>
