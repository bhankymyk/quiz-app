<template>
  <div class="mt-1 bg-gray-100 rounded-3xl">
    <div class="p-6">
      <div class="flex items-center justify-between mb-8">
        <div class="rounded-lg border border-gray-400 pt-1 px-1">
          <button @click="goBack" class="">
            <img src="/src/assets/arrow-back-2.png" class="w-5 h-5 text-green-700" alt="back" />
          </button>
        </div>
        <h1 class="text-xl font-semibold">Course Preview</h1>
        <button class="rounded-lg border border-gray-400 py-1 px-1">
          <img src="/src/assets/question-mark.png" class="w-5 h-5" />
        </button>
      </div>

      <div class="flex justify-between">
        <div class="">
          <div class="text-sm mb-2">Lesson 1.3</div>
          <div class="flex gap-1">
            <div class="h-1 w-7 bg-purple-600 rounded"></div>
            <div class="h-1 w-7 bg-purple-200 rounded"></div>
            <div class="h-1 w-7 bg-purple-200 rounded"></div>
            <div class="h-1 w-7 bg-purple-200 rounded"></div>
          </div>
        </div>
        <div
          class="flex justify-between items-center border bg-purple-50 rounded-full p-2 space-x-2"
        >
          <img src="/src/assets/clock.png" class="w-5 h-5" />
          <p class="text-purple-600 text-base font-bold">{{ formattedTime }}</p>
        </div>
      </div>

      <h2 class="text-xl font-semibold my-6">Match the Algebraic Terms!</h2>

      <div class="grid gap-4 mb-8 lg:grid-cols-2">
        <div
          v-for="(definition, index) in items"
          :key="definition.id"
          class="p-4 rounded-lg transition-colors duration-200 border border-dashed relative"
          :class="[
            {
              'bg-yellow-50 border-2': definition.matched,
              'bg-purple-200 border-purple-300 opacity-50 border-2 border-dashed qst':
                !definition.matched && !(isDraggingOver === definition.id),
              'bg-red-100 border-2':
                (!definition.matched &&
                  isDraggingOver === definition.id &&
                  selectedAnswer !== definition.id) ||
                definition.isWrong,
              'bg-green-100': definition.matched && definition.isCorrect,
            },
            index === items.length - 1 && items.length % 2 === 1 ? 'col-span-2 w-1/2 mx-auto' : '',
          ]"
          @dragover.prevent="handleDragOver($event, definition)"
          @dragleave="handleDragLeave"
          @drop="handleDrop($event, definition)"
        >
          {{ definition.text }}
          <div v-if="definition.matched  || definition.isWrong" class="absolute top-6 right-2">
            <div class="" v-if="definition.isCorrect">
              <img src="/src/assets/checked.png" class="w-5 h-5" />
            </div>

            <div class="div" v-if="definition.isWrong">
              <img src="/src/assets/checkedwrong.png" class="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 mx-1 rounded-3xl">
      <h5 class="text-center">
        Drag the correct Algebraic term below to match the <br />
        definition above.
      </h5>
      <div class="grid grid-cols-3 gap-4 mb-8 mt-5">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          draggable="true"
          @dragstart="handleDragStart($event, item)"
          @dragend="handleDragEnd"
          class="py-6 bg-gray-800 text-white rounded-xl text-center cursor-move transition-opacity duration-200 opt"
          :class="[
            { 'opacity-10 text-opacity-50': item.matched },
            index === items.length - 2 && items.length % 3 === 2 ? 'col-span-2 w-1/2 mx-auto' : '',
          ]"
        >
          {{ capitalizeFirst(item.id) }}
        </div>
      </div>

      <div class="flex justify-between">
        <div class="flex items-center rounded-xl p-3 px-5 border border-gray-400 mr-10">
          <button @click="reloadGame">
            <img src="/src/assets/refresh.svg" class="w-8 h-8 text-purple-800" alt="reload" />
          </button>
        </div>

        <button
          class="w-full bg-purple-800 text-white py-4 rounded-xl flex items-center justify-center transition-colors hover:bg-purple-700"
          :disabled="!allMatched"
          :class="{ 'opacity-50 cursor-not-allowed': !allMatched }"
          @click="handleContinueClick"
        >
          Continue
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 ml-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast, type ToastOptions } from 'vue3-toastify'

interface MatchingItem {
  id: string
  text: string
  matched: boolean
  isCorrect?: boolean
  isWrong?: boolean
  droppedItems?: MatchingItem[]
  originalText?: string
}

const items = ref<MatchingItem[]>([
  {
    id: 'variable',
    text: 'A letter or symbol that represents a value',
    originalText: 'A letter or symbol that represents a value',
    matched: false,
  },
  {
    id: 'constant',
    text: 'A fixed number that does not change',
    originalText: 'A fixed number that does not change',
    matched: false,
  },
  {
    id: 'coefficient',
    text: 'A number that multiplies a variable',
    originalText: 'A number that multiplies a variable',
    matched: false,
  },
  {
    id: 'expression',
    text: 'A combination of numbers, variables, and operations',
    originalText: 'A combination of numbers, variables, and operations',
    matched: false,
  },
  {
    id: 'equation',
    text: 'A statement that two expressions are equal',
    originalText: 'A statement that two expressions are equal',
    matched: false,
  },
])

const router = useRouter()
const handleContinueClick = () => {
  if (allMatched.value) {
    router.push('/success')
  } else {
  }
}

const itemsMatched = () => {
  toast('All items matched!', {
    autoClose: 1000,
    position: toast.POSITION.TOP_CENTER,
  } as ToastOptions)
}

const timeLeft = ref(120)
const timer = ref<ReturnType<typeof setInterval> | null>(null)

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (timeLeft.value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

const startTimer = () => {
  timer.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1
    } else {
      clearInterval(timer.value as ReturnType<typeof setInterval>)
      handleTimeUp()
    }
  }, 1000)
}

const handleTimeUp = () => {
  toast('Time is up !', {
    autoClose: 1000,
    position: toast.POSITION.TOP_CENTER,
  } as ToastOptions)
  window.location.reload()
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

const allMatched = computed(() => items.value.every((item) => item.matched))
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
    const droppedItem = items.value.find((item) => item.id === itemId)
    if (droppedItem) {
      if (definition.id === itemId) {
        droppedItem.matched = true
        definition.isCorrect = true
        definition.isWrong = false
        definition.text = capitalizeFirst(droppedItem.id)
      } else {
        definition.isWrong = true
        definition.text = capitalizeFirst(droppedItem.id)
        droppedItem.matched = false
      }

      definition.droppedItems = definition.droppedItems || []
      definition.droppedItems.push(droppedItem)

      if (allMatched.value) {
        itemsMatched()
      }
    }
  }

  selectedAnswer.value = null
}

const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const goBack = () => {
  router.back()
}

const reloadGame = () => {
  items.value = items.value.map((item) => ({
    ...item,
    text: item.originalText || item.text,
    matched: false,
    isCorrect: false,
    isWrong: false,
    droppedItems: undefined,
  }))

  timeLeft.value = 120

  if (timer.value) {
    clearInterval(timer.value)
  }
  startTimer()
}
</script>

<style scoped>
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.cursor-move {
  cursor: move;
}

@media screen and (max-width: 425px) {
  .opt {

    width: 100px;
  }
  .qst{
    width: 160px;
    height: 120px;
  }

}
</style>
