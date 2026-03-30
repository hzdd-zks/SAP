<template>
  <div class="content-area">
    <!-- 需求管理内容 -->
    <div v-if="activeNav === 'requirement'">
      <!-- 顶部按钮和搜索栏 -->
      <div class="top-section">
        <button
          class="btn add-btn"
          :class="{ active: activeRequirementTab === 'add' }"
          @click="activeRequirementTab = 'add'"
        >
          新增需求
        </button>
        <button
          class="btn history-btn"
          :class="{ active: activeRequirementTab === 'history' }"
          @click="activeRequirementTab = 'history'"
        >
          历史需求汇总
        </button>
        <SearchBar @input="handleSearch" />
      </div>

      <!-- 分割线 -->
      <div class="divider"></div>

      <!-- 新增需求板块 -->
      <div v-if="activeRequirementTab === 'add'" class="content-tab">
        <h2>新增需求</h2>
        <p>此处显示新增需求相关内容</p>

        <!-- 中央添加按钮 -->
        <div class="center-container">
          <AddInfoBtn text="新增需求" @click="handleAddInfo" />
        </div>
      </div>

      <!-- 历史需求汇总板块 -->
      <div v-else-if="activeRequirementTab === 'history'" class="content-tab">
        <h2>历史需求汇总</h2>
        <div class="history-section">
          <p class="history-text">
            此处是历史需求汇总条目，与需求管理中的历史需求一致，但没有编辑和撤销功能
          </p>
        </div>
      </div>
    </div>

    <!-- 采购订单管理内容 -->
    <div v-else-if="activeNav === 'purchase'">
      <!-- 顶部按钮和搜索栏 -->
      <div class="top-section">
        <button class="btn add-btn">新增采购订单</button>
        <button class="btn history-btn">历史采购订单</button>
        <SearchBar placeholder="搜索采购订单" @input="handleSearch" />
      </div>

      <!-- 分割线 -->
      <div class="divider"></div>

      <h2>采购订单管理</h2>
      <p>此处显示采购订单管理相关内容</p>
    </div>

    <!-- 发票与结算管理内容 -->
    <div v-else-if="activeNav === 'invoice'">
      <!-- 顶部按钮和搜索栏 -->
      <div class="top-section">
        <button
          class="btn add-btn"
          :class="{ active: activeInvoiceTab === 'add' }"
          @click="activeInvoiceTab = 'add'"
        >
          新增发票
        </button>
        <button
          class="btn history-btn"
          :class="{ active: activeInvoiceTab === 'history' }"
          @click="activeInvoiceTab = 'history'"
        >
          历史发票
        </button>
        <SearchBar placeholder="搜索发票" @input="handleSearch" />
      </div>

      <!-- 分割线 -->
      <div class="divider"></div>

      <!-- 新增发票板块 -->
      <div v-if="activeInvoiceTab === 'add'" class="content-tab">
        <h2>新增发票</h2>
        <p>此处显示新增发票相关内容</p>

        <!-- 中央添加按钮 -->
        <div class="center-container">
          <AddInfoBtn text="新增发票" @click="handleAddInfo" />
        </div>
      </div>

      <!-- 历史发票板块 -->
      <div v-else-if="activeInvoiceTab === 'history'" class="content-tab">
        <h2>历史发票</h2>
        <p>此处显示历史发票相关内容</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import AddInfoBtn from './AddInfoBtn.vue' //加号按钮
import ItemList from './ItemList.vue' //条目列表
import HistoryPanel from './HistoryPanel.vue' //历史记录面板
import NotificationMess from './NotificationMess.vue' //页框填入结果通知
import Pagination from './Pagination.vue' //分页组件
import UpLoad from './UpLoad.vue' //文件上传组件
import SubmitPanel from './SubmitPanel.vue' //提交面板组件
import ProsessStatus from './ProsessStatus.vue' //流程状态组件
import DatePicker from './DatePicker.vue' //日期选择器组件
import SearchBar from './SearchBar.vue' //搜索栏组件

// 状态管理
import { ref } from 'vue'

// 当前激活的导航项
const activeNav = ref('requirement')

// 需求管理当前激活的标签
const activeRequirementTab = ref('add')

// 发票与结算管理当前激活的标签
const activeInvoiceTab = ref('add')

// 处理搜索输入
const handleSearch = (value: string) => {
  console.log('搜索内容:', value)
  // 这里可以添加搜索逻辑
}

// 处理添加信息
const handleAddInfo = () => {
  console.log('添加信息')
  // 这里可以添加添加信息的逻辑
}

// 导出激活导航项的方法，供父组件调用
defineExpose({
  setActiveNav: (nav: string) => {
    activeNav.value = nav
  },
})
</script>
<style scoped>
.content-area {
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  min-width: 0;
}

/* 顶部按钮和搜索栏样式 */
.top-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  margin-left: auto;
}

.btn {
  padding: 8px 20px;
  margin-right: 15px;
  background-color: #d3a190;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:hover {
  background-color: #c19080;
}

.btn.active {
  background-color: #b08070;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 分割线样式 */
.divider {
  height: 1px;
  background-color: #e0e0e0;
  margin-bottom: 20px;
}

/* 历史需求汇总区域样式 */
.history-section {
  background-color: #d3a190;
  border: 1px solid #c19080;
  padding: 40px;
  text-align: center;
  color: white;
}

.history-text {
  margin: 0;
  font-size: 16px;
}

/* 中央容器样式 */
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}
</style>
