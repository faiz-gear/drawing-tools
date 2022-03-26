<template>
  <div class="home">
    <el-container class="container">
      <el-header
        ><PageHeader
          v-model:drawingType="drawingType"
          v-model:color="color"
          :execution-array="executionArray"
          @clear="handleClear"
          @save-image="handleSaveImage"
          @undo="handleUndo"
        ></PageHeader
      ></el-header>
      <el-container>
        <el-aside width="300px"><PageAsideLeft></PageAsideLeft></el-aside>
        <el-main class="main">
          <PageMain
            ref="pageMainRef"
            :drawing-type="drawingType"
            :color="color"
            @change-cache="handleChangeCache"
          ></PageMain>
        </el-main>
        <el-aside width="150px"><PageAsideRight></PageAsideRight></el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity'
import { PageHeader, PageAsideLeft, PageAsideRight, PageMain } from '../../components/PageLayout'
import { DrawingType } from '../../components/PageLayout/PageMain/types/types'

const pageMainRef = ref<InstanceType<typeof PageMain>>()
const drawingType = ref<DrawingType>('common')
const color = ref('')
const executionArray = ref<ImageData[]>([])

const handleClear = () => {
  pageMainRef.value!.clear()
}
const handleSaveImage = () => {
  pageMainRef.value.saveImg()
}
const handleUndo = () => {
  pageMainRef.value.undo()
}
const handleChangeCache = (cache: ImageData[]) => {
  executionArray.value = cache
}
</script>

<style scoped lang="scss">
.container {
  padding: 10px 20px;
  .main {
    padding: 0;
    margin: 0 15px;
  }
}
</style>
