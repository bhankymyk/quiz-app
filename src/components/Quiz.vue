<template>
  <div class="min-h-screen flex justify-center mt-1 bg-gray-100 shadow-md">
    <div class="w-full space-y-8 bg-white p-6 rounded-lg shadow-lg h-screen-">
      <button @click="goBack" class="bg-purple-200 text-white rounded-full p-1">
        <img src="/src/assets/arrow-back.png" class="w-6 h-6" />
      </button>

      <!-- Header -->
      <div class="flex justify-between items-center mb-4 bg-purple-800 p-5 rounded-lg">
        <h1 class="text-base font-bold text-white">Goal: 30 points</h1>
        <div class="text-base font-normal text-white">Current Points: {{ score }}</div>
      </div>

      <!-- Body -->
      <div v-if="loading" class="text-center text-xl font-semibold">Loading...</div>

      <div v-else>
        <div v-if="currentQuestionIndex < quizQuestions.length" class="space-y-2 px-4">
          <h1 class="text-xl font-semibold">Question {{ currentQuestionIndex + 1 }}</h1>
          <h1 class="textg font-semibold-">{{ currentQuestion.question }}</h1>

          <div class="space-y-4">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              @click="checkAnswer(option)"
              :class="[
                'flex justify-between w-full p-4  rounded-lg focus:outline-none border border-gray-300',
                answerStatus === 'correct' && selectedOption === option
                  ? 'border-2 border-green-400 bg-green-50 outline-none'
                  : '',
                answerStatus === 'incorrect' && selectedOption === option
                  ? 'border-2 border-red-400 bg-red-50 outline-none'
                  : '',
                answerStatus === 'correct' && selectedOption === option ? 'text-green-500' : '',
                answerStatus === 'incorrect' && selectedOption === option ? 'text-red-500' : '',
              ]"
            >
              {{ String.fromCharCode(65 + index) }}. {{ option }}
              <span v-if="answerStatus === 'correct' && selectedOption === option">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  style="fill: #40c057"
                >
                  <path
                    d="M 12 2 C 6.486 2 2 6.486 2 12 C 2 17.514 6.486 22 12 22 C 17.514 22 22 17.514 22 12 C 22 10.874 21.803984 9.7942031 21.458984 8.7832031 L 19.839844 10.402344 C 19.944844 10.918344 20 11.453 20 12 C 20 16.411 16.411 20 12 20 C 7.589 20 4 16.411 4 12 C 4 7.589 7.589 4 12 4 C 13.633 4 15.151922 4.4938906 16.419922 5.3378906 L 17.851562 3.90625 C 16.203562 2.71225 14.185 2 12 2 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z"
                  ></path>
                </svg>
              </span>

              <span v-if="answerStatus === 'incorrect' && selectedOption === option" class="">
                <img src="/src/assets/error.png" />
              </span>
            </button>
          </div>
        </div>

        <div v-else class="text-center text-xl font-bold">
          <p>You've completed the quiz!</p>
          <p>Your score: {{ score }} / {{ quizQuestions.length }}</p>
          <div class="mt-5">
            <p class="font-bold text-lg">{{ congratMessage }}</p>
          </div>

          <div class="mt-10">
            <router-link to="/maths" class="text-blue-500 text-base"
              >Click here to try the Drag and Drop Arithemetic</router-link
            >
            <p>or</p>
            <router-link to="/" class="text-blue-500 text-base">Try the quiz again</router-link>
          </div>
        </div>

        <div class="mx-3">
          <!-- Show the selected answer -->
          <div
            v-if="selectedAnswer"
            class="text-lg font-semibold text-center my-2 bg-yellow-500 text-white"
          >
            Selected Answer: {{ selectedAnswer }}
          </div>

          <!-- message box -->
          <div
            v-if="answerMessage"
            class="flex flex-col w-full py-2 px-4 h-auto focus:outline-none border border-gray-300 mt-5"
            :class="{
              'bg-green-100 text-green-500': answerStatus === 'correct',
              'bg-red-100 text-red-500': answerStatus === 'incorrect',
              '': answerStatus !== 'correct' && answerStatus !== 'incorrect',
            }"
          >
            <div class="flex">
              <img
                v-if="answerStatus === 'incorrect'"
                src="/src/assets/error.png"
                class="w-6 h-6 mr-2"
              />
              <img
                v-if="answerStatus === 'correct'"
                src="/src/assets/correct.png"
                class="w-6 h-6 mr-2"
              />

              <span>{{ answerMessage }}</span>
            </div>
            <!-- Show clue if incorrect -->
            <h4 v-if="answerStatus === 'incorrect'" class="block text-red-400 ml-8">
              {{ currentQuestion.clue }}
            </h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed } from 'vue'
import { quizQuestions } from '../utils/Data'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  clue: string
}

export default {
  name: 'QuizComponent',
  setup() {
    const shuffleQuestions = (questions: Question[]) => {
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[questions[i], questions[j]] = [questions[j], questions[i]]
      }
    }

    shuffleQuestions(quizQuestions)

    const currentQuestionIndex = ref(0)
    const score = ref(0)
    const loading = ref(false)
    const answerStatus = ref<string | null>(null)
    const selectedOption = ref<string | null>(null)
    const answerMessage = ref<string | null>(null)
    const selectedAnswer = ref<string | null>(null)

    const currentQuestion = computed(() => quizQuestions[currentQuestionIndex.value])

    const checkAnswer = (selected: string) => {
      selectedOption.value = selected
      if (selected === currentQuestion.value.correctAnswer) {
        score.value++
        answerStatus.value = 'correct'
        answerMessage.value = 'Right'
      } else {
        answerStatus.value = 'incorrect'
        answerMessage.value = 'Think again'
      }

      setTimeout(() => {
        currentQuestionIndex.value++
        answerStatus.value = null
        selectedOption.value = null
        answerMessage.value = null
        selectedAnswer.value = null
      }, 3000)
    }

    const goBack = () => {
      if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--
      }
    }

    const congratMessage = computed(() => {
      if (score.value === quizQuestions.length) {
        return 'Congratulations! You got all the questions right!'
      } else if (score.value >= 20) {
        return 'Pat yourself at the back! You got most of the questions right!'
      } else {
        return 'You can pratice more to do better!'
      }
    })

    return {
      quizQuestions,
      currentQuestionIndex,
      score,
      loading,
      currentQuestion,
      checkAnswer,
      answerStatus,
      selectedOption,
      answerMessage,
      selectedAnswer,
      goBack,
      congratMessage,
    }
  },
}
</script>

<style scoped></style>
