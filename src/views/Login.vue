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
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input type="text" v-model="form.username" placeholder="用户名" required />
        </div>
        <div class="form-group">
          <input type="password" v-model="form.password" placeholder="密码" required />
        </div>
        <button type="submit" class="login-button">登录</button>
        <div class="register-link">
          <span>还没有账号？</span>
          <router-link to="/register">立即注册</router-link>
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
  password: ''
})

const language = ref('zh-CN')

const handleLogin = async () => {
  try {
    // 模拟登录，实际项目中应该使用真实的API
    // 这里使用setTimeout模拟网络请求
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 模拟登录成功
    if (form.username && form.password) {
      // 模拟登录成功后的数据
      const mockResponse = {
        token: 'mock-token-' + Date.now(),
        user: {
          id: 1,
          username: form.username,
          name: form.username, // 使用输入的用户名作为name
        },
      }

      // 存储token到localStorage
      localStorage.setItem('token', mockResponse.token)
      localStorage.setItem('user', JSON.stringify(mockResponse.user))

      // 跳转到BOM页面
      router.push('/bom')
    } else {
      throw new Error('用户名和密码不能为空')
    }
  } catch (error) {
    // 登录失败，显示错误信息
    console.error('登录失败:', error)
    alert('登录失败，请检查用户名和密码')
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

.register-link {
  margin: 15px 0;
  text-align: center;
  font-size: 14px;
}

.register-link span {
  color: #666;
  margin-right: 5px;
}

.register-link router-link {
  color: #0070f3;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.register-link router-link:hover {
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

  .register-link {
    margin: 15px 0;
  }
}
</style>
