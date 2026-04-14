<template>
  <div class="bom-content">
    <!-- 选项卡 -->
    <div class="tab-header">
      <div
        class="tab-item"
        :class="{ active: activeTab === 'create' }"
        @click="activeTab = 'create'"
      >
        新建BOM
      </div>
      <div
        class="tab-item"
        :class="{ active: activeTab === 'history' }"
        @click="activeTab = 'history'"
      >
        历史BOM
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="tab-content">
      <!-- 新建BOM -->
      <div v-if="activeTab === 'create'" class="tab-panel">
        <div class="panel-header">
          <h3>新建BOM</h3>
          <button class="add-btn" @click="showForm = true">
            <span class="btn-icon">+</span>
            <span class="btn-text">新增BOM</span>
          </button>
        </div>
        <div class="panel-body">
          <p>点击上方按钮添加新的BOM</p>
        </div>
      </div>

      <!-- 历史BOM -->
      <div v-else-if="activeTab === 'history'" class="tab-panel">
        <div class="panel-header">
          <h3>历史BOM</h3>
        </div>
        <div class="panel-body">
          <p>这里显示历史BOM列表</p>
        </div>
      </div>
    </div>

    <!-- 表单弹窗 -->
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal-container">
        <div class="modal-header">
          <h3>新增BOM</h3>
          <button class="close-btn" @click="showForm = false">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>BOM名称</label>
              <input v-model="formData.name" type="text" placeholder="请输入BOM名称" required />
            </div>
            <div class="form-group">
              <label>类型</label>
              <select v-model="formData.type" required>
                <option value="">请选择类型</option>
                <option value="office">办公用品</option>
                <option value="equipment">设备采购</option>
                <option value="service">服务需求</option>
                <option value="bom">项目BOM</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div class="form-group">
              <label>数量</label>
              <input
                v-model="formData.quantity"
                type="number"
                placeholder="请输入数量"
                min="1"
                required
              />
            </div>
            <div class="form-group">
              <label>单位</label>
              <select v-model="formData.unit" required>
                <option value="">请选择单位</option>
                <option value="个">个</option>
                <option value="件">件</option>
                <option value="套">套</option>
                <option value="台">台</option>
                <option value="箱">箱</option>
              </select>
            </div>
            <div class="form-group">
              <label>期望截止时间</label>
              <input v-model="formData.date" type="date" required />
            </div>
            <div class="form-group">
              <label>备注</label>
              <textarea
                v-model="formData.remark"
                rows="3"
                placeholder="请输入备注信息（选填）"
              ></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="showForm = false">取消</button>
              <button type="submit" class="submit-btn">提交</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'

const activeTab = ref('create')
const showForm = ref(false)

const formData = reactive({
  name: '',
  type: '',
  quantity: '',
  unit: '',
  date: new Date().toISOString().split('T')[0],
  remark: '',
})

const handleSubmit = () => {
  console.log('提交BOM:', formData)
  // 这里可以添加提交逻辑
  showForm.value = false
  // 重置表单
  Object.keys(formData).forEach((key) => {
    formData[key as keyof typeof formData] = ''
  })
  formData.date = new Date().toISOString().split('T')[0]
}
</script>
<style scoped>
.bom-content {
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

.add-btn {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.add-btn:hover {
  background-color: #1565c0;
}

.btn-icon {
  margin-right: 6px;
  font-size: 16px;
}

.panel-body {
  padding: 20px;
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
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
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
</style>
