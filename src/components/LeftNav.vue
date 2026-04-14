<template>
  <div class="left-nav">
    <router-link to="/bom" class="nav-item" :class="{ active: $route.path === '/bom' }">
      BOM提交
    </router-link>
    <router-link
      to="/bom-summary"
      class="nav-item"
      :class="{ active: $route.path === '/bom-summary' }"
    >
      新增BOM
    </router-link>
    <router-link to="/purchase" class="nav-item" :class="{ active: $route.path === '/purchase' }">
      采购管理
    </router-link>
    <router-link to="/user" class="nav-item" :class="{ active: $route.path === '/user' }">
      用户管理
    </router-link>
  </div>
</template>
<script setup lang="ts">
// 使用路由跳转，无需额外逻辑
</script>
<style scoped>
.left-nav {
  width: 180px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  padding-top: 20px;
  height: 100%;
  flex-shrink: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.nav-item {
  padding: 16px 20px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  text-decoration: none;
  color: #555;
  font-size: 15px;
  font-weight: 500;
  border-radius: 0 20px 20px 0;
  margin: 4px 0;
  position: relative;
  overflow: hidden;
}

.nav-item:hover {
  background-color: #ececec;
  color: #333;
  transform: translateX(4px);
}

.nav-item.active {
  background-color: #f1f1f1;
  color: #333;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #1976d2;
  border-radius: 0 4px 4px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .left-nav {
    width: 160px;
  }

  .nav-item {
    padding: 14px 16px;
    font-size: 13px;
  }
}
</style>
