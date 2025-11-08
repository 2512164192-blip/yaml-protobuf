<template>
  <div>
    <h3>编辑区</h3>
    <textarea :value="text" @input="(e) => update((e.target as HTMLTextAreaElement).value)"/>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { currentTemplate, updateTemplate } from '../utils/storage'

const text = ref<string>(currentTemplate.value?.content || '')

watch(currentTemplate, v => {
  text.value = v?.content || ''
})

function update(value: string) {
  text.value = value
  updateTemplate(value)
}
</script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 20px;
}

h3 {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
}

textarea {
  width: 90%;
  max-width: 800px;
  height: 70vh;
  min-height: 400px;
  padding: 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  background: #fafbfc;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

textarea:focus {
  outline: none;
  border-color: #3498db;
  background: white;
  box-shadow: 0 4px 16px rgba(52, 152, 219, 0.2);
}

textarea:hover {
  border-color: #bdc3c7;
  background: #f8f9fa;
}

/* 滚动条美化 */
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  div {
    padding: 15px;
  }

  textarea {
    width: 95%;
    height: 60vh;
    min-height: 300px;
  }

  h3 {
    font-size: 1.3rem;
  }
}
</style>
