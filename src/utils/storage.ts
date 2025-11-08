import { ref } from 'vue'

export interface Template {
  id: string
  name: string
  description: string
  format: string
  content: string
  createTime: number
  updateTime: number
  tags: string[]
}

const STORAGE_KEY = 'meta-templates-v1'

export const templates = ref<Template[]>(load())
export const currentTemplate = ref<Template | null>(null)

export function genId(): string {
  return 't-' + Date.now() + '-' + Math.floor(Math.random() * 999)
}

export function createTemplate(name: string, format: string = 'yaml'): Template {
  const now = Date.now()
  return {
    id: genId(),
    name,
    description: '',
    format,
    content: format === 'yaml' ? 'fields: []' : '<template>\n  <fields/>\n</template>',
    createTime: now,
    updateTime: now,
    tags: []
  }
}

function load(): Template[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveTemplates() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates.value))
}

export function setCurrentTemplate(id: string) {
  currentTemplate.value = templates.value.find(t => t.id === id) || null
}

export function updateTemplate(newContent: string) {
  if (currentTemplate.value) {
    currentTemplate.value.content = newContent
    saveTemplates()
  }
}
