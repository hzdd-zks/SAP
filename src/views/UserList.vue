<template>
  <div class="user-list">
    <div class="tab-header">
      <div class="tab-item" :class="{ active: activeTab === 'list' }" @click="activeTab = 'list'">
        用户列表
      </div>
      <div class="tab-item" :class="{ active: activeTab === 'add' }" @click="activeTab = 'add'">
        新增用户
      </div>
    </div>

    <div class="tab-content">
      <!-- 用户列表 -->
      <div v-if="activeTab === 'list'" class="tab-panel">
        <div class="panel-header">
          <h3>用户列表</h3>
          <div class="search-box">
            <div class="search-container">
              <input type="text" placeholder="搜索用户" v-model="searchQuery" />
              <button class="search-btn">搜索</button>
            </div>
          </div>
        </div>
        <div class="panel-body">
          <table class="user-table">
            <thead>
              <tr>
                <th>部门</th>
                <th>用户名</th>
                <th>角色</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>{{ user.department }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.role }}</td>
                <td>
                  <button class="edit-btn" @click="editUser(user)">编辑</button>
                  <button class="delete-btn" @click="deleteUser(user.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 新增用户 -->
      <div v-else-if="activeTab === 'add'" class="tab-panel">
        <div class="panel-header">
          <h3>新增用户</h3>
        </div>
        <div class="panel-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>用户名</label>
              <input v-model="formData.username" type="text" placeholder="请输入用户名" required />
            </div>
            <div class="form-group">
              <label>部门</label>
              <input v-model="formData.department" type="text" placeholder="请输入部门" required />
            </div>
            <div class="form-group">
              <label>密码</label>
              <input
                v-model="formData.password"
                type="password"
                placeholder="请输入密码"
                required
              />
            </div>
            <div class="form-group">
              <label>角色</label>
              <select v-model="formData.role" required>
                <option value="">请选择角色</option>
                <option value="admin">管理员</option>
                <option value="user">普通用户</option>
                <option value="viewer">查看权限</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="resetForm">取消</button>
              <button type="submit" class="submit-btn">提交</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 编辑用户弹窗 -->
    <div v-if="showEditForm" class="modal-overlay" @click.self="showEditForm = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>编辑用户</h3>
          <button class="close-btn" @click="showEditForm = false">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleEditSubmit">
            <div class="form-group">
              <label>用户名</label>
              <input
                v-model="editFormData.username"
                type="text"
                placeholder="请输入用户名"
                required
              />
            </div>
            <div class="form-group">
              <label>部门</label>
              <input
                v-model="editFormData.department"
                type="text"
                placeholder="请输入部门"
                required
              />
            </div>
            <div class="form-group">
              <label>密码</label>
              <input
                v-model="editFormData.password"
                type="password"
                placeholder="请输入密码（留空表示不修改）"
              />
            </div>
            <div class="form-group">
              <label>角色</label>
              <select v-model="editFormData.role" required>
                <option value="">请选择角色</option>
                <option value="admin">管理员</option>
                <option value="user">普通用户</option>
                <option value="viewer">查看权限</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="showEditForm = false">取消</button>
              <button type="submit" class="submit-btn">保存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const activeTab = ref('list')
const searchQuery = ref('')

// 搜索用户
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return users.value
  }
  const query = searchQuery.value.toLowerCase()
  return users.value.filter(
    (user) =>
      user.username.toLowerCase().includes(query) ||
      user.department.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query),
  )
})
const showEditForm = ref(false)
const currentEditUserId = ref<number | null>(null)

const users = ref([
  { id: 1, username: 'admin', department: '管理部', role: '管理员' },
  { id: 2, username: 'user1', department: '技术部', role: '普通用户' },
  { id: 3, username: 'user2', department: '市场部', role: '查看权限' },
])

const formData = reactive({
  username: '',
  department: '',
  password: '',
  role: '',
})

const editFormData = reactive({
  username: '',
  department: '',
  password: '',
  role: '',
})

const handleSubmit = () => {
  console.log('提交用户:', formData)
  // 模拟添加用户
  const newUser = {
    id: Date.now(),
    ...formData,
  }
  users.value.push(newUser)
  resetForm()
  activeTab.value = 'list'
}

const resetForm = () => {
  Object.keys(formData).forEach((key) => {
    formData[key as keyof typeof formData] = ''
  })
}

const editUser = (user: any) => {
  currentEditUserId.value = user.id
  // 填充编辑表单数据
  editFormData.username = user.username
  editFormData.department = user.department
  editFormData.password = '' // 密码留空，让用户自行输入
  editFormData.role = user.role
  showEditForm.value = true
}

const handleEditSubmit = () => {
  console.log('编辑用户:', editFormData)
  if (currentEditUserId.value) {
    const index = users.value.findIndex((user) => user.id === currentEditUserId.value)
    if (index !== -1) {
      // 更新用户数据
      users.value[index] = {
        ...users.value[index],
        username: editFormData.username,
        department: editFormData.department,
        role: editFormData.role,
      }
      // 如果输入了密码，则更新密码
      if (editFormData.password) {
        users.value[index].password = editFormData.password
      }
    }
  }
  showEditForm.value = false
  // 重置编辑表单
  Object.keys(editFormData).forEach((key) => {
    editFormData[key as keyof typeof editFormData] = ''
  })
  currentEditUserId.value = null
}

const deleteUser = (id: number) => {
  if (confirm('确定要删除该用户吗？')) {
    const index = users.value.findIndex((user) => user.id === id)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
  }
}
</script>
<style scoped>
.user-list {
  height: 100%;
}

.tab-header {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.tab-item {
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.tab-item:hover {
  color: #1976d2;
}

.tab-item.active {
  color: #1976d2;
  border-bottom-color: #1976d2;
  font-weight: bold;
}

.tab-content {
  flex: 1;
}

.tab-panel {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.search-box {
  max-width: 350px;
  width: 100%;
}

.search-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.search-box input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px 0 0 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  height: 40px;
  box-sizing: border-box;
}

.search-box input::placeholder {
  color: #999;
  font-size: 13px;
}

.search-box input:focus {
  border-color: #1976d2;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.search-btn {
  position: relative;
  right: 0;
  top: 0;
  transform: none;
  padding: 0 20px;
  background-color: #1976d2;
  color: white;
  border: 1px solid #1976d2;
  border-radius: 0 12px 12px 0;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(25, 118, 210, 0.2);
  white-space: nowrap;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background-color: #1565c0;
  box-shadow: 0 4px 8px rgba(25, 118, 210, 0.3);
  transform: translateY(-1px);
}

.search-btn:active {
  background-color: #0d47a1;
  box-shadow: 0 1px 2px rgba(25, 118, 210, 0.2);
  transform: translateY(0);
}

.panel-body {
  padding: 20px;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.user-table th,
.user-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.user-table th {
  background-color: #f5f5f5;
  font-weight: 500;
  color: #333;
}

.user-table tr:hover {
  background-color: #f9f9f9;
}

.edit-btn,
.delete-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
  margin-right: 8px;
}

.edit-btn {
  background-color: #4caf50;
  color: white;
}

.edit-btn:hover {
  background-color: #45a049;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #da190b;
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

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
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
  max-width: 500px;
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
</style>
