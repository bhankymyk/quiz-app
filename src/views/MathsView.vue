<template>
  <div class="max-w-lg mx-auto p-6 bg-white rounded-3xl">
    <div class="flex items-center justify-between mb-8">
      <button class="text-purple-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-xl font-semibold">Course Preview</h1>
      <button class="text-purple-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>

    <div class="mb-8">
      <div class="text-sm mb-2">Lesson 1.3</div>
      <div class="flex gap-1">
        <div class="h-1 w-7  bg-purple-600 rounded"></div>
        <div class="h-1  w-7  bg-purple-200 rounded"></div>
        <div class="h-1 w-7  bg-purple-200 rounded"></div>
        <div class="h-1 w-7 bg-purple-200 rounded"></div>
      </div>
    </div>

    <h2 class="text-xl font-semibold mb-6">Match the Algebraic Terms!</h2>


    <div class="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <div
        v-for="definition in items"
        :key="definition.id"
        class="p-4 rounded-lg transition-colors duration-200 border border-dashed relative"
        :class="{
          'bg-yellow-100': definition.matched,
          'bg-purple-50 border-purple-300 opacity-50': !definition.matched && !(isDraggingOver === definition.id),
          'bg-red-100': !definition.matched && isDraggingOver === definition.id && selectedAnswer !== definition.id,
          'bg-green-100': definition.matched && definition.isCorrect,
        }"
        @dragover.prevent="handleDragOver($event, definition)"
        @dragleave="handleDragLeave"
        @drop="handleDrop($event, definition)"
      >
        {{ definition.text }}
        <div v-if="definition.matched" class="absolute top-2 right-2">
          <svg v-if="definition.isCorrect" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 10l4 4L15 6" clip-rule="evenodd" />
          </svg>
          <svg v-else-if="definition.isWrong" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 5l10 10M5 15L15 5" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-3 lg:grid-cols-4">
      <div
        v-for="item in items"
        :key="item.id"
        draggable="true"
        @dragstart="handleDragStart($event, item)"
        @dragend="handleDragEnd"
        class="py-6 bg-gray-800 text-white rounded-xl text-center cursor-move transition-opacity duration-200"
        :class="{ 'opacity-10 text-opacity-50': item.matched }"
      >
        {{ capitalizeFirst(item.id) }}
      </div>
    </div>

    <button
      class="w-full bg-purple-800 text-white py-4 rounded-xl flex items-center justify-center transition-colors hover:bg-purple-700"
      :disabled="!allMatched"
      :class="{ 'opacity-50 cursor-not-allowed': !allMatched }"
      @click="handleContinueClick"
    >
      Continue
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </button>

    <div v-if="allMatched" class="text-center text-green-500">
      All items matched!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface MatchingItem {
  id: string
  text: string
  matched: boolean
  isCorrect?: boolean
  isWrong?: boolean
  droppedItems?: MatchingItem[]
}

const items = ref<MatchingItem[]>([
  { id: 'variable', text: 'A letter or symbol that represents a value', matched: false },
  { id: 'constant', text: 'A fixed number that does not change', matched: false },
  { id: 'coefficient', text: 'A number that multiplies a variable', matched: false },
  { id: 'expression', text: 'A combination of numbers, variables, and operations', matched: false },
  { id: 'equation', text: 'A statement that two expressions are equal', matched: false }
])

const router = useRouter()
const handleContinueClick = () => {
  if (allMatched.value) {
    router.push('/')
  } else {
  }
}

const allMatched = computed(() => items.value.every(item => item.matched))
const selectedAnswer = ref<string | null>(null)
const isDraggingOver = ref<string | null>(null)

const handleDragStart = (event: DragEvent, item: MatchingItem) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', item.id)
    selectedAnswer.value = item.id
  }
}

const handleDragOver = (event: DragEvent, definition: MatchingItem) => {
  event.preventDefault()
  isDraggingOver.value = definition.id
}

const handleDragLeave = () => {
  isDraggingOver.value = null
}

const handleDragEnd = () => {
  selectedAnswer.value = null
  isDraggingOver.value = null
}

const handleDrop = (event: DragEvent, definition: MatchingItem) => {
  event.preventDefault()
  isDraggingOver.value = null

  let itemId = selectedAnswer.value

  if (!itemId && event.dataTransfer) {
    itemId = event.dataTransfer.getData('text/plain')
  }

  if (itemId) {
    const droppedItem = items.value.find(item => item.id === itemId)
    if (droppedItem) {
      if (definition.id === itemId) {
        droppedItem.matched = true
        droppedItem.isCorrect = true
        droppedItem.isWrong = false
      } else {
        droppedItem.matched = false
        droppedItem.isCorrect = false
        droppedItem.isWrong = true
      }

      definition.droppedItems = definition.droppedItems || []
      definition.droppedItems.push(droppedItem)
    }
  }

  selectedAnswer.value = null
}

const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>

<style scoped>
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.cursor-move {
  cursor: move;
}

.drop-area {
  border: 2px dashed #ccc;
  min-height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
}
</style>
