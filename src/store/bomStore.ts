import { ref, reactive } from 'vue'

// BOM数据类型
interface BOM {
  id: number
  name: string
  fileName: string
  submitter: string
  submitter1: string
  submitter2: string
  createTime: string // 售前新建BOM的初始时间
  submitTime1: string // 售前提交时间
  submitTime2: string // 研发提交时间
  purchaseTime: string // 采购正在采购时间
  finalSubmitTime: string // 采购最终提交时间
  remark: string
  approvalStatus: string
  approver: string
  status: string
}

// 全局BOM数据存储
const bomList = ref<BOM[]>([])

// 存储文件对象，用于预览
const fileMap = new Map<number, File>()

// 添加BOM到全局存储
const addBOM = (bom: Omit<BOM, 'id'>) => {
  const currentTime = new Date().toLocaleString('zh-CN')
  const newBOM: BOM = {
    ...bom,
    submitter1: bom.submitter1 || '',
    submitter2: bom.submitter2 || '',
    createTime: bom.createTime || currentTime,
    submitTime1: bom.submitTime1 || '',
    submitTime2: bom.submitTime2 || '',
    purchaseTime: bom.purchaseTime || '',
    finalSubmitTime: bom.finalSubmitTime || '',
    status: bom.status || '',
    id: Date.now(),
  }
  bomList.value.unshift(newBOM)
  return newBOM
}

// 获取所有BOM
const getBOMs = () => {
  return bomList.value
}

// 存储文件到fileMap
const setFile = (id: number, file: File) => {
  fileMap.set(id, file)
}

// 从fileMap获取文件
const getFile = (id: number) => {
  return fileMap.get(id)
}

// 导出存储和方法
export const useBOMStore = () => {
  return {
    bomList,
    addBOM,
    getBOMs,
    fileMap,
    setFile,
    getFile,
  }
}
