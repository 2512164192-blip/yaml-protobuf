<template>
  <div class="editor">
    <EditorPanel />
    <PreviewPanel />
    <ProtoPreview />
  </div>
</template>

<script lang="ts" setup name="EditorPage" >
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { setCurrentTemplate } from '../utils/storage'

import EditorPanel from '../components/EditorPanel.vue'
import PreviewPanel from '../components/PreviewPanel.vue'
import ProtoPreview from '../components/ProtoPreview.vue'

const route = useRoute()

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    setCurrentTemplate(id)
  }
})
</script>

<style scoped>
.editor {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 为每个面板区域添加样式 */
.editor > * {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow:
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 面板悬停效果 */
.editor > *:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 30px rgba(0, 0, 0, 0.12),
    0 2px 4px rgba(0, 0, 0, 0.06);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .editor {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
  }

  .editor > *:last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .editor {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }
}

/* 滚动条美化 */
.editor ::-webkit-scrollbar {
  width: 6px;
}

.editor ::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.editor ::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.editor ::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
