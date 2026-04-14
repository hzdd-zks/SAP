<template>
  <div class="bom-list">
    <div class="tab-header">
      <div class="tab-items">
        <div
          class="tab-item"
          :class="{ active: activeTab === 'create' }"
          @click="activeTab = 'create'"
        >
          新增BOM
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'history' }"
          @click="activeTab = 'history'"
        >
          BOM汇总
        </div>
      </div>
      <div class="header-actions">
        <SearchBar @search="handleSearch" />
      </div>
    </div>

    <div class="tab-content">
      <!-- 新增BOM -->
      <div v-if="activeTab === 'create'" class="tab-panel">
        <div class="panel-header">
          <h3>新增BOM</h3>
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
                  <td><span class="bom-name-link" @click="handleFilePreview(item)">{{ item.name }}</span></td>
                  <td>{{ item.fileName || '-' }}</td>
                  <td>{{ item.submitter1 || '' }}</td>
                  <td>{{ item.submitter2 || '' }}</td>
                  <td>{{ item.submitTime2 || item.submitTime1 }}</td>
                  <td>{{ item.remark || '-' }}</td>
                  <td>{{ item.status || '' }}</td>
                  <td>
                    <button
                      class="edit-btn"
                      @click="editBOM(item)"
                      :disabled="
                        summarySubmittedStatus[item.id] || item.approvalStatus === 'submitted'
                      "
                    >
                      修改
                    </button>
                    <button
                      class="submit-btn"
                      @click="submitSummaryBOM(item.id)"
                      :disabled="
                        summarySubmittedStatus[item.id] || item.approvalStatus === 'submitted'
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
                      :disabled="
                        summarySubmittedStatus[item.id] || item.approvalStatus === 'submitted'
                      "
                    >
                      删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else>{{ searchQuery ? '没有找到匹配的BOM' : '暂无已提交的BOM数据' }}</p>
        </div>
      </div>

      <!-- BOM汇总 -->
      <div v-else-if="activeTab === 'history'" class="tab-panel">
        <div class="panel-header">
          <h3>BOM汇总</h3>
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
                  <td><span class="bom-name-link" @click="handleFilePreview(item)">{{ item.name }}</span></td>
                  <td>{{ item.fileName || '-' }}</td>
                  <td>{{ item.submitter1 || '' }}</td>
                  <td>{{ item.submitter2 || '' }}</td>
                  <td>{{ item.submitTime2 || item.submitTime1 }}</td>
                  <td>{{ item.remark || '-' }}</td>
                  <td>{{ item.status || '' }}</td>
                  <td>
                    <button
                      class="edit-btn"
                      @click="editBOM(item)"
                      :disabled="
                        summarySubmittedStatus[item.id] || item.approvalStatus === 'submitted'
                      "
                    >
                      修改
                    </button>
                    <button
                      class="submit-btn"
                      @click="submitSummaryBOM(item.id)"
                      :disabled="
                        summarySubmittedStatus[item.id] || item.approvalStatus === 'submitted'
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
                      :disabled="
                        summarySubmittedStatus[item.id] || item.approvalStatus === 'submitted'
                      "
                    >
                      删除
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else>{{ searchQuery ? '没有找到匹配的BOM' : '暂无已提交的BOM数据' }}</p>
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
              <label>BOM编号</label>
              <input
                v-model="formData.bomNumber"
                type="text"
                placeholder="请输入BOM编号"
                required
              />
            </div>
            <div class="form-group">
              <label>订单编号</label>
              <input
                v-model="formData.orderNumber"
                type="text"
                placeholder="请输入订单编号"
                required
              />
            </div>
            <div class="form-group">
              <label>类型</label>
              <select v-model="formData.type" required>
                <option value="">请选择类型</option>
                <option value="bom">项目BOM</option>
                <option value="office">办公用品</option>
                <option value="equipment">设备采购</option>
                <option value="service">服务需求</option>
                <option value="other">其他</option>
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
              <button type="submit" class="form-submit-btn">提交</button>
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
          <form @submit.prevent="saveEdit">
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
              <label>上传新文件（可选）</label>
              <input type="file" @change="handleEditFileUpload" accept=".xlsx, .xls" />
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
              <button type="submit" class="form-submit-btn">保存</button>
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
            <p><strong>提交者:</strong> {{ currentFile.submitter1 || currentFile.submitter2 || '未知' }}</p>
          </div>
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
          <div v-else class="loading-message">加载文件内容中...</div>
        </div>
        <div class="file-preview-footer">
          <button class="download-btn" @click="downloadFile(currentFile)">下载文件</button>
          <button class="close-btn" @click="closeFilePreview">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useBOMStore } from '../store/bomStore'
import * as XLSX from 'xlsx'
import SearchBar from '../components/SearchBar.vue'

const { bomList, fileMap, setFile, getFile } = useBOMStore()

// 搜索相关
const searchQuery = ref('')

// 只显示已提交的BOM数据
const submittedBOMs = computed(() => {
  return bomList.value.filter((item) => item.approvalStatus === 'submitted')
})

// 只显示从BOMList提交的BOM数据
const summaryBOMs = computed(() => {
  return bomList.value.filter((item) => item.approvalStatus === 'submitted_to_summary')
})

// 过滤后的BOM列表
const filteredBOMList = computed(() => {
  // 包含已提交到BOM汇总和已提交到采购管理的BOM
  const allBOMs = bomList.value.filter(
    (item) => item.approvalStatus === 'submitted_to_summary' || item.approvalStatus === 'submitted',
  )

  if (!searchQuery.value) {
    return allBOMs
  }
  const query = searchQuery.value.toLowerCase()
  return allBOMs.filter((item) => item.name.toLowerCase().includes(query))
})

// 处理搜索
const handleSearch = (query: string) => {
  searchQuery.value = query
  console.log('搜索查询:', query)
}

// 新增BOM板块中的提交状态（独立于BOM提交板块）
const summarySubmittedStatus = ref<Record<number, boolean>>({})

const activeTab = ref('create')
const showForm = ref(false)
const showEditForm = ref(false)
const currentEditId = ref<number | null>(null)

// 编辑表单数据
const editFormData = reactive({
  name: '',
  remark: '',
})

// Excel文件数据
const excelData = ref<any>(null)

// 文件上传处理
const editSelectedFile = ref<File | null>(null)

const handleEditFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    editSelectedFile.value = input.files[0]
    console.log('上传文件:', editSelectedFile.value.name)
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
  console.log('fileMap大小:', fileMap.size)
  console.log('fileMap所有键:', Array.from(fileMap.keys()))
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

// 提交BOM（BOM提交板块）
const submitBOM = (id: number) => {
  if (confirm('确定要提交这个BOM吗？')) {
    const index = bomList.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      console.log('提交BOM到采购管理:', bomList.value[index])
      bomList.value[index].approvalStatus = 'submitted'
      // 设置当前状态为研发已提交
      bomList.value[index].status = '研发已提交'
      // 更新提交者2为当前用户（研发）
      bomList.value[index].submitter2 = currentUserName.value
      // 更新研发提交时间为当前时间
      bomList.value[index].submitTime2 = new Date().toLocaleString('zh-CN')
      alert('BOM已提交成功！')
    }
  }
}

// 提交BOM（新增BOM板块）
const submitSummaryBOM = (id: number) => {
  if (confirm('确定要提交这个BOM吗？')) {
    const index = bomList.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      console.log('在新增BOM板块中提交BOM到采购管理:', bomList.value[index])
      bomList.value[index].approvalStatus = 'submitted'
      // 设置当前状态为研发已提交
      bomList.value[index].status = '研发已提交'
      // 更新提交者2为当前用户（研发）
      bomList.value[index].submitter2 = currentUserName.value
      // 更新研发提交时间为当前时间
      bomList.value[index].submitTime2 = new Date().toLocaleString('zh-CN')
      summarySubmittedStatus.value[id] = true
      alert('BOM已在新增BOM板块中提交成功！')
    }
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

// 保存编辑
const saveEdit = () => {
  if (currentEditId.value) {
    const index = bomList.value.findIndex((item) => item.id === currentEditId.value)
    if (index !== -1) {
      bomList.value[index].name = editFormData.name
      bomList.value[index].remark = editFormData.remark

      // 处理Excel文件内容修改
      if (excelData.value) {
        try {
          // 创建新的工作簿
          const workbook = XLSX.utils.book_new()

          // 准备数据：表头 + 数据行
          const data = [excelData.value.headers, ...excelData.value.rows]

          // 创建工作表
          const worksheet = XLSX.utils.aoa_to_sheet(data)

          // 将工作表添加到工作簿
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

          // 生成Excel文件
          const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
          const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          })

          // 获取原始文件名
          const originalFileName = bomList.value[index].fileName || 'BOM.xlsx'
          const fileName = originalFileName.includes('.')
            ? originalFileName
            : `${originalFileName}.xlsx`

          // 创建新的文件对象
          const modifiedFile = new File([blob], fileName, {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          })

          // 更新文件对象，用于预览
          setFile(currentEditId.value, modifiedFile)

          // 更新BOM的fileName
          bomList.value[index].fileName = fileName
        } catch (error) {
          console.error('生成Excel文件失败:', error)
        }
      }

      // 处理新上传的文件
      if (editSelectedFile.value) {
        bomList.value[index].fileName = editSelectedFile.value.name
        setFile(currentEditId.value, editSelectedFile.value)
      }

      showEditForm.value = false
      alert('BOM已修改成功！')
    }
  }
}

const formData = reactive({
  bomNumber: '',
  orderNumber: '',
  type: '',
  date: new Date().toISOString().split('T')[0],
  remark: '',
})

const handleSubmit = () => {
  console.log('提交BOM:', formData)
  showForm.value = false
  Object.keys(formData).forEach((key) => {
    formData[key as keyof typeof formData] = ''
  })
  formData.date = new Date().toISOString().split('T')[0]
}

// 下载文件
const downloadFile = (item: any) => {
  if (!item) return
  const file = getFile(item.id)
  if (file) {
    // 设置当前状态为研发已查看，但如果BOM已提交或状态已经是采购相关状态，则不更改
    const index = bomList.value.findIndex((bom) => bom.id === item.id)
    if (index !== -1 && item.approvalStatus !== 'submitted' && !item.status.includes('采购')) {
      bomList.value[index].status = '研发已查看'
    }
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
}

// 文件预览相关
const showFilePreview = ref(false)
const currentFile = ref<any>(null)

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
  // 保留excelData的值，以便下次预览时使用
  // excelData.value = null
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

.form-submit-btn {
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.form-submit-btn:hover {
  background-color: #1565c0;
}

/* 表格样式 */
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

/* 操作按钮样式 */
.edit-btn,
.submit-btn,
.delete-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 5px;
  transition: background-color 0.3s ease;
}

.edit-btn {
  background-color: #4caf50;
  color: white;
}

.edit-btn:hover {
  background-color: #45a049;
}

.submit-btn {
  background-color: #1976d2;
  color: white;
}

.submit-btn:hover {
  background-color: #1565c0;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #da190b;
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
.download-btn {
  padding: 4px 8px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 5px;
  transition: background-color 0.3s ease;
}

.download-btn:hover {
  background-color: #388e3c;
}

.download-btn:disabled {
  background-color: #cccccc !important;
  cursor: not-allowed !important;
  color: #666666 !important;
  border: 1px solid #cccccc !important;
}

/* 禁用按钮样式 */
button:disabled {
  background-color: #cccccc !important;
  cursor: not-allowed !important;
  color: #666666 !important;
  border: 1px solid #cccccc !important;
}

/* 确保表格中的禁用按钮样式生效 */
.bom-table button:disabled {
  background-color: #cccccc !important;
  cursor: not-allowed !important;
  color: #666666 !important;
  border: 1px solid #cccccc !important;
}

/* Excel编辑器样式 */
.excel-editor {
  margin-top: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 16px;
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

.loading-message {
  padding: 20px;
  text-align: center;
  color: #666;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

/* 编辑弹窗样式 */
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

/* BOM名称链接样式 */
.bom-name-link {
  color: #1976d2;
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.3s ease;
}

.bom-name-link:hover {
  color: #1565c0;
  text-decoration: underline;
}
</style>
