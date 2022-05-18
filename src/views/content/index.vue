<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <HelloWorld msg="Hello Vue 3 + Vite" /> -->
  <div class="content">
    <n-tabs type="line" animated>
      <n-tab-pane tab="应用" name="0">
        <!-- <div style="padding: 12px 0;">
          <n-button type="primary" ghost @click="handleAdd">
            新增
          </n-button>
        </div> -->

        <n-data-table size="small" :max-height="500" :columns="columns" :data="tableData">
          <template #empty>
            <n-empty description="暂无数据"></n-empty>
          </template>
        </n-data-table>

        <div style="padding: 12px 0;">
          <n-button type="primary" style="width: 100%" ghost @click="handleAdd">
            <template #icon>
              <n-icon><AddSharp /></n-icon>
            </template>

            新增
          </n-button>
        </div>
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

     <n-modal v-model:show="visible" :mask-closable="false">
      <n-card
        style="width: 600px"
        title="编辑"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true">
        <n-form ref="formRef" label-placement="left" label-width="auto" require-mark-placement="right-hanging" :model="form" :rules="rules">
          <n-form-item path="name" label="应用名">
            <n-input v-model:value="form.name" />
          </n-form-item>

          <n-form-item path="url" label="应用路径">
            <n-input v-model:value="form.url" />
          </n-form-item>

          <n-form-item path="remark" label="备注">
            <n-input v-model:value="form.remark" type="textarea" />
          </n-form-item>
        </n-form>

        <template #footer>
          <n-space justify="end">
            <n-button @click="visible = false">取消</n-button>
            <n-button type="primary" @click="handleOk">确定</n-button>
          </n-space>
        </template>
      </n-card>
     </n-modal>
  </div>
</template>

<script setup lang="jsx">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from './components/HelloWorld.vue'
import { reactive, ref, onMounted } from 'vue'
import { useMessage, useLoadingBar } from 'naive-ui'
import { BugOutline, AddSharp } from '@vicons/ionicons5'

const message = useMessage();

const loadingBar = useLoadingBar();

const form = reactive({
  /* url: 'https://baidu.com',
  port: 8070, */
  _id: null,
  name: null,
  url: null,
  remark: null,
});

const rules = {
  name: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入应用名'
  },

  url: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入正确的路径',
    validator(rule, vlaue) {
      return /(http|https):\/\/([\w.]+\/?)\S*/.test(vlaue);
    }
  },
};

const columns = [
  {
    title: '应用名',
    key: 'name',
    minWidth: 100,
  },
  {
    title: '路径',
    key: 'url',
    minWidth: 160,
    render(row, index) {
      return (
        <n-button text type="info" onClick={handleOpen.bind(null, row)}>
          { row.url }
        </n-button>
      );
    }
  },
  /* {
    title: '路径',
    key: 'url',
    minWidth: 160,
    render(row, index) {
      return (
        <n-button text type="info" onClick={handleOpen.bind(null, row)}>
          { row.url }
        </n-button>
      );
    }
  }, */
  {
    title: '备注',
    key: 'remark',
    minWidth: 160,
  },
  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    width: 200,
    render(row, index) {
      return (
       <n-space>
         <n-button type="primary" size="small" ghost onClick={handleEdit.bind(null, row)}>编辑</n-button>

         <n-button type="info" size="small" ghost onClick={handleEdit.bind(null, row)}>导出</n-button>

         <n-popconfirm positive-text="确定" negative-text="取消" v-slots={
           {
             default: () => <>是否删除？</>,

             trigger: () => (
               <n-button type="error" size="small" ghost>删除</n-button>
             )
           }
         } onPositiveClick={handleRemove.bind(null, row)}>
        </n-popconfirm>
       </n-space>
      );
    },
  }
];

const tableData = ref([]);

const visible = ref(false);

const formRef = ref(null);

onMounted(() => {
  refresh();
});

const handleOpen = (row) => {
  loadingBar.start();

  message.info(`正在打开 ${row.url}`, {
    onAfterLeave() {
      loadingBar.finish();
    }
  });

  toolkit.open(row.url, row._id);
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

const refresh = async () => {
  const { data } = await api.project.get();

  if (data.status == 'ok') {
    tableData.value = data.data;
  }
  else {
    message.warn(data.msg);
  }
}

const handleAdd = () => {
  /* data.push({
    name: data.length,
  }); */

  // console.log(formRef)

  for (let key in form) {
    form[ key ] = null;
  }

  formRef.value?.restoreValidation();

  visible.value = true;
}

const handleEdit = (row) => {
  /* data.push({
    name: data.length,
  }); */

  for (let key in form) {
    form[ key ] = row[ key ];
  }

  formRef.value?.restoreValidation();

  visible.value = true;
}

const handleRemove = async (row) => {
  console.log(row);

  const { data } = await api.project.remove({ _id: row._id });

  if (data.status == 'ok') {
    message.success(data.msg);

    refresh();
  }
  else {
    message.warn(data.msg);
  }
}

const handleOk = () => {
  /* db.loadDatabase();

  db.project.insert([{ a: 5 }, { a: 42 }], function (err, newDocs) {
    // Two documents were inserted in the database
    // newDocs is an array with these documents, augmented with their _id

    if (!err) {
      visible.value = false;

      message.success('新增成功');
    }
  }); */
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const { data } = await api.project[ !form._id ? 'insert' : 'update' ]({
        ...form,
      });

      // console.log(data);

      if (data.status == 'ok') {
        message.success(data.msg);

        refresh();

        visible.value = false;
      }
      else {
        message.warn(data.msg);
      }
    }
  });
}
</script>

<style>
.content {
  /* padding: 100px; */
}
</style>
