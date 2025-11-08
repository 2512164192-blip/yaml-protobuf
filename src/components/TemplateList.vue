<template>
  <div class="template-list">
    <div class="header">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索模板..."
        />
        <div class="filter-tags">
          <span
            v-for="format in ['yaml', 'xml']"
            :key="format"
            :class="['tag', { active: selectedFormat === format }]"
            @click="toggleFormat(format)"
          >
            {{ format.toUpperCase() }}
          </span>
        </div>
      </div>
      <button class="create-btn" @click="create">
        <span class="plus">+</span> 新建模板
      </button>
    </div>

    <div class="templates-grid">
      <div v-for="t in filteredTemplates" :key="t.id" class="template-card">
        <div class="card-header" @click="toggleCollapse(t.id)">
          <div class="header-left">
            <span class="collapse-icon" :class="{ collapsed: isCollapsed(t.id) }">▼</span>
            <h3>{{ t.name }}</h3>
            <span :class="['format-badge', t.format]">{{ t.format }}</span>
          </div>
          <div class="actions">
            <button class="edit-btn" @click.stop="emit('open', t.id)">编辑</button>
            <button class="delete-btn" @click.stop="confirmDelete(t)">删除</button>
          </div>
        </div>

        <div class="card-content" :class="{ collapsed: isCollapsed(t.id) }">
          <p class="description">{{ t.description || '暂无描述' }}</p>

          <div class="code-preview">
            <pre>{{ getPreviewContent(t.content) }}</pre>
          </div>

          <div class="tags">
            <span v-for="tag in t.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <div class="time-info">
            <small>创建于: {{ formatDate(t.createTime) }}</small>
            <small>更新于: {{ formatDate(t.updateTime) }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { templates, saveTemplates, createTemplate, Template } from '../utils/storage'

const emit = defineEmits<{
  (event: 'open', id: string): void
}>()

const searchQuery = ref('')
const selectedFormat = ref<string | null>(null)
const collapsedCards = ref<Set<string>>(new Set())

function toggleCollapse(id: string) {
  if (collapsedCards.value.has(id)) {
    collapsedCards.value.delete(id)
  } else {
    collapsedCards.value.add(id)
  }
}

function isCollapsed(id: string): boolean {
  return collapsedCards.value.has(id)
}

function getPreviewContent(content: string): string {
  const lines = content.split('\n')
  if (lines.length <= 3) return content
  return lines.slice(0, 3).join('\n') + '\n...'
}

const filteredTemplates = computed(() => {
  return templates.value.filter(t => {
    const matchesSearch = !searchQuery.value ||
      t.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesFormat = !selectedFormat.value || t.format === selectedFormat.value

    return matchesSearch && matchesFormat
  })
})

function toggleFormat(format: string) {
  selectedFormat.value = selectedFormat.value === format ? null : format
}

function create() {
  const template = createTemplate('新建模板')
  templates.value.push(template)
  saveTemplates()
}

function confirmDelete(template: Template) {
  if (confirm(`确定要删除模板 "${template.name}" 吗？`)) {
    const i = templates.value.findIndex(t => t.id === template.id)
    if (i >= 0) templates.value.splice(i, 1)
    saveTemplates() 
  }
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
/* 布局 */
.template-list { padding: 20px; max-width: 1200px; margin: 0 auto; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.search-bar { display: flex; flex-direction: column; gap: 8px; flex: 1; margin-right: 16px; }
.filter-tags, .tags, .actions, .header-left { display: flex; gap: 8px; }
.tags { flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.time-info { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }

/* 输入框 */
.search-bar input {
  padding: 8px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  max-width: 400px;
}

/* 按钮通用样式 */
button {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.create-btn {
  padding: 8px 16px;
  background: #2ecc71;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}
.create-btn:hover { background: #27ae60; }
.plus { font-size: 20px; font-weight: bold; }

.actions button { flex: 1; padding: 6px 12px; font-size: 14px; color: white; }
.edit-btn { background: #3498db; }
.edit-btn:hover { background: #2980b9; }
.delete-btn { background: #e74c3c; }
.delete-btn:hover { background: #c0392b; }

/* 标签 */
.tag {
  padding: 4px 12px;
  border-radius: 16px;
  background: #e1e5e9;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}
.tag.active { background: #3498db; color: white; }
.tags .tag { font-size: 12px; padding: 2px 8px; }

/* 卡片网格 */
.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.template-card {
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 16px;
  background: white;
  transition: all 0.2s;
}
.template-card:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  cursor: pointer;
  user-select: none;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
}
.card-header:hover { background: #f8f9fa; }
.card-header h3 { margin: 0; font-size: 18px; color: #2c3e50; }

/* 折叠图标 */
.collapse-icon {
  font-size: 12px;
  color: #95a5a6;
  transition: transform 0.3s;
}
.collapse-icon.collapsed { transform: rotate(-90deg); }

/* 卡片内容 */
.card-content {
  max-height: 1000px;
  opacity: 1;
  overflow: hidden;
  transition: all 0.3s;
}
.card-content.collapsed { max-height: 0; opacity: 0; margin: 0; padding: 0; }

/* 代码预览 */
.code-preview {
  margin: 12px 0;
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}
.code-preview pre {
  margin: 0;
  padding: 12px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 格式徽章 */
.format-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
}
.format-badge.yaml { background: #2ecc71; }
.format-badge.xml { background: #e74c3c; }

/* 其他 */
.description { color: #7f8c8d; font-size: 14px; margin: 0 0 12px; }
.time-info small { color: #95a5a6; }

/* 响应式 */
@media (max-width: 768px) {
  .template-list { padding: 12px; }
  .header { flex-direction: column; gap: 12px; }
  .search-bar { margin-right: 0; }
  .create-btn { width: 100%; justify-content: center; }
  .templates-grid { grid-template-columns: 1fr; }
}
</style>
