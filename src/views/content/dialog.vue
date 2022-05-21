<template>
  <n-modal v-model:show="visible" :mask-closable="false" @after-leave="closed">
    <n-card
      style="width: 600px"
      title="接口"
      :bordered="false"
      size="medium"
      role="dialog"
      aria-modal="true">
      <n-tree
        block-line
        cascade
        checkable
        :data="treeData"
      />
      <template #footer>
        <n-space justify="end">
          <n-button @click="close">取消</n-button>
          <n-button type="primary" @click="handleOk">确定</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="jsx">
import { reactive, ref, onMounted, defineEmits } from 'vue'
import { useMessage, useLoadingBar } from 'naive-ui'

const visible = ref(false);

const treeData = reactive([]);

const emit = defineEmits({
  close: null,
});

onMounted(() => {
  visible.value = true;
});

const close = () => {
  visible.value = false;
}

const closed = () => {
  setTimeout(() => {
    emit('close');
  }, 500);
}

const handleOk = () => {
  close();

};
</script>
