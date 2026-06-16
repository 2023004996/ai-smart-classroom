import prisma from '../config/db.js';
import { calculateCategory } from '../services/categorizationService.js';

const warmupQuestions = [
  {
    question: 'Choose the correct past tense form: "She ____ to the store yesterday."',
    options: ['go', 'went', 'gone', 'going'],
    correctAnswer: 'went'
  },
  {
    question: 'Select the synonym of "rapid".',
    options: ['slow', 'quick', 'small', 'dull'],
    correctAnswer: 'quick'
  },
  {
    question: 'Which word completes the sentence: "He is the ____ student in the class."',
    options: ['smartest', 'smarter', 'most smart', 'smart'],
    correctAnswer: 'smartest'
  },
  {
    question: 'Pick the correct article: "I saw ____ elephant at the zoo."',
    options: ['a', 'an', 'the', 'no article'],
    correctAnswer: 'an'
  },
  {
    question: 'Choose the correct preposition: "She is interested ____ learning."',
    options: ['on', 'in', 'at', 'for'],
    correctAnswer: 'in'
  },
  {
    question: 'Find the antonym of "ancient".',
    options: ['old', 'modern', 'historic', 'aged'],
    correctAnswer: 'modern'
  },
  {
    question: 'Read the sentence: "Tom baked a cake, and he decorated it." What is the conjunction?',
    options: ['and', 'baked', 'decorated', 'it'],
    correctAnswer: 'and'
  },
  {
    question: 'Choose the correct plural form of "child".',
    options: ['childs', 'childes', 'children', 'childrens'],
    correctAnswer: 'children'
  },
  {
    question: 'Vocabulary: What does "benevolent" mean?',
    options: ['kind', 'angry', 'wealthy', 'small'],
    correctAnswer: 'kind'
  },
  {
    question: 'Reading comprehension: If the author is biased, the text is likely to be _____.',
    options: ['neutral', 'one-sided', 'balanced', 'uncertain'],
    correctAnswer: 'one-sided'
  }
];

export const getWarmupQuiz = async (req, res, next) => {
  try {
    // Return hardcoded questions and duration (seconds)
    res.json({ questions: warmupQuestions, duration: 600 });
  } catch (error) {
    next(error);
  }
};

export const submitWarmupQuiz = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers must be an array.' });
    }

    // Prevent mismatched length
    const length = Math.min(answers.length, warmupQuestions.length);
    let correct = 0;
    for (let i = 0; i < length; i++) {
      if (!answers[i]) continue;
      if (String(answers[i]).trim() === String(warmupQuestions[i].correctAnswer).trim()) {
        correct += 1;
      }
    }

    const score = correct * 10; // each question 10 marks

    // calculate category
    const category = calculateCategory(score);

    // update student performance and category
    await prisma.student.update({
      where: { id: studentId },
      data: {
        performanceScore: score,
        category
      }
    });

    // find or create a Warmup Quiz record to attach the result
    let quiz = await prisma.quiz.findFirst({ where: { title: 'Warmup Quiz' } });
    if (!quiz) {
      quiz = await prisma.quiz.create({ data: { title: 'Warmup Quiz', topic: 'Warmup', duration: 10 } });
    }

    // Save result
    await prisma.result.create({
      data: {
        studentId,
        quizId: quiz.id,
        score,
        completionTime: 0
      }
    });

    res.json({ score, category });
  } catch (error) {
    next(error);
  }
};
