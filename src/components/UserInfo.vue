<template>
  <div class="userInfo" @click="handleClick">
    <div class="left-icon">
      <img src="/headphoto.webp" alt="头像" class="avatar" />
    </div>
    <div class="user-name">
      <p>Victor</p>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.userInfo {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.left-icon {
  margin-right: 10px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.user-name p {
  margin: 0;
  font-size: 14px;
  color: #020000;
}
</style>
