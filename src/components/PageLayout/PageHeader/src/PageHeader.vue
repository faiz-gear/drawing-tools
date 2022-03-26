<template>
  <div class="page-header">
    <el-row align="middle" justify="start" :gutter="20">
      <h1 class="page-header-title">简易画板工具</h1>
      <el-button type="success" @click="emits('update:drawingType', 'rect')">正方形</el-button>
      <el-button type="warning" style="margin-right: 10px" @click="emits('update:drawingType', 'arc')">圆形</el-button>
      <el-button type="primary" style="margin-left: 20px" @click="emits('update:drawingType', 'common')"
        >画笔</el-button
      >
      <div style="margin-left: 20px">颜色：</div>
      <el-color-picker :model-value="color" @update:model-value="emits('update:color', $event)"></el-color-picker>
      <el-button style="margin-left: 20px" @click="emits('clear')">清空</el-button>
      <el-button @click="emits('save-image')">保存</el-button>
      <el-button :disabled="executionArray.length === 0" @click="emits('undo')">撤销</el-button>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { DrawingType } from '../../PageMain/types/types'

const props = defineProps<{
  drawingType: DrawingType
  color: any
  executionArray: ImageData[]
}>()

const emits = defineEmits<{
  (e: 'update:drawingType', drawingType: DrawingType): void
  (e: 'update:color', color: any): void
  (e: 'clear'): void
  (e: 'save-image'): void
  (e: 'undo'): void
}>()
</script>

<style scoped lang="scss">
.page-header {
  &-title {
    margin-right: 35px;
  }
}
</style>
