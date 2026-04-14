<template>
  <div class="main-layout">
    <!-- 顶部导航栏 -->
    <HeaderTop />
    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 左侧导航栏 -->
      <LeftNav />
      <!-- 中心内容区 -->
      <ContentArea />
    </div>
  </div>
</template>
<script setup lang="ts">
import HeaderTop from './HeaderTop.vue'
import LeftNav from './LeftNav.vue'
import ContentArea from './ContentArea.vue'
</script>
<style scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}
</style>