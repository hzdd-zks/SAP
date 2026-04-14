<template>
  <div class="top-nav">
    <div class="top-nav-content">

      <div class="logo-container">
        <img src="/logo.png.svg" alt="公司logo" class="logo-image" />
        <div class="logo-text">

          <div class="logo-subtitle">南京航智SAP系统</div>
        </div>
      </div>
      <div class="userInfo" @click="showPasswordModal = true">
        <div class="left-icon">
          <img src="/headphoto.webp" alt="头像" class="avatar" />
        </div>
        <div class="user-name">
          <p>{{ userName }}</p>
        </div>
      </div>
    </div>
    <!-- 修改密码弹窗 -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="showPasswordModal = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>修改密码</h3>
          <button class="close-btn" @click="showPasswordModal = false">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handlePasswordChange">
            <div class="form-group">
              <label for="oldPassword">原密码</label>
              <input
                type="password"
                id="oldPassword"
                v-model="passwordForm.oldPassword"
                placeholder="请输入原密码"
                required
              />
            </div>
            <div class="form-group">
              <label for="newPassword">新密码</label>
              <input
                type="password"
                id="newPassword"
                v-model="passwordForm.newPassword"
                placeholder="请输入新密码"
                required
              />
            </div>
            <div class="form-group">
              <label for="confirmPassword">确认新密码</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                placeholder="请确认新密码"
                required
              />
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="showPasswordModal = false">
                取消
              </button>
              <button type="submit" class="submit-btn">确认修改</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const showPasswordModal = ref(false)

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 获取当前登录用户信息
const currentUser = computed(() => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch (error) {
      console.error('解析用户信息失败:', error)
      return null
    }
  }
  return null
})

// 获取用户名
const userName = computed(() => {
  return currentUser.value?.name || currentUser.value?.username || '用户'
})

const handlePasswordChange = () => {
  // 验证密码
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert('新密码和确认密码不一致')
    return
  }

  // 这里可以添加密码强度验证

  // 模拟密码修改成功
  console.log('修改密码:', passwordForm)
  alert('密码修改成功！')
  showPasswordModal.value = false

  // 重置表单
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}
</script>
<style scoped>
.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-image {
  height: 56px;
  width: auto;
  object-fit: contain;
  max-width: 70px;
}

.logo-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.2;
}

.logo-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.logo-subtitle {
  font-size: 17px;
  color: #0f0101;
  margin: 2px 0 0 0;
  font-weight: bold;
}
.top-nav {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  position: relative;
  height: 64px;
  border-bottom: 1px solid #e7e3e3;
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

.userInfo {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.left-icon {
  margin-right: 5px;
}
.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
.user-name p {
  margin: 0;
  font-size: 14px;
  color: #1f1e1e;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.submit-btn {
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #1565c0;
}
</style>
