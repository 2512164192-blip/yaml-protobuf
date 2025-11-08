<template>
  <div>
    <h3>Proto 预览</h3>
    <pre>{{ proto }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { generateProto } from '../utils/protoGen'
import { currentTemplate } from '../utils/storage'

const proto = computed(() => generateProto(currentTemplate.value))
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

pre {
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
  overflow: auto;
  background: #fafbfc;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 滚动条美化 */
pre::-webkit-scrollbar {
  width: 8px;
}

pre::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

pre::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  div {
    padding: 15px;
  }

  pre {
    width: 95%;
    height: 60vh;
    min-height: 300px;
  }

  h3 {
    font-size: 1.3rem;
  }
}
</style>
