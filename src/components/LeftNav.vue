<template>
  <div class="left-nav">
    <div
      class="nav-item"
      :class="{ active: activeNav === 'requirement' }"
      @click="selectNav('requirement')"
    >
      需求管理
    </div>
    <div
      class="nav-item"
      :class="{ active: activeNav === 'purchase' }"
      @click="selectNav('purchase')"
    >
      采购订单管理
    </div>
    <div
      class="nav-item"
      :class="{ active: activeNav === 'invoice' }"
      @click="selectNav('invoice')"
    >
      发票与结算管理
    </div>
  </div>
</template>
<script setup lang="ts">
import RemindNotify from './RemindNotify.vue' //提醒通知
import ItemList from './ItemList.vue' //条目列表

// 状态管理
import { ref, defineEmits } from 'vue'

// 当前激活的导航项
const activeNav = ref('requirement')

// 定义事件
const emit = defineEmits(['nav-change'])

// 选择导航项
const selectNav = (nav: string) => {
  activeNav.value = nav
  emit('nav-change', nav)
}
</script>
<style scoped>
.left-nav {
  width: 100px;
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  padding-top: 20px;
  height: 100%;
  flex-shrink: 0;
}

.nav-item {
  padding: 15px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background-color: #e0e0e0;
}

.nav-item.active {
  background-color: #d1d1d1;
  font-weight: bold;
}
</style>
