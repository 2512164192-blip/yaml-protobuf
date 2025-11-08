<template>
  <div class="templates">
    <h2>模板列表</h2>
    <TemplateList @open="openEditor" />
  </div>
</template>

<script lang="ts" setup>
import TemplateList from '../components/TemplateList.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
function openEditor(id: string) {
  router.push(`/editor/${id}`)
}
</script>

<style scoped>
.templates {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
}

h2 {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px 40px;
  margin: 0;
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 600;
  position: relative;
}

h2::before {
  content: '📋';
  margin-right: 12px;
  font-size: 2.2rem;
}

h2::after {
  content: '';
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #2980b9);
  border-radius: 2px;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .templates {
    padding: 15px;
  }

  h2 {
    font-size: 2rem;
    padding: 40px 20px 30px;
  }

  h2::after {
    width: 60px;
    bottom: 20px;
  }

  h2::before {
    font-size: 1.8rem;
    margin-right: 10px;
  }
}
</style>
