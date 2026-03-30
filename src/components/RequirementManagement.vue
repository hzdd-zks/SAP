<template>
  <div class="requirement-management">
    <!-- 顶部导航栏 -->
    <HeaderTop />

    <div class="main-container">
      <!-- 左侧导航栏 -->
      <LeftNav @nav-change="handleNavChange" />

      <!-- 右侧内容区 -->
      <ContentBar ref="contentBarRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderTop from './HeaderTop.vue';
import LeftNav from './LeftNav.vue';
import ContentBar from './ContentBar.vue';

// 状态管理
import { ref } from 'vue';

// ContentBar 组件引用
const contentBarRef = ref(null);

// 处理导航项变更
const handleNavChange = (nav: string) => {
  if (contentBarRef.value) {
    (contentBarRef.value as any).setActiveNav(nav);
  }
};
</script>

<style scoped>
.requirement-management {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

/* 主容器样式 */
.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-width: 0;
}
</style>