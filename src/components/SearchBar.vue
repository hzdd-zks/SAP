<template>
  <div class="search-bar">
    <div class="search-container">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="搜索BOM名称..."
        class="search-input"
        @input="handleSearch"
      />
      <button class="search-btn" @click.stop="handleSearch">
        搜索
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// 定义props
const props = defineProps({
  placeholder: {
    type: String,
    default: '搜索BOM名称...'
  },
  initialQuery: {
    type: String,
    default: ''
  }
})

// 定义emit
const emit = defineEmits(['search'])

// 搜索查询
const searchQuery = ref(props.initialQuery)

// 处理搜索
const handleSearch = () => {
  emit('search', searchQuery.value)
}

// 监听初始查询变化
watch(
  () => props.initialQuery,
  (newQuery) => {
    searchQuery.value = newQuery
  }
)
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  max-width: 350px;
  width: 100%;
}

.search-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px 0 0 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  height: 40px;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: #999;
  font-size: 13px;
}

.search-input:focus {
  border-color: #1976d2;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.search-btn {
  position: relative;
  right: 0;
  top: 0;
  transform: none;
  padding: 0 20px;
  background-color: #1976d2;
  color: white;
  border: 1px solid #1976d2;
  border-radius: 0 12px 12px 0;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
  white-space: nowrap;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background-color: #1565c0;
  box-shadow: 0 4px 8px rgba(25, 118, 210, 0.3);
  transform: translateY(-1px);
}

.search-btn:active {
  background-color: #0d47a1;
  box-shadow: 0 1px 2px rgba(25, 118, 210, 0.2);
  transform: translateY(0);
}
</style>
