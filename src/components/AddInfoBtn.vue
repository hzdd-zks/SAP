<template>
  <button class="add-info-btn" @click="handleClick">
    <span class="btn-icon">+</span>
    <span class="btn-text">{{ text }}</span>
  </button>
</template>
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// 定义属性
const props = defineProps({
  text: {
    type: String,
    default: '新增信息',
  },
})

// 定义事件
const emit = defineEmits(['click'])

// 处理点击事件
const handleClick = () => {
  emit('click')
}
</script>
<style scoped>
.add-info-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background-color: #d3a190;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-info-btn:hover {
  background-color: #c19080;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 20px;
  font-weight: bold;
  margin-right: 8px;
}

.btn-text {
  font-size: 14px;
}
</style>
