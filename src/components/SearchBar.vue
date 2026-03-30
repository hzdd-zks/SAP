<template>
  <div class="search-bar">
    <input
      type="text"
      class="search-input"
      :placeholder="placeholder || '检索输入栏'"
      v-model="searchText"
      @input="handleInput"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'

// 定义属性
const props = defineProps({
  placeholder: {
    type: String,
    default: '检索输入栏',
  },
})

// 定义事件
const emit = defineEmits(['input'])

// 搜索文本
const searchText = ref('')

// 处理输入事件
const handleInput = () => {
  emit('input', searchText.value)
}
</script>
<style scoped>
.search-bar {
  position: relative;
}

.search-input {
  padding: 8px 15px;
  background-color: #f0f0f0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: #d3a190;
  box-shadow: 0 0 0 2px rgba(211, 161, 144, 0.2);
}
</style>
