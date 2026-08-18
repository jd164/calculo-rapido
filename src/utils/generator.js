// Mathematical Problem Generator & Smart Distractor Engine

/**
 * Random integer between min and max inclusive
 */
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick random item from array
 */
export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Shuffle array (Fisher-Yates)
 */
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates smart, mathematically plausible distractors for multiple choice
 */
export function generateDistractors(correctAnswer, context = {}) {
  const { num1, num2, num3, op, op2, table } = context;
  const distractors = new Set();
  const correct = Number(correctAnswer);

  // Strategy 1: Common carry/borrow off-by-ten mistakes
  if (Math.abs(correct) >= 10) {
    distractors.add(correct + 10);
    distractors.add(correct - 10);
  }
  if (Math.abs(correct) >= 100) {
    distractors.add(correct + 100);
    distractors.add(correct - 100);
  }

  // Strategy 2: Off-by-one, off-by-two (arithmetic slips)
  distractors.add(correct + 1);
  distractors.add(correct - 1);
  distractors.add(correct + 2);
  distractors.add(correct - 2);

  // Strategy 3: Digit flip (e.g. 54 -> 45)
  if (correct >= 10 && correct <= 99) {
    const tens = Math.floor(correct / 10);
    const units = correct % 10;
    if (tens !== units && units !== 0) {
      distractors.add(units * 10 + tens);
    }
  }

  // Strategy 4: Operation sign confusion
  if (num1 !== undefined && num2 !== undefined) {
    if (op === '+') {
      const swapped = num1 - num2;
      if (swapped !== correct && swapped > 0) distractors.add(swapped);
      distractors.add(correct + (num2 % 10 === 0 ? 5 : -5));
    } else if (op === '-') {
      distractors.add(num1 + num2);
    } else if (op === '×') {
      // Neighbour multiplication table (e.g., 7x8 -> 7x7=49 or 7x9=63)
      if (num1) distractors.add(correct + num1);
      if (num1 && correct - num1 > 0) distractors.add(correct - num1);
      if (num2) distractors.add(correct + num2);
      if (num2 && correct - num2 > 0) distractors.add(correct - num2);
      // Addition confusion instead of multiplication (e.g. 6x7 -> 13)
      distractors.add(num1 + num2);
    } else if (op === '÷') {
      distractors.add(correct + 1);
      distractors.add(correct + 2);
      if (correct > 1) distractors.add(correct - 1);
      if (correct > 2) distractors.add(correct - 2);
    }
  }

  // Strategy 5: Times table specific neighbours
  if (table) {
    distractors.add(correct + table);
    if (correct - table > 0) distractors.add(correct - table);
    distractors.add(correct + (table * 2));
  }

  // Clean candidates: must not be equal to correct answer
  const validDistractors = Array.from(distractors)
    .filter(val => typeof val === 'number' && !isNaN(val) && val !== correct && (correct >= 0 ? val >= 0 : true));

  // Pick 3 closest / most plausible
  // Sort by plausible distance (prefer close distractors)
  validDistractors.sort((a, b) => Math.abs(a - correct) - Math.abs(b - correct));

  const chosen = [];
  for (const d of validDistractors) {
    if (chosen.length < 3) {
      chosen.push(d);
    }
  }

  // Fallback if not enough
  let offset = 3;
  while (chosen.length < 3) {
    const candidate = correct + offset;
    if (candidate !== correct && !chosen.includes(candidate) && candidate >= 0) {
      chosen.push(candidate);
    }
    offset = offset > 0 ? -offset : -offset + 1;
  }

  return shuffle([correct, ...chosen]);
}

/**
 * Generate a single question based on configuration
 */
export function generateQuestion(config) {
  const { operation, difficulty, selectedTables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } = config;

  let activeOp = operation;
  if (operation === 'mixed') {
    activeOp = pickRandom(['addition', 'subtraction', 'multiplication', 'division']);
  }

  let questionData = null;

  switch (activeOp) {
    case 'times_tables':
      questionData = generateTimesTableQuestion(selectedTables, difficulty);
      break;
    case 'addition':
      questionData = generateAdditionQuestion(difficulty);
      break;
    case 'subtraction':
      questionData = generateSubtractionQuestion(difficulty);
      break;
    case 'multiplication':
      questionData = generateMultiplicationQuestion(difficulty);
      break;
    case 'division':
      questionData = generateDivisionQuestion(difficulty);
      break;
    default:
      questionData = generateAdditionQuestion(difficulty);
  }

  // Multiple choice options
  const options = generateDistractors(questionData.answer, questionData.context);

  return {
    id: 'q_' + Math.random().toString(36).substr(2, 9),
    ...questionData,
    options,
    type: config.responseType || 'input', // 'input' or 'multiple_choice'
  };
}

/**
 * Generate Tabuada Question
 */
function generateTimesTableQuestion(selectedTables, difficulty) {
  const tableList = selectedTables && selectedTables.length > 0 ? selectedTables : [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const table = pickRandom(tableList);
  
  let multiplier;
  if (difficulty === 'easy') {
    multiplier = randInt(1, 6);
  } else if (difficulty === 'medium') {
    multiplier = randInt(2, 10);
  } else {
    multiplier = randInt(4, 12);
  }

  // 50% chance of table x multiplier vs multiplier x table for varied recall
  const flip = Math.random() > 0.5;
  const num1 = flip ? table : multiplier;
  const num2 = flip ? multiplier : table;
  const answer = num1 * num2;

  return {
    expression: `${num1} × ${num2}`,
    answer,
    operationCategory: 'times_tables',
    tableNumber: table,
    context: { num1, num2, op: '×', table }
  };
}

/**
 * Generate Addition Question
 */
function generateAdditionQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Easy: Round numbers or small sums up to 100
    const mode = pickRandom(['round_tens', 'small_numbers']);
    if (mode === 'round_tens') {
      const num1 = randInt(1, 8) * 10;
      const num2 = randInt(1, 9 - num1 / 10) * 10;
      return {
        expression: `${num1} + ${num2}`,
        answer: num1 + num2,
        operationCategory: 'addition',
        context: { num1, num2, op: '+' }
      };
    } else {
      const num1 = randInt(3, 20);
      const num2 = randInt(2, 15);
      return {
        expression: `${num1} + ${num2}`,
        answer: num1 + num2,
        operationCategory: 'addition',
        context: { num1, num2, op: '+' }
      };
    }
  }

  if (difficulty === 'medium') {
    // Medium: 2-digit numbers with carries
    const num1 = randInt(14, 89);
    const num2 = randInt(12, 89);
    return {
      expression: `${num1} + ${num2}`,
      answer: num1 + num2,
      operationCategory: 'addition',
      context: { num1, num2, op: '+' }
    };
  }

  // Hard: 3 terms or 3-digit numbers
  const isThreeTerms = Math.random() > 0.45;
  if (isThreeTerms) {
    const num1 = randInt(15, 65);
    const num2 = randInt(12, 55);
    const num3 = randInt(10, 45);
    return {
      expression: `${num1} + ${num2} + ${num3}`,
      answer: num1 + num2 + num3,
      operationCategory: 'addition',
      context: { num1, num2, num3, op: '+' }
    };
  } else {
    const num1 = randInt(120, 580);
    const num2 = randInt(95, 450);
    return {
      expression: `${num1} + ${num2}`,
      answer: num1 + num2,
      operationCategory: 'addition',
      context: { num1, num2, op: '+' }
    };
  }
}

/**
 * Generate Subtraction Question
 */
function generateSubtractionQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Easy: Multiples of 10 or simple 2-digit minus 1-digit
    const mode = pickRandom(['round_tens', 'simple']);
    if (mode === 'round_tens') {
      const num1 = randInt(3, 10) * 10;
      const num2 = randInt(1, num1 / 10 - 1) * 10;
      return {
        expression: `${num1} − ${num2}`,
        answer: num1 - num2,
        operationCategory: 'subtraction',
        context: { num1, num2, op: '-' }
      };
    } else {
      const num1 = randInt(10, 30);
      const num2 = randInt(2, 9);
      return {
        expression: `${num1} − ${num2}`,
        answer: num1 - num2,
        operationCategory: 'subtraction',
        context: { num1, num2, op: '-' }
      };
    }
  }

  if (difficulty === 'medium') {
    // Medium: 2-digit subtraction with borrow
    const num1 = randInt(35, 99);
    const num2 = randInt(14, num1 - 5);
    return {
      expression: `${num1} − ${num2}`,
      answer: num1 - num2,
      operationCategory: 'subtraction',
      context: { num1, num2, op: '-' }
    };
  }

  // Hard: 3 terms or 3-digit subtraction
  const isThreeTerms = Math.random() > 0.45;
  if (isThreeTerms) {
    const num1 = randInt(70, 150);
    const num2 = randInt(15, 45);
    const num3 = randInt(10, num1 - num2 - 5);
    return {
      expression: `${num1} − ${num2} − ${num3}`,
      answer: num1 - num2 - num3,
      operationCategory: 'subtraction',
      context: { num1, num2, num3, op: '-' }
    };
  } else {
    const num1 = randInt(250, 890);
    const num2 = randInt(110, num1 - 20);
    return {
      expression: `${num1} − ${num2}`,
      answer: num1 - num2,
      operationCategory: 'subtraction',
      context: { num1, num2, op: '-' }
    };
  }
}

/**
 * Generate Multiplication Question
 */
function generateMultiplicationQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Easy: Small tables up to 5x5 or round tens (e.g. 20 x 4)
    const mode = pickRandom(['small', 'round']);
    if (mode === 'round') {
      const num1 = randInt(1, 6) * 10;
      const num2 = randInt(2, 5);
      return {
        expression: `${num1} × ${num2}`,
        answer: num1 * num2,
        operationCategory: 'multiplication',
        context: { num1, num2, op: '×' }
      };
    } else {
      const num1 = randInt(2, 5);
      const num2 = randInt(2, 6);
      return {
        expression: `${num1} × ${num2}`,
        answer: num1 * num2,
        operationCategory: 'multiplication',
        context: { num1, num2, op: '×' }
      };
    }
  }

  if (difficulty === 'medium') {
    // Medium: 2-digit by 1-digit (e.g. 14 x 7, 23 x 4, 35 x 3)
    const num1 = randInt(12, 45);
    const num2 = randInt(3, 9);
    return {
      expression: `${num1} × ${num2}`,
      answer: num1 * num2,
      operationCategory: 'multiplication',
      context: { num1, num2, op: '×' }
    };
  }

  // Hard: 2-digit x 2-digit or 3-term (e.g. 15 x 3 + 20)
  const isThreeTerms = Math.random() > 0.45;
  if (isThreeTerms) {
    const num1 = randInt(6, 15);
    const num2 = randInt(3, 8);
    const num3 = randInt(10, 50);
    const addOrSub = Math.random() > 0.4;
    if (addOrSub) {
      return {
        expression: `${num1} × ${num2} + ${num3}`,
        answer: (num1 * num2) + num3,
        operationCategory: 'multiplication',
        context: { num1, num2, num3, op: '×', op2: '+' }
      };
    } else {
      return {
        expression: `${num1} × ${num2} − ${Math.min(num3, num1 * num2 - 5)}`,
        answer: (num1 * num2) - Math.min(num3, num1 * num2 - 5),
        operationCategory: 'multiplication',
        context: { num1, num2, op: '×', op2: '-' }
      };
    }
  } else {
    const num1 = randInt(13, 35);
    const num2 = randInt(11, 25);
    return {
      expression: `${num1} × ${num2}`,
      answer: num1 * num2,
      operationCategory: 'multiplication',
      context: { num1, num2, op: '×' }
    };
  }
}

/**
 * Generate Division Question
 */
function generateDivisionQuestion(difficulty) {
  if (difficulty === 'easy') {
    // Easy: exact simple divisions (e.g. 20 ÷ 4 = 5, 36 ÷ 6 = 6)
    const divisor = randInt(2, 6);
    const quotient = randInt(2, 9);
    const dividend = divisor * quotient;
    return {
      expression: `${dividend} ÷ ${divisor}`,
      answer: quotient,
      operationCategory: 'division',
      context: { num1: dividend, num2: divisor, op: '÷' }
    };
  }

  if (difficulty === 'medium') {
    // Medium: 2-digit quotient or larger numbers (e.g. 96 ÷ 8 = 12, 144 ÷ 12 = 12, 84 ÷ 6 = 14)
    const divisor = randInt(4, 12);
    const quotient = randInt(7, 24);
    const dividend = divisor * quotient;
    return {
      expression: `${dividend} ÷ ${divisor}`,
      answer: quotient,
      operationCategory: 'division',
      context: { num1: dividend, num2: divisor, op: '÷' }
    };
  }

  // Hard: 3-digit dividends with larger divisors or 3-term operations
  const isThreeTerms = Math.random() > 0.4;
  if (isThreeTerms) {
    const divisor = randInt(3, 9);
    const quotient = randInt(6, 18);
    const dividend = divisor * quotient;
    const num3 = randInt(5, 35);
    return {
      expression: `(${dividend} ÷ ${divisor}) + ${num3}`,
      answer: quotient + num3,
      operationCategory: 'division',
      context: { num1: dividend, num2: divisor, num3, op: '÷', op2: '+' }
    };
  } else {
    const divisor = randInt(6, 18);
    const quotient = randInt(12, 45);
    const dividend = divisor * quotient;
    return {
      expression: `${dividend} ÷ ${divisor}`,
      answer: quotient,
      operationCategory: 'division',
      context: { num1: dividend, num2: divisor, op: '÷' }
    };
  }
}
