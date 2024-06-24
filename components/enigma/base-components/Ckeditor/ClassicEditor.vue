<script setup lang="ts">
import ClassicEditor from "@binay7587/ckeditor5-full-free";
import { ref, withDefaults, onMounted, inject } from "vue";
import { type CkeditorElement, init } from "./ckeditor";

export type ProvideClassicEditor = (el: CkeditorElement) => void;

interface CkeditorProps {
  modelValue: string;
  config?: any;
  as?: string | object;
  disabled?: boolean;
  refKey?: string;
}

interface CkeditorEmit {
  (e: "update:modelValue", value: string): void;
  (e: "focus", value: string, editor: any): void;
  (e: "blur", value: string, editor: any): void;
  (e: "ready", editor: string): void;
}

const props = withDefaults(defineProps<CkeditorProps>(), {
  as: "Div",
  config: {
    removePlugins: ['Title'],
    link: {
      decorators: {
        openInNewTab: {
          mode: 'manual',
          label: 'Open in a new tab',
          attributes: {
            target: '_blank',
            rel: 'noopener noreferrer'
          }
        }
      }
    },
    fontFamily: {
      options: [
        'default',
        'nevis',
        'montserrat',
        'Arial',
        'Courier New',
        'Georgia',
        'Tahoma',
        'Times New Roman',
        'Trebuchet MS',
      ]
    },
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "alignment",
      "|",
      "fontFamily",
      "fontSize",
      "fontColor",
      "fontBackgroundColor",
      "|",
      "highlight",
      "|",
      "removeFormat",
      "|",
      "sourceEditing",
      "|",
      "insertTable",
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "|",
      "link",
      "imageInsert",
      "|",
      "subscript",
      "superscript",
      "|",
      "bulletedList",
      "numberedList",
      "|",
      "indent",
      "outdent",
      "|",
      "blockQuote",
      "|",
      "code",
      "|",
      "horizontalLine",
      "|",
      "undo",
      "redo",
      "|",
      "findAndReplace",
      "|",
      "selectAll",
    ],
  },
});



const emit = defineEmits<CkeditorEmit>();
const editorRef = ref<CkeditorElement>();
const cacheData = ref("");

const bindInstance = (el: CkeditorElement) => {
  if (props.refKey) {
    const bind = inject<ProvideClassicEditor>(`bind[${props.refKey}]`);
    if (bind) {
      bind(el);
    }
  }
};

const vEditorDirective = {
  mounted(el: CkeditorElement) {
    init(el, ClassicEditor, { props, emit, cacheData });
  },
};

onMounted(() => {
  if (editorRef.value) {
    bindInstance(editorRef.value);
  }
});
</script>

<template>
  <component :is="props.as" ref="editorRef" v-editor-directive class="select"></component>
</template>
