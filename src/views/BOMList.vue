<template>
  <div class="bom-list">
    <div class="tab-header">
      <div class="tab-items">
        <div
          class="tab-item"
          :class="{ active: activeTab === 'create' }"
          @click="activeTab = 'create'"
        >
          新建BOM
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'library' }"
          @click="activeTab = 'library'"
        >
          BOM库
        </div>
      </div>
      <div class="header-actions">
        <SearchBar @search="handleSearch" />
      </div>
    </div>
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
          <!-- BOM列表 -->
          <div v-if="filteredBOMList.length > 0" class="bom-table">
            <table>
              <thead>
                <tr>
                  <th>BOM名称</th>
                  <th>文件名</th>
                  <th>提交者1</th>
                  <th>提交者2</th>
                  <th>提交时间</th>
                  <th>备注</th>
                  <th>当前状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredBOMList" :key="item.id">
                  <td>
                    <span
                      class="download-link"
                      @click="handleFilePreview(item)"
                      v-if="item.fileName"
                    >
                      {{ item.name }}
                    </span>
                    <span v-else>{{ item.name }}</span>
                  </td>
                  <td>{{ item.fileName || '-' }}</td>
                  <td>{{ item.submitter1 || '' }}</td>
                  <td>{{ item.submitter2 || '' }}</td>
                  <td>{{ item.submitTime1 || item.createTime }}</td>
                  <td>{{ item.remark || '-' }}</td>
                  <td>{{ item.status || '' }}</td>
                  <td>
                    <button
                      class="edit-btn"
                      @click="editBOM(item)"
                      :disabled="
                        item.approvalStatus === 'submitted' ||
                        item.approvalStatus === 'submitted_to_summary'
                      "
                    >
                      修改
                    </button>
                    <button
                      class="submit-btn"
                      @click="submitBOM(item.id)"
                      :disabled="
                        item.approvalStatus === 'submitted' ||
                        item.approvalStatus === 'submitted_to_summary'
                      "
                    >
                      提交
                    </button>
                    <button
                      class="download-btn"
                      @click="downloadFile(item)"
                      :disabled="!item.fileName"
                    >
                      下载
                    </button>
                    <button
                      class="delete-btn"
                      @click="deleteBOM(item.id)"
                      :disabled="item.approvalStatus === 'submitted'"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else>{{ searchQuery ? '没有找到匹配的BOM' : '点击上方按钮添加新的BOM' }}</p>
        </div>
      </div>

      <!-- BOM库 -->
      <div v-else-if="activeTab === 'library'" class="tab-panel">
        <div class="panel-header">
          <h3>BOM库</h3>
        </div>
        <div class="panel-body">
          <p>这里显示BOM库列表</p>
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
              <label>数据源选择 <span style="color: red">*</span></label>
              <div class="data-source-tabs">
                <button
                  class="tab-btn"
                  :class="{ active: dataSource === 'upload' }"
                  @click="dataSource = 'upload'"
                >
                  上传Excel文件
                </button>
                <button
                  class="tab-btn"
                  :class="{ active: dataSource === 'library' }"
                  @click="dataSource = 'library'"
                >
                  从BOM库中选择
                </button>
              </div>
            </div>

            <!-- 上传Excel文件 -->
            <div v-if="dataSource === 'upload'" class="form-group">
              <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" required />
            </div>

            <!-- 从BOM库中选择 -->
            <div v-if="dataSource === 'library'" class="form-group">
              <label>选择BOM <span style="color: red">*</span></label>
              <div class="library-search">
                <SearchBar
                  placeholder="搜索BOM库..."
                  :initial-query="librarySearchQuery"
                  @search="handleLibrarySearch"
                />
                <div v-if="filteredBOMLibrary.length > 0" class="search-results">
                  <div
                    v-for="bom in filteredBOMLibrary"
                    :key="bom.id"
                    class="search-result-item"
                    :class="{ active: selectedLibraryBOM === bom.id }"
                    @click.stop="selectedLibraryBOM = bom.id"
                  >
                    <div class="result-name">{{ bom.name }}</div>
                    <div class="result-description">{{ bom.description }}</div>
                  </div>
                </div>
                <div v-else class="no-results">
                  {{ librarySearchQuery ? '没有找到匹配的BOM' : '请输入关键词搜索BOM' }}
                </div>
              </div>
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
              <button type="submit" class="submit-btn">完成</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 编辑表单弹窗 -->
    <div v-if="showEditForm" class="modal-overlay" @click.self="showEditForm = false">
      <div class="modal-container edit-modal">
        <div class="modal-header">
          <h3>修改BOM</h3>
          <button class="close-btn" @click="showEditForm = false">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleEditSubmit">
            <div class="form-group">
              <label>BOM名称</label>
              <input v-model="editFormData.name" type="text" placeholder="请输入BOM名称" required />
            </div>
            <div class="form-group">
              <label>Excel文件内容</label>
              <div v-if="excelData && excelData.headers && excelData.rows" class="excel-editor">
                <table class="excel-table">
                  <thead>
                    <tr>
                      <th v-for="(header, index) in excelData.headers" :key="index">
                        <input
                          :value="header"
                          @input="excelData.headers[index] = $event.target.value"
                          type="text"
                          class="header-input"
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rowIndex) in excelData.rows" :key="rowIndex">
                      <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                        <input
                          :value="cell"
                          @input="excelData.rows[rowIndex][cellIndex] = $event.target.value"
                          type="text"
                          class="cell-input"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else-if="excelData" class="loading-message">文件内容为空</div>
              <div v-else class="loading-message">加载文件内容中...</div>
            </div>
            <div class="form-group">
              <label>备注1</label>
              <textarea
                v-model="editFormData.remark"
                rows="3"
                placeholder="请输入备注1信息（选填）"
              ></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="showEditForm = false">取消</button>
              <button type="submit" class="submit-btn">完成</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 文件预览模态对话框 -->
    <div v-if="showFilePreview" class="file-preview-modal" @click.self="closeFilePreview">
      <div class="file-preview-content">
        <div class="file-preview-header">
          <h3>文件预览</h3>
          <button class="close-btn" @click="closeFilePreview">&times;</button>
        </div>
        <div class="file-preview-body">
          <div v-if="currentFile" class="file-info">
            <p><strong>文件名:</strong> {{ currentFile.fileName }}</p>
            <p><strong>BOM名称:</strong> {{ currentFile.name }}</p>
            <p><strong>提交者:</strong> {{ currentFile.submitter }}</p>
            <p><strong>提交时间:</strong> {{ currentFile.submitTime }}</p>
          </div>
          <div class="file-content">
            <h4>Excel文件预览</h4>
            <div v-if="excelData" class="excel-preview">
              <table>
                <thead>
                  <tr>
                    <th v-for="(header, index) in excelData.headers" :key="index">{{ header }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, rowIndex) in excelData.rows" :key="rowIndex">
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="file-simulated-content">
              <p>Excel文件预览功能</p>
              <p>在实际项目中，这里会显示Excel文件的真实内容。</p>
            </div>
          </div>
        </div>
        <div class="file-preview-footer">
          <button class="download-btn" @click="downloadFile">下载文件</button>
          <button class="close-btn" @click="closeFilePreview">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBOMStore } from '../store/bomStore'
import * as XLSX from 'xlsx'
import SearchBar from '../components/SearchBar.vue'

const router = useRouter()
const { bomList, addBOM, setFile, getFile, fileMap } = useBOMStore()

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
const currentUserName = computed(() => {
  return currentUser.value?.name || currentUser.value?.username || '未知用户'
})

const activeTab = ref('create')
const showForm = ref(false)
const searchQuery = ref('')

const formData = reactive({
  name: '',
  remark: '',
})

// 编辑表单数据
const editFormData = reactive({
  name: '',
  remark: '',
})

// 文件上传处理
const selectedFile = ref<File | null>(null)
const editSelectedFile = ref<File | null>(null)

// 数据源选择
const dataSource = ref('upload') // 默认选择上传Excel文件
const selectedLibraryBOM = ref<number | null>(null) // 从BOM库中选择的BOM ID
const librarySearchQuery = ref('') // BOM库搜索查询

// BOM库数据（模拟数据）
const bomLibrary = ref([
  { id: 1, name: 'BOM-001', description: '产品A的BOM' },
  { id: 2, name: 'BOM-002', description: '产品B的BOM' },
  { id: 3, name: 'BOM-003', description: '产品C的BOM' },
  { id: 4, name: 'BOM-004', description: '产品D的BOM' },
  { id: 5, name: 'BOM-005', description: '产品E的BOM' },
])

// 过滤后的BOM库列表
const filteredBOMLibrary = computed(() => {
  if (!librarySearchQuery.value) {
    return bomLibrary.value
  }
  const query = librarySearchQuery.value.toLowerCase()
  return bomLibrary.value.filter(
    (item) =>
      item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query),
  )
})

// 处理BOM库搜索
const handleLibrarySearch = (query: string) => {
  librarySearchQuery.value = query
  console.log('BOM库搜索查询:', query)
}

// 过滤后的BOM列表
const filteredBOMList = computed(() => {
  if (!searchQuery.value) {
    return bomList.value
  }
  const query = searchQuery.value.toLowerCase()
  return bomList.value.filter((item) => item.name.toLowerCase().includes(query))
})

// 处理搜索
const handleSearch = (query: string) => {
  searchQuery.value = query
  console.log('搜索查询:', query)
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0]
    console.log('上传文件:', selectedFile.value.name)
  }
}

const handleEditFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    editSelectedFile.value = input.files[0]
    console.log('上传文件:', editSelectedFile.value.name)
  }
}

// 编辑相关变量
const showEditForm = ref(false)
const currentEditId = ref<number | null>(null)

// 获取审批状态的中文名称
const getApprovalStatusName = (status: string) => {
  const statusNames: Record<string, string> = {
    pending: '待审批',
    approved: '已审批',
    rejected: '已拒绝',
  }
  return statusNames[status] || '待审批'
}

const handleSubmit = () => {
  console.log('提交BOM:', formData)
  console.log('上传文件:', selectedFile.value)
  console.log('数据源选择:', dataSource.value)
  console.log('选择的BOM:', selectedLibraryBOM.value)

  // 获取当前时间
  const currentTime = new Date().toLocaleString('zh-CN')

  let fileName = ''
  let file = null

  if (dataSource.value === 'upload') {
    // 上传Excel文件
    fileName = selectedFile.value ? selectedFile.value.name : ''
    file = selectedFile.value
  } else if (dataSource.value === 'library') {
    // 从BOM库中选择
    const selectedBOM = bomLibrary.value.find((bom) => bom.id === selectedLibraryBOM.value)
    fileName = selectedBOM ? `${selectedBOM.name}.xlsx` : ''
    // 这里可以根据需要添加从BOM库中获取文件的逻辑
  }

  // 将提交的数据添加到全局BOM列表
  const newBOM = addBOM({
    ...formData,
    fileName: fileName,
    submitter: '提交者1', // 售前
    submitter1: currentUserName.value, // 存储实际用户名（售前）
    submitter2: '', // 研发提交者初始为空
    approver: '管理员', // 默认审批人
    approvalStatus: 'pending', // 默认审批状态
    createTime: currentTime, // 售前新建BOM的初始时间
    submitTime1: '', // 售前提交时间初始为空
    submitTime2: '', // 研发提交时间初始为空
    purchaseTime: '', // 采购正在采购时间初始为空
    finalSubmitTime: '', // 采购最终提交时间初始为空
    status: '', // 状态初始为空
  })

  // 存储文件对象，用于预览
  if (file) {
    console.log('存储文件到fileMap:', newBOM.id, file.name)
    setFile(newBOM.id, file)
  }

  showForm.value = false
  Object.keys(formData).forEach((key) => {
    formData[key as keyof typeof formData] = ''
  })
  selectedFile.value = null
  selectedLibraryBOM.value = ''
  dataSource.value = 'upload' // 重置为默认值
  // 重置文件输入
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

// 编辑BOM
const editBOM = (item: any) => {
  currentEditId.value = item.id
  editFormData.name = item.name
  editFormData.remark = item.remark
  editSelectedFile.value = null
  // 先显示加载状态
  excelData.value = null
  showEditForm.value = true

  // 加载并解析Excel文件数据用于编辑
  console.log('=== 开始编辑BOM ===')
  console.log('编辑BOM ID:', item.id)
  const file = getFile(item.id)
  console.log('获取到的文件:', file)
  if (file) {
    console.log('文件名称:', file.name)
    console.log('文件大小:', file.size)
    console.log('文件类型:', file.type)
  }

  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        console.log('开始解析Excel文件:', file.name)
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        console.log('文件数据长度:', data.length)

        const workbook = XLSX.read(data, { type: 'array' })
        console.log('工作簿Sheet数量:', workbook.SheetNames.length)
        console.log('Sheet名称:', workbook.SheetNames)

        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        console.log('当前处理的Sheet:', firstSheetName)

        // 尝试不同的解析方式
        try {
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          console.log('解析结果长度:', jsonData.length)
          console.log('解析结果:', jsonData)

          if (jsonData.length > 0) {
            // 提取表头
            let headers = jsonData[0]
            // 提取数据行
            let rows = jsonData.slice(1)

            // 确保表头和数据行是数组
            if (Array.isArray(headers)) {
              console.log('表头:', headers)
              console.log('数据行数量:', rows.length)

              // 清理表头，移除空值
              headers = headers.filter(
                (header: any) => header !== null && header !== undefined && header !== '',
              )
              console.log('清理后的表头:', headers)

              // 清理数据行，确保每行长度与表头一致
              rows = rows
                .map((row: any) => {
                  if (Array.isArray(row)) {
                    // 只保留与表头长度一致的数据
                    return row.slice(0, headers.length)
                  }
                  return []
                })
                .filter(
                  (row: any) =>
                    row.length > 0 &&
                    row.some((cell: any) => cell !== null && cell !== undefined && cell !== ''),
                )
              console.log('清理后的数据行数量:', rows.length)

              // 如果清理后没有表头，使用默认表头
              if (headers.length === 0) {
                headers = ['物料编码', '物料名称', '数量', '单位', '单价', '金额']
              }

              // 更新状态
              excelData.value = {
                headers,
                rows,
              }
              console.log('设置excelData:', excelData.value)
            } else {
              throw new Error('表头不是数组')
            }
          } else {
            // 空文件
            console.log('空文件')
            excelData.value = {
              headers: ['物料编码', '物料名称', '数量', '单位', '单价', '金额'],
              rows: [],
            }
          }
        } catch (sheetError) {
          console.error('Sheet解析失败:', sheetError)
          // 尝试另一种解析方式
          const jsonData = XLSX.utils.sheet_to_json(worksheet)
          console.log('尝试另一种解析方式:', jsonData)

          if (jsonData.length > 0) {
            // 从对象中提取表头
            const headers = Object.keys(jsonData[0])
            // 提取数据行
            const rows = jsonData.map((item: any) => headers.map((header) => item[header]))

            console.log('表头:', headers)
            console.log('数据行数量:', rows.length)

            // 更新状态
            excelData.value = {
              headers,
              rows,
            }
          } else {
            throw new Error('无法解析文件内容')
          }
        }
      } catch (error) {
        console.error('解析Excel文件失败:', error)
        // 解析失败时使用模拟数据
        console.log('使用模拟数据')
        excelData.value = {
          headers: ['物料编码', '物料名称', '数量', '单位', '单价', '金额'],
          rows: [
            ['M001', '螺丝', 100, '个', 0.5, 50],
            ['M002', '螺母', 200, '个', 0.3, 60],
            ['M003', '垫片', 300, '个', 0.1, 30],
            ['M004', '弹簧', 50, '个', 1.0, 50],
            ['M005', '轴承', 20, '个', 5.0, 100],
          ],
        }
      }
    }
    // 添加错误处理
    reader.onerror = (error) => {
      console.error('文件读取失败:', error)
      // 读取失败时使用模拟数据
      console.log('文件读取失败，使用模拟数据')
      excelData.value = {
        headers: ['物料编码', '物料名称', '数量', '单位', '单价', '金额'],
        rows: [
          ['M001', '螺丝', 100, '个', 0.5, 50],
          ['M002', '螺母', 200, '个', 0.3, 60],
          ['M003', '垫片', 300, '个', 0.1, 30],
          ['M004', '弹簧', 50, '个', 1.0, 50],
          ['M005', '轴承', 20, '个', 5.0, 100],
        ],
      }
    }
    reader.readAsArrayBuffer(file)
  } else {
    // 没有文件时使用模拟数据
    console.log('没有找到文件，使用模拟数据')
    // 延迟设置数据，模拟加载过程
    setTimeout(() => {
      excelData.value = {
        headers: ['物料编码', '物料名称', '数量', '单位', '单价', '金额'],
        rows: [
          ['M001', '螺丝', 100, '个', 0.5, 50],
          ['M002', '螺母', 200, '个', 0.3, 60],
          ['M003', '垫片', 300, '个', 0.1, 30],
          ['M004', '弹簧', 50, '个', 1.0, 50],
          ['M005', '轴承', 20, '个', 5.0, 100],
        ],
      }
    }, 500)
  }
}

// 处理编辑提交
const handleEditSubmit = () => {
  console.log('修改BOM:', editFormData)
  console.log('Excel数据:', excelData.value)

  if (currentEditId.value) {
    const index = bomList.value.findIndex((item) => item.id === currentEditId.value)
    if (index !== -1) {
      // 更新BOM数据
      bomList.value[index] = {
        ...bomList.value[index],
        name: editFormData.name,
        remark: editFormData.remark,
      }

      // 生成新的Excel文件并更新文件对象
      if (excelData.value) {
        // 创建工作簿
        const workbook = XLSX.utils.book_new()

        // 准备数据（包含表头和数据行）
        const data = [excelData.value.headers, ...excelData.value.rows]

        // 创建工作表
        const worksheet = XLSX.utils.aoa_to_sheet(data)

        // 添加工作表到工作簿
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

        // 生成Excel文件
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })

        // 创建File对象
        const fileName = bomList.value[index].fileName || 'modified_bom.xlsx'
        const modifiedFile = new File([blob], fileName, {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })

        // 更新文件对象，用于预览
        setFile(currentEditId.value, modifiedFile)

        // 更新BOM的fileName
        bomList.value[index].fileName = fileName
      }
    }
  }

  showEditForm.value = false
  Object.keys(editFormData).forEach((key) => {
    editFormData[key as keyof typeof editFormData] = ''
  })
  editSelectedFile.value = null
  currentEditId.value = null
  // 保留excelData的值，以便下次编辑时使用
  // excelData.value = null
}

// 提交BOM
const submitBOM = (id: number) => {
  if (confirm('确定要提交这个BOM吗？')) {
    const index = bomList.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      // 这里可以添加提交逻辑，例如调用API
      console.log('提交BOM到系统:', bomList.value[index])
      // 更新状态为已提交到BOM汇总
      bomList.value[index].approvalStatus = 'submitted_to_summary'
      // 设置当前状态为售前已提交
      bomList.value[index].status = '售前已提交'
      // 更新售前提交时间为当前时间
      bomList.value[index].submitTime1 = new Date().toLocaleString('zh-CN')
      alert('BOM已提交成功！')
    }
  }
}

// 文件预览相关
const showFilePreview = ref(false)
const currentFile = ref<any>(null)
const excelData = ref<any>(null)

// 处理文件预览
const handleFilePreview = (item: any) => {
  currentFile.value = item

  // 获取文件对象
  const file = getFile(item.id)
  if (file) {
    // 使用SheetJS解析Excel文件
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (jsonData.length > 0) {
          // 提取表头
          const headers = jsonData[0]
          // 提取数据行
          const rows = jsonData.slice(1)

          // 更新状态
          excelData.value = {
            headers,
            rows,
          }
        } else {
          // 空文件
          excelData.value = {
            headers: [],
            rows: [],
          }
        }
      } catch (error) {
        console.error('解析Excel文件失败:', error)
        // 解析失败时使用模拟数据
        excelData.value = {
          headers: ['物料编码', '物料名称', '数量', '单位', '单价', '金额'],
          rows: [
            ['M001', '螺丝', 100, '个', 0.5, 50],
            ['M002', '螺母', 200, '个', 0.3, 60],
            ['M003', '垫片', 300, '个', 0.1, 30],
            ['M004', '弹簧', 50, '个', 1.0, 50],
            ['M005', '轴承', 20, '个', 5.0, 100],
          ],
        }
      }
    }
    reader.readAsArrayBuffer(file)
  } else {
    // 没有文件时使用模拟数据
    excelData.value = {
      headers: ['物料编码', '物料名称', '数量', '单位', '单价', '金额'],
      rows: [
        ['M001', '螺丝', 100, '个', 0.5, 50],
        ['M002', '螺母', 200, '个', 0.3, 60],
        ['M003', '垫片', 300, '个', 0.1, 30],
        ['M004', '弹簧', 50, '个', 1.0, 50],
        ['M005', '轴承', 20, '个', 5.0, 100],
      ],
    }
  }

  showFilePreview.value = true
}

// 关闭文件预览
const closeFilePreview = () => {
  showFilePreview.value = false
  currentFile.value = null
  excelData.value = null
}

// 下载文件
const downloadFile = (item?: any) => {
  if (item) {
    // 直接下载文件，不修改任何状态
    const file = getFile(item.id)
    if (file) {
      const url = URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = url
      link.download = item.fileName || 'BOM.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } else {
      alert('文件不存在')
    }
  } else if (currentFile.value) {
    // 预览时的下载
    alert('正在下载文件: ' + currentFile.value.fileName)
    closeFilePreview()
  }
}

// 删除BOM
const deleteBOM = (id: number) => {
  if (confirm('确定要删除这个BOM吗？')) {
    const index = bomList.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      bomList.value.splice(index, 1)
      alert('BOM已删除成功！')
    }
  }
}
</script>
<style scoped>
.bom-list {
  height: 100%;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}

.tab-items {
  display: flex;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
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
  padding: 12px 20px;
  background-color: #F5F5F5;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.8);
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-weight: bold;
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
  padding: 15px;
}

/* BOM列表表格样式 */
.bom-table {
  margin-top: 5px;
  overflow-x: auto;
}

.bom-table table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
}

.bom-table th,
.bom-table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.bom-table th {
  background-color: #ffffff;
  font-weight: bold;
  color: #333;
  font-size: 14px;
}

.bom-table tr:hover {
  background-color: #f5f5f5;
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

/* 操作按钮样式 */
.edit-btn {
  padding: 4px 8px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 8px;
  transition: background-color 0.3s ease;
}

.edit-btn:hover {
  background-color: #45a049;
}

/* 表格中的提交按钮样式 */
.bom-table .submit-btn {
  padding: 4px 8px;
  font-size: 12px;
  margin: 0;
  margin-right: 8px;
}

/* 表格中的删除按钮样式 */
.bom-table .delete-btn {
  padding: 4px 8px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s ease;
}

.bom-table .delete-btn:hover {
  background-color: #da190b;
}

/* BOM库搜索样式 */
.library-search {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.library-search .search-bar {
  max-width: 100%;
}

/* 搜索结果样式 */
.search-results {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-result-item {
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s ease;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: #f5f5f5;
}

.search-result-item.active {
  background-color: #e3f2fd;
  border-left: 3px solid #1976d2;
}

.result-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.result-description {
  font-size: 12px;
  color: #666;
}

/* 无结果提示样式 */
.no-results {
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

/* 编辑模态框样式 */
.edit-modal {
  background-color: white;
  border-radius: 8px;
  min-width: 800px;
  width: auto;
  max-width: 95vw;
  min-height: 500px;
  height: auto;
  max-height: 95vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Excel编辑器样式 */
.excel-editor {
  margin-top: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  max-height: 400px;
  overflow-y: auto;
}

.excel-table {
  width: 100%;
  border-collapse: collapse;
}

.excel-table th,
.excel-table td {
  border: 1px solid #e0e0e0;
  padding: 0;
}

.header-input,
.cell-input {
  width: 100%;
  padding: 8px;
  border: none;
  outline: none;
  font-size: 14px;
  box-sizing: border-box;
}

.header-input {
  background-color: #f5f5f5;
  font-weight: bold;
}

.cell-input {
  background-color: #ffffff;
}

.cell-input:focus {
  background-color: #e3f2fd;
  border: 1px solid #1976d2;
}

/* 加载消息样式 */
.loading-message {
  padding: 40px;
  text-align: center;
  color: #666;
  font-size: 14px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

/* 下载链接样式 */
.download-link {
  color: #1976d2;
  text-decoration: underline;
  cursor: pointer;
}

.download-link:hover {
  color: #1565c0;
  text-decoration: none;
}

/* 下载按钮样式 */
.bom-table .download-btn {
  padding: 4px 8px;
  background-color: #4caf50;
  color: white;
  border: 1px solid #4caf50;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 8px;
  transition: background-color 0.3s ease;
}

.bom-table .download-btn:hover {
  background-color: #388e3c;
}

.bom-table .download-btn:disabled {
  background-color: #cccccc !important;
  cursor: not-allowed !important;
  color: #666666 !important;
  border: 1px solid #cccccc !important;
}

/* 禁用按钮样式 */
.bom-table button:disabled {
  background-color: #cccccc !important;
  cursor: not-allowed !important;
  color: #666666 !important;
}

/* 数据源选择选项卡样式 */
.data-source-tabs {
  display: flex;
  margin-bottom: 10px;
}

.tab-btn {
  flex: 1;
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:first-child {
  border-radius: 4px 0 0 4px;
}

.tab-btn:last-child {
  border-radius: 0 4px 4px 0;
  border-left: none;
}

.tab-btn.active {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

/* 文件预览样式 */
.file-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.file-preview-content {
  background-color: white;
  border-radius: 8px;
  min-width: 600px;
  width: auto;
  max-width: 90vw;
  min-height: 400px;
  height: auto;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0;
}

.file-preview-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-preview-header h3 {
  margin: 0;
  color: #333;
}

.file-preview-header .close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-preview-header .close-btn:hover {
  color: #333;
}

.file-preview-body {
  padding: 20px;
}

.file-info {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.file-info p {
  margin: 8px 0;
  color: #333;
}

.file-content {
  margin-top: 20px;
}

.file-content p {
  margin: 10px 0;
  color: #333;
}

.file-simulated-content {
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  color: #666;
  font-family: monospace;
  white-space: pre-wrap;
}

.excel-preview {
  margin-top: 20px;
  overflow-x: auto;
}

.excel-preview table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e0e0e0;
}

.excel-preview th,
.excel-preview td {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  text-align: left;
}

.excel-preview th {
  background-color: #f5f5f5;
  font-weight: bold;
  color: #333;
}

.excel-preview tr:hover {
  background-color: #f9f9f9;
}

.file-preview-footer {
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.file-preview-footer .download-btn {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.file-preview-footer .download-btn:hover {
  background-color: #388e3c;
}

.file-preview-footer .close-btn {
  padding: 8px 16px;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.file-preview-footer .close-btn:hover {
  background-color: #e0e0e0;
}
</style>
