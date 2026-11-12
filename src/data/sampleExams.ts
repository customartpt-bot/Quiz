import { Exam } from '../types/exam';
import { SAPROG_EXAM } from './saprogExam';
import { getRandomEspacialExam, ALL_ESPACIAL_QUESTIONS } from './espacialExam';

export { getRandomEspacialExam, ALL_ESPACIAL_QUESTIONS };

export const SAMPLE_EXAMS: Exam[] = [
  SAPROG_EXAM,
  getRandomEspacialExam(),
];
