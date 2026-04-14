<template>
  <div class="login-container">
    <div class="language-selector">
      <select v-model="language">
        <option value="zh-CN">中文 (简体)</option>
        <option value="en-US">English</option>
      </select>
    </div>
    <div class="login-form">
      <div class="sap-logo">
        <div class="logo-blue">SAP</div>
      </div>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <input type="text" v-model="form.username" placeholder="用户名" required />
        </div>
        <div class="form-group">
          <select v-model="form.department" required>
            <option value="" disabled>请选择部门</option>
            <option value="sales">销售部</option>
            <option value="development">研发部</option>
            <option value="purchase">采购部</option>
          </select>
          <input type="password" v-model="form.password" placeholder="密码" required />
        </div>
        <div class="form-group">
          <input type="password" v-model="form.confirmPassword" placeholder="确认密码" required />
        </div>
        <button type="submit" class="login-button">注册</button>
        <div class="login-link">
          <span>已有账号？</span>
          <router-link to="/login">立即登录</router-link>
        </div>
        <div class="copyright">© 2026 南京航智电动科技有限公司 • SAP管理系统v0.1.0</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const form = reactive({
  username: '',
  department: '',
  password: '',
  confirmPassword: '',
})

const language = ref('zh-CN')

const handleRegister = async () => {
  try {
    // 验证密码是否一致
    if (form.password !== form.confirmPassword) {
      throw new Error('两次输入的密码不一致')
    }

    // 模拟注册，实际项目中应该使用真实的API
    // 这里使用setTimeout模拟网络请求
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 模拟注册成功
    if (form.username && form.password && form.department) {
      alert('注册成功！请登录')
      // 跳转到登录页面
      router.push('/login')
    } else {
      throw new Error('用户名、密码、部门不能为空')
    }
  } catch (error) {
    // 注册失败，显示错误信息
    console.error('注册失败:', error)
    alert('注册失败，请检查输入信息')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.login-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
  animation: pulse 8s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}

.language-selector {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.language-selector select {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  background-color: transparent;
  cursor: pointer;
  outline: none;
}

.login-form {
  width: 400px;
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  text-align: center;
  margin: auto;
  z-index: 1;
  transition: all 0.3s ease;
}

.login-form:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  transform: translateY(-5px);
}

.sap-logo {
  margin-bottom: 30px;
  position: relative;
}

.logo-blue {
  display: inline-block;
  font-size: 48px;
  font-weight: bold;
  color: white;
  background-color: #0070f3;
  padding: 15px 25px;
  transform: skewX(-10deg);
  box-shadow: 0 4px 15px rgba(0, 112, 243, 0.3);
  transition: all 0.3s ease;
}

.logo-blue:hover {
  transform: skewX(-10deg) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 112, 243, 0.4);
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
  position: relative;
}
.form-group select {
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: white;
  margin-bottom: 10px;
}
.form-group input {
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: white;
}

.form-group input:focus {
  outline: none;
  border-color: #0070f3;
  box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
}
.form-group select:focus {
  outline: none;
  border-color: #0070f3;
  box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.1);
}

.login-button {
  width: 100%;
  padding: 15px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 15px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 112, 243, 0.3);
}

.login-button:active {
  transform: translateY(0);
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-button:hover::before {
  left: 100%;
}

.login-link {
  margin: 15px 0;
  text-align: center;
  font-size: 14px;
}

.login-link span {
  color: #666;
  margin-right: 5px;
}

.login-link router-link {
  color: #0070f3;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.login-link router-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.copyright {
  margin-top: 20px;
  font-size: 12px;
  color: #666;
  text-align: center;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.copyright:hover {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-form {
    width: 90%;
    padding: 30px;
  }

  .logo-blue {
    font-size: 36px;
    padding: 12px 20px;
  }

  .form-group input {
    padding: 12px 16px;
  }

  .login-button {
    padding: 12px;
  }

  .login-link {
    margin: 15px 0;
  }
}
</style>
