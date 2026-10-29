import fs from 'node:fs';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

function loadQuestions() {
  try {
    const data = fs.readFileSync('question.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Ошибка при чтении файла question.json:', err.message);
    process.exit(1);
  }
}

const questions = loadQuestions();
let currentQuestionIndex = 0;
let correctAnswersCount = 0;

async function startQuiz() {
  console.log('========================================');
  console.log('Добро пожаловать в Квиз по Node.js!');
  console.log(
    'Вам нужно ответить на вопросы, вводя номер правильного варианта.',
  );
  console.log('========================================\n');

  while (currentQuestionIndex < questions.length) {
    const currentQuestion = questions[currentQuestionIndex];

    console.log(
      `Вопрос ${currentQuestionIndex + 1}: ${currentQuestion.question}`,
    );
    currentQuestion.options.forEach((option, index) => {
      console.log(`${index + 1}. ${option}`);
    });

    const answer = await rl.question('Ваш ответ: ');
    const answerNumber = parseInt(answer, 10);

    if (
      isNaN(answerNumber) ||
      answerNumber < 1 ||
      answerNumber > currentQuestion.options.length
    ) {
      console.log(
        'Некорректный ввод. Пожалуйста, введите номер варианта из списка.\n',
      );
      continue; // Пропускаем остаток цикла и задаем тот же вопрос снова
    }

    const selectedIndex = answerNumber - 1;

    if (selectedIndex === currentQuestion.correctIndex) {
      console.log('Правильный ответ!\n');
      correctAnswersCount++;
    } else {
      console.log('Неправильный ответ.\n');
    }

    currentQuestionIndex++;
  }

  console.log('========================================');
  console.log('Квиз завершен!');
  console.log(
    `Вы ответили правильно на ${correctAnswersCount} из ${questions.length} вопросов.`,
  );
  console.log('========================================');

  rl.close();
  process.exit(0);
}

startQuiz();
