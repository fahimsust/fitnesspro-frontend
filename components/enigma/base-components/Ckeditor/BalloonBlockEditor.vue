<script setup lang="ts">
import BalloonBlockEditor from "@ckeditor/ckeditor5-build-balloon-block";
import { ref, withDefaults, onMounted, inject } from "vue";
import { type CkeditorElement, init } from "./ckeditor";

export type ProvideBalloonBlockEditor = (el: CkeditorElement) => void;

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
  as: "div",
  config: {},
});

const emit = defineEmits<CkeditorEmit>();
const editorRef = ref<CkeditorElement>();
const cacheData = ref("");

const bindInstance = (el: CkeditorElement) => {
  if (props.refKey) {
    const bind = inject<ProvideBalloonBlockEditor>(`bind[${props.refKey}]`);
    if (bind) {
      bind(el);
    }
  }
};

const vEditorDirective = {
  mounted(el: CkeditorElement) {
    init(el, BalloonBlockEditor, { props, emit, cacheData });
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
