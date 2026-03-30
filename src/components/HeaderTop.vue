<template>
  <div class="top-nav">
    <div class="top-nav-content">
      <div class="logo">系统名称</div>
      <div class="user-info">用户信息</div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.top-nav {
  height: 60px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  padding: 0 20px;
  width: 100%;
}

.top-nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo {
  font-size: 18px;
  font-weight: bold;
}

.user-info {
  font-size: 14px;
}
</style>
