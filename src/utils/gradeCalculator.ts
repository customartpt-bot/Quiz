import { Exam, DisciplineConfig, Question, QuestionAnswerState, SimulationSummary } from '../types/exam';

export function getQuestionValue(question: Question, exam: Exam, config: DisciplineConfig): number {
  if (typeof question.points === 'number' && question.points > 0) {
    return question.points;
  }
  const totalQuestions = Math.max(exam.questions.length, 1);
  return Number((config.totalScale / totalQuestions).toFixed(2));
}

export function getPenaltyValue(unitValue: number, config: DisciplineConfig): number {
  if (config.penaltyMode === 'none') {
    return 0;
  }
  if (config.penaltyMode === 'fraction') {
    return Number((unitValue * (config.penaltyFraction || 0.25)).toFixed(3));
  }
  if (config.penaltyMode === 'fixed') {
    return Number((config.penaltyFixedValue || 0.25).toFixed(3));
  }
  return 0;
}

export function getQuestionCorrectKeys(question: Question): string[] {
  if (Array.isArray(question.correctOptionKeys) && question.correctOptionKeys.length > 0) {
    return question.correctOptionKeys.map((k) => k.trim().toLowerCase());
  }
  if (question.correctOptionKey) {
    return [question.correctOptionKey.trim().toLowerCase()];
  }
  return ['a'];
}

export function calculateQuestionScore(
  question: Question,
  selectedKeys: string[],
  exam: Exam,
  config: DisciplineConfig
): {
  earnedPoints: number;
  penalties: number;
  netScore: number;
  isFullyCorrect: boolean;
  isPartiallyCorrect: boolean;
  correctSelected: string[];
  wrongSelected: string[];
  missedCorrect: string[];
  valuePerCorrectOption: number;
} {
  const qTotalValue = getQuestionValue(question, exam, config);
  const correctKeys = getQuestionCorrectKeys(question);
  const numCorrectNeeded = Math.max(correctKeys.length, 1);
  const valuePerCorrectOption = Number((qTotalValue / numCorrectNeeded).toFixed(3));
  const penaltyPerWrong = getPenaltyValue(valuePerCorrectOption, config);

  const normalizedSelected = selectedKeys.map((k) => k.trim().toLowerCase());

  const correctSelected = normalizedSelected.filter((k) => correctKeys.includes(k));
  const wrongSelected = normalizedSelected.filter((k) => !correctKeys.includes(k));
  const missedCorrect = correctKeys.filter((k) => !normalizedSelected.includes(k));

  const earnedPoints = Number((correctSelected.length * valuePerCorrectOption).toFixed(3));
  const penalties = Number((wrongSelected.length * penaltyPerWrong).toFixed(3));
  const netScore = Math.max(0, Number((earnedPoints - penalties).toFixed(3)));

  const isFullyCorrect =
    correctSelected.length === correctKeys.length && wrongSelected.length === 0;
  const isPartiallyCorrect =
    !isFullyCorrect && correctSelected.length > 0 && earnedPoints > penalties;

  return {
    earnedPoints,
    penalties,
    netScore,
    isFullyCorrect,
    isPartiallyCorrect,
    correctSelected,
    wrongSelected,
    missedCorrect,
    valuePerCorrectOption,
  };
}

export function calculateSimulationScore(
  exam: Exam,
  answers: Record<string, QuestionAnswerState>,
  config: DisciplineConfig
): SimulationSummary {
  let pointsEarned = 0;
  let pointsPenalized = 0;
  let correctCount = 0;
  let partialCount = 0;
  let wrongCount = 0;
  let blankCount = 0;
  let answeredCount = 0;

  exam.questions.forEach((q) => {
    const ans = answers[q.id];
    const selectedKeys = ans?.selectedOptionKeys || (ans?.selectedOptionKey ? [ans.selectedOptionKey] : []);

    if (!ans || !ans.isAnswered || selectedKeys.length === 0) {
      blankCount++;
    } else {
      answeredCount++;
      const breakdown = calculateQuestionScore(q, selectedKeys, exam, config);
      pointsEarned += breakdown.earnedPoints;
      pointsPenalized += breakdown.penalties;

      if (breakdown.isFullyCorrect) {
        correctCount++;
      } else if (breakdown.isPartiallyCorrect) {
        partialCount++;
      } else {
        wrongCount++;
      }
    }
  });

  const rawScore = pointsEarned - pointsPenalized;
  const finalGrade = Math.max(0, Math.min(config.totalScale, Number(rawScore.toFixed(2))));
  const passed = finalGrade >= config.passingGrade;
  const percentage = config.totalScale > 0 ? Math.round((finalGrade / config.totalScale) * 100) : 0;

  return {
    totalQuestions: exam.questions.length,
    answeredCount,
    correctCount,
    partialCount,
    wrongCount,
    blankCount,
    pointsEarned: Number(pointsEarned.toFixed(2)),
    pointsPenalized: Number(pointsPenalized.toFixed(2)),
    finalGrade,
    totalScale: config.totalScale,
    passingGrade: config.passingGrade,
    passed,
    percentage,
    disciplineConfig: config,
  };
}
