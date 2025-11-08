<template>
  <div>
    <h3>结构预览</h3>
    <pre :class="{ error: isError }">{{ parsed }}</pre>
    <div v-if="isError" class="error-message">
      <span class="error-icon">⚠</span>
      {{ errorMessage }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { parseContent } from '../utils/yamlXml'
import { currentTemplate } from '../utils/storage'

const isError = ref(false)
const errorMessage = ref('')
const parsedContent = ref('')

watch(() => currentTemplate.value?.content, (newContent) => {
  try {
    const result = JSON.stringify(parseContent(newContent || ''), null, 2)
    parsedContent.value = result
    isError.value = false
    errorMessage.value = ''
  }
  catch (e: unknown) {
    isError.value = true
    if (e instanceof Error) {
      errorMessage.value = e.message
      parsedContent.value = '解析结果将在您修复以下错误后显示'
    } else {
      errorMessage.value = '未知错误'
      parsedContent.value = '解析结果将在您修复错误后显示'
    }
  }
}, { immediate: true })

const parsed = computed(() => parsedContent.value)
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

/* 错误样式 */
pre.error {
  border-color: #e74c3c;
  background: #fff5f5;
}

.error-message {
  width: 90%;
  max-width: 800px;
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  background: #fff5f5;
  color: #e74c3c;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeIn 0.3s ease;
}

.error-icon {
  font-size: 20px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

  .error-message {
    width: 95%;
  }
}
</style>
