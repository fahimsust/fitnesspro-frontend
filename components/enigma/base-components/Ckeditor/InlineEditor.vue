<script setup lang="ts">
import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import { ref, withDefaults, onMounted, inject } from "vue";
import { type CkeditorElement, init } from "./ckeditor";

export type ProvideInlineEditor = (el: CkeditorElement) => void;

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
  as: "Textarea",
  config: {},
});

const emit = defineEmits<CkeditorEmit>();
const editorRef = ref<CkeditorElement>();
const cacheData = ref("");

const bindInstance = (el: CkeditorElement) => {
  if (props.refKey) {
    const bind = inject<ProvideInlineEditor>(`bind[${props.refKey}]`);
    if (bind) {
      bind(el);
    }
  }
};

const vEditorDirective = {
  mounted(el: CkeditorElement) {
    init(el, InlineEditor, { props, emit, cacheData });
  },
};

onMounted(() => {
  if (editorRef.value) {
    bindInstance(editorRef.value);
  }
});
</script>

<template>
  <component
    :is="props.as"
    ref="editorRef"
    v-editor-directive
    class="select"
  ></component>
</template>
