<template>
  <div>
    <!-- <div>
      <button @click="insertText">insert text</button>
      <button @click="printHtml">print html</button>
      <button @click="disable">disable</button>
    </div> -->
    <div style="border: 1px solid #ccc; margin-top: 10px">
      <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        style="border-bottom: 1px solid #ccc"
      />
      <Editor
        :defaultConfig="editorConfig"
        :mode="mode"
        v-model="valueHtml"
        style="height: 400px; overflow-y: hidden"
        @onCreated="handleCreated"
        @onChange="handleChange"
        @onDestroyed="handleDestroyed"
        @onFocus="handleFocus"
        @onBlur="handleBlur"
        @customAlert="customAlert"
        @customPaste="customPaste"
      />
    </div>
    <!-- <div style="margin-top: 10px">
      <textarea
        v-model="valueHtml"
        readonly
        style="width: 100%; height: 200px; outline: none"
      ></textarea>
    </div> -->
  </div>
</template>

<script lang="ts">
import '@wangeditor/editor/dist/css/style.css';
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { IEditorConfig} from '@wangeditor/editor';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import {baseURL} from '@/utils/http/index'

export default {
  components: { Editor, Toolbar },
  setup() {
    // 编辑器实例，必须用 shallowRef，重要！
    const editorRef = shallowRef();

    // 内容 HTML
    const valueHtml = ref('');

    // 模拟 ajax 异步获取内容
    // onMounted(() => {
    //   setTimeout(() => {
    //     valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>';
    //   }, 1500);
    // });

    const toolbarConfig = {};
    const editorConfig: Partial<IEditorConfig> = { placeholder: '请输入内容...', MENU_CONF: {} };

    //上传文件配置
    (editorConfig as any).MENU_CONF['uploadImage'] = {
      server: baseURL+'/upload/rich_editor_upload',
      fieldName: 'custom-field-name',
      base64LimitSize: 10 * 1024, // 10kb
      // 自定义插入图片
      customInsert(res: any, insertFn: any) {  // TS 语法
         let url=res.data.url
         url=url.indexOf('http')!==0?`${baseURL}${url}`:url
         insertFn(url)
      },
    };


    //上传视频配置
    (editorConfig as any).MENU_CONF['uploadVideo'] = {
     server: baseURL+'/upload/rich_editor_upload',
      // 自定义插入
      customInsert(res: any, insertFn: any) {  // TS 语法
       let url=res.data.url
       url=url.indexOf('http')!==0?`${baseURL}${url}`:url
       insertFn(url)
    },
    };

    // 组件销毁时，也及时销毁编辑器，重要！
    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return;

      editor.destroy();
    });

    // 编辑器回调函数
    const handleCreated = (editor:any) => {
      console.log('created', editor);
      console.log(editor.getMenuConfig('uploadImage'));
      
      editorRef.value = editor; // 记录 editor 实例，重要！
    };
    const handleChange = (editor:any) => {
      // console.log('change:', editor.getHtml());
    };
    const handleDestroyed = (editor:any) => {
      console.log('destroyed', editor);
    };
    const handleFocus = (editor:any) => {
      console.log('focus', editor);
    };
    const handleBlur = (editor:any) => {
      console.log('blur', editor);
    };
    const customAlert = (info:any, type:any) => {
      alert(`【自定义提示】${type} - ${info}`);
    };
    const customPaste = (editor:any, event:any, callback:any) => {
      console.log('ClipboardEvent 粘贴事件对象', event);
      // 自定义插入内容
      // editor.insertText('xxx');

      // 返回值（注意，vue 事件的返回值，不能用 return）
      callback(true); // 返回 false ，阻止默认粘贴行为
      // callback(true) // 返回 true ，继续默认的粘贴行为
    };

    const insertText = () => {
      const editor = editorRef.value;
      if (editor == null) return;

      editor.insertText('hello world');
    };

    const printHtml = () => {
      const editor = editorRef.value;
      if (editor == null) return;
      console.log(editor.getHtml());
    };

    const disable = () => {
      const editor = editorRef.value;
      if (editor == null) return;
      editor.disable()
    };
    
    return {
      editorRef,
      mode: 'default',
      valueHtml,
      toolbarConfig,
      editorConfig,
      handleCreated,
      handleChange,
      handleDestroyed,
      handleFocus,
      handleBlur,
      customAlert,
      customPaste,
      insertText,
      printHtml,
      disable
    };
  },
};
</script>
