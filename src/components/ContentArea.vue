<template>
  <div class="content-area">
    <div class="content-body">
      <!-- 路由视图 -->
      <router-view class="content-section" />
    </div>
  </div>
</template>
<script setup lang="ts">
</script>
<style scoped>
.content-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #ffffff;
}

.content-body {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.content-section {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content-section h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.content-section p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}
</style>
