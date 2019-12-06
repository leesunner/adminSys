<template>
  <quill-editor
    v-model="content"
    ref="myQuillEditor"
    :options="editorOption"
    @focus="onEditorFocus"
    @blur="onEditorBlur"
    @change="onEditorChange">
    >
  </quill-editor>
</template>

<script>
  import {quillEditor} from 'vue-quill-editor';
  // import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  // import 'quill/dist/quill.bubble.css';
  import * as Quill from 'quill'; // 富文本基于quill
  export default {
    name: "editor",
    components: {
      quillEditor
    },
    data() {
      return {
        editor: null,   // 富文本编辑器对象
        content: `在这里输入内容...`, // 富文本编辑器默认内容
        editorOption: { //  富文本编辑器配置
          modules: {
            toolbar: '#toolbar'
          },
          theme: 'snow',
          placeholder: '请输入正文'
        },
      }
    },
    mounted() {
      this.editor = this.$refs.myQuillEditor.quill;
    },
    beforeDestroy() {
      this.editor = null;
      delete this.editor;
    },
    methods: {
      // 准备富文本编辑器
      onEditorReady(editor) {
      },
      // 富文本编辑器 失去焦点事件
      onEditorBlur(e) {
      },
      // 富文本编辑器 获得焦点事件
      onEditorFocus(e) {
      },
      // 富文本编辑器 内容改变事件
      onEditorChange(e) {
      },
    }
  }
</script>

<style scoped>
</style>
