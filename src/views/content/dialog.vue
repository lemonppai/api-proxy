<template>
  <n-modal v-model:show="visible" preset="dialog" title="接口" :showIcon="false" :mask-closable="false" style="width: 500px;" @after-leave="closed">
    <n-scrollbar style="height: 200px;">
      <n-tree
        block-line
        cascade
        checkable
        :data="treeData"
      />
    </n-scrollbar>

    <template #action>
      <n-button type="primary" @click="handleOk">导入</n-button>
      <n-button type="primary" @click="handleOk">导出</n-button>
    </template>
  </n-modal>
</template>

<script setup lang="jsx">
import { reactive, ref, onMounted } from 'vue'
import { useMessage, useLoadingBar } from 'naive-ui'

const props = defineProps({
  row: null,
})

const emit = defineEmits({
  close: null,
});

const visible = ref(false);

const files = toolkit.readFileList(`data/api/${props.row._id}`);

const treeData = reactive(
  files.map(file => {
    return {
      label: file,
      key: file,
    };
  })
);

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
