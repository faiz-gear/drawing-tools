<template>
  <div class="home">
    <el-row align="middle" justify="center" :gutter="20">
      <el-button type="success" @click="changeType('rect')">正方形</el-button>
      <el-button
        type="warning"
        style="margin-right: 10px"
        @click="changeType('arc')"
        >圆形</el-button
      >
      <el-button
        type="primary"
        style="margin-left: 20px"
        @click="changeType('common')"
        >画笔</el-button
      >
      <div style="margin-left: 20px">颜色：</div>
      <el-color-picker v-model="color"></el-color-picker>
      <el-button style="margin-left: 20px" @click="clear">清空</el-button>
      <el-button @click="saveImg">保存</el-button>
      <el-button :disabled="executionArray.length === 0" @click="undo"
        >撤销</el-button
      >
    </el-row>
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
import { onMounted } from '@vue/runtime-core'
import dayjs from 'dayjs'

type DrawingType = 'rect' | 'arc' | 'common'
type DrawingFnType = (
  ctx: CanvasRenderingContext2D | null,
  x: number,
  y: number
) => void
const lineWidth = ref(3)
const canvasWidth = ref(800)
const canvasHeight = ref(400)

const canvasEl = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D | null>(null)
const isDraw = ref(false)
const beginX = ref(0)
const beginY = ref(0)
const color = ref('')
const imageData = ref<ImageData | null>()
const executionArray = ref<ImageData[]>([])

const type = ref<DrawingType>('common')
const changeType = (newType: DrawingType) => {
  type.value = newType
}

const canvasDown = (e: MouseEvent) => {
  isDraw.value = true
  beginX.value = e.pageX - canvasEl.value!.offsetLeft
  beginY.value = e.pageY - canvasEl.value!.offsetTop
  ctx.value?.beginPath() // 起始一条路径
  ctx.value?.moveTo(beginX.value, beginY.value) // 把路径移动到画布中的指定点，不创建线条
  if (imageData.value) {
    executionArray.value.push(imageData.value) // 记录上一次数据
  }
}

const canvasMove = (e: MouseEvent) => {
  if (!isDraw.value) return
  const x = e.pageX - canvasEl.value!.offsetLeft
  const y = e.pageY - canvasEl.value!.offsetTop
  switch (type.value) {
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
    imageData.value = ctx.value!.getImageData(
      0,
      0,
      canvasWidth.value,
      canvasHeight.value
    )
    isDraw.value = false
  }
}

const commonFn: DrawingFnType = (ctx, x, y) => {
  // ctx?.arc(x, y, 5, 0, 2 * Math.PI) // 创建圆形或部分圆
  // ctx!.fillStyle = color.value // 着色
  // ctx?.fill() // 填充绘图路径
  // ctx?.closePath() // 创建从当前点回到起始点的路径
  ctx!.lineWidth = lineWidth.value
  ctx!.strokeStyle = color.value // 指定线条颜色
  ctx?.lineTo(x, y) // 添加一个新点，然后在画布中创建从该点到最后指定点的线条
  ctx?.stroke() // 绘制当前定义的路径
}

const arcFn: DrawingFnType = (ctx, x, y) => {
  imageData.value &&
    ctx!.putImageData(
      imageData.value,
      0,
      0,
      0,
      0,
      canvasWidth.value,
      canvasHeight.value
    )
  ctx?.beginPath()
  ctx!.strokeStyle = color.value
  ctx?.arc(
    beginX.value,
    beginY.value,
    Math.round(
      Math.sqrt(Math.pow(x - beginX.value, 2) + Math.pow(y - beginY.value, 2))
    ),
    0,
    2 * Math.PI
  )
  ctx?.stroke() // 绘制当前定义的路径
  ctx?.closePath()
}

const rectFn: DrawingFnType = (ctx, x, y) => {
  imageData.value &&
    ctx!.putImageData(
      imageData.value,
      0,
      0,
      0,
      0,
      canvasWidth.value,
      canvasHeight.value
    )
  ctx?.beginPath()
  ctx!.strokeStyle = color.value
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
  imageData.value = ctx.value?.createImageData(
    canvasWidth.value,
    canvasHeight.value
  )
  executionArray.value = []
  ctx.value?.clearRect(0, 0, canvasWidth.value, canvasHeight.value)
}

const undo = () => {
  createNewImageData()
  if (executionArray.value.length === 0) return
  const lastImageData = executionArray.value.pop()

  ctx.value!.putImageData(
    lastImageData!,
    0,
    0,
    0,
    0,
    canvasWidth.value,
    canvasHeight.value
  )
}

const createNewImageData = () => {
  // 创建新的、空白的ImageData对象
  imageData.value = ctx.value!.createImageData(
    canvasWidth.value,
    canvasHeight.value
  )
}

onMounted(() => {
  ctx.value = canvasEl.value!.getContext('2d')
  createNewImageData()
})
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}
#canvas {
  margin-top: 20px;
  border: 1px solid black;
}
</style>
