<template>
  <div ref="pageMainRef" class="page-main">
    <canvas
      id="canvas"
      ref="canvasEl"
      :width="canvasWidth"
      :height="canvasHeight"
      @mousedown="canvasDown"
      @mousemove="canvasMove"
      @mouseout="canvasUp"
      @mouseup="canvasUp"
    >
    </canvas>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity'
import { onMounted, watch } from '@vue/runtime-core'
import dayjs from 'dayjs'
import { DrawingFnType, DrawingType } from '../types/types'

const props = defineProps<{
  drawingType: DrawingType
  color: any
}>()

const emits = defineEmits<{
  (e: 'change-cache', executionArray: ImageData[]): void
}>()

const lineWidth = ref(3)
const canvasWidth = ref(0)
const canvasHeight = ref(0)
const pageMainRef = ref<HTMLDivElement>()

const canvasEl = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D | null>(null)
const isDraw = ref(false)
const beginX = ref(0)
const beginY = ref(0)
const currentImageData = ref<ImageData | null>()
const executionArray = ref<ImageData[]>([])

const canvasDown = (e: MouseEvent) => {
  isDraw.value = true
  beginX.value = e.pageX - canvasEl.value!.offsetLeft
  beginY.value = e.pageY - canvasEl.value!.offsetTop
  ctx.value?.beginPath() // 起始一条路径
  ctx.value?.moveTo(beginX.value, beginY.value) // 把路径移动到画布中的指定点，不创建线条
  if (currentImageData.value) {
    executionArray.value.push(currentImageData.value) // 记录上一次数据
  }
}

const canvasMove = (e: MouseEvent) => {
  if (!isDraw.value) return
  const x = e.pageX - canvasEl.value!.offsetLeft
  const y = e.pageY - canvasEl.value!.offsetTop
  switch (props.drawingType) {
    case 'common':
      commonFn(ctx.value, x, y)
      break
    case 'arc':
      arcFn(ctx.value, x, y)
      break
    case 'rect':
      rectFn(ctx.value, x, y)
      break
    default:
      commonFn(ctx.value, x, y)
      break
  }
}

const canvasUp = () => {
  if (isDraw.value) {
    currentImageData.value = ctx.value!.getImageData(0, 0, canvasWidth.value, canvasHeight.value)
    isDraw.value = false
  }
}

const commonFn: DrawingFnType = (ctx, x, y) => {
  ctx!.lineWidth = lineWidth.value
  ctx!.strokeStyle = props.color // 指定线条颜色
  ctx?.lineTo(x, y) // 添加一个新点，然后在画布中创建从该点到最后指定点的线条
  ctx?.stroke() // 绘制当前定义的路径
}

const arcFn: DrawingFnType = (ctx, x, y) => {
  executionArray.value[executionArray.value.length - 1] &&
    ctx!.putImageData(
      executionArray.value[executionArray.value.length - 1],
      0,
      0,
      0,
      0,
      canvasWidth.value,
      canvasHeight.value
    )
  ctx?.beginPath()
  ctx!.strokeStyle = props.color
  ctx?.arc(
    beginX.value,
    beginY.value,
    Math.round(Math.sqrt(Math.pow(x - beginX.value, 2) + Math.pow(y - beginY.value, 2))),
    0,
    2 * Math.PI
  )
  ctx?.stroke() // 绘制当前定义的路径
  ctx?.closePath()
}

const rectFn: DrawingFnType = (ctx, x, y) => {
  executionArray.value[executionArray.value.length - 1] &&
    ctx!.putImageData(
      executionArray.value[executionArray.value.length - 1],
      0,
      0,
      0,
      0,
      canvasWidth.value,
      canvasHeight.value
    )
  ctx?.beginPath()
  ctx!.strokeStyle = props.color
  ctx?.rect(beginX.value, beginY.value, x - beginX.value, y - beginY.value)
  ctx?.stroke() // 绘制当前定义的路径
  ctx?.closePath()
}

const saveImg = () => {
  const a = document.createElement('a')
  a.download = '画图' + dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss')
  a.href = canvasEl.value!.toDataURL()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const clear = () => {
  currentImageData.value = ctx.value?.createImageData(canvasWidth.value, canvasHeight.value)
  executionArray.value = []
  ctx.value?.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
}

const undo = () => {
  createNewImageData()
  if (executionArray.value.length === 0) return
  currentImageData.value = executionArray.value.pop()

  ctx.value!.putImageData(currentImageData.value!, 0, 0, 0, 0, canvasWidth.value, canvasHeight.value)
}

const createNewImageData = () => {
  // 创建新的、空白的ImageData对象
  currentImageData.value = ctx.value!.createImageData(canvasWidth.value, canvasHeight.value)
}

defineExpose({
  clear,
  saveImg,
  undo
})

onMounted(() => {
  ctx.value = canvasEl.value!.getContext('2d')
  canvasWidth.value = pageMainRef.value!.clientWidth
  canvasHeight.value = pageMainRef.value!.clientHeight
  createNewImageData()
})

watch(
  executionArray,
  (newValue) => {
    emits('change-cache', newValue)
  },
  {
    deep: true
  }
)
</script>

<style scoped lang="scss">
.page-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  height: 100%;
  border-radius: $border-radius-sm;
}
</style>
