import { ref } from "vue";

interface MatchingItem {
  id: string;
  text: string;
  originalText: string;
  matched: boolean;
}

export const items = ref<MatchingItem[]>([
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
