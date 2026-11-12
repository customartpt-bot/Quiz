export interface ExamOption {
  key: string; // e.g. "a", "b", "c", "d"
  text: string; // ipsis verbis
}

export interface Question {
  id: string;
  number: number;
  text: string; // Enunciado ipsis verbis
  options: ExamOption[];
  correctOptionKeys?: string[]; // Suporta 1, 2 ou mais respostas corretas (ex: ['c', 'd'])
  correctOptionKey?: string; // Para compatibilidade com single choice
  explanation: string; // Justificação didática / critérios de correção
  points?: number; // Cotação total da questão (em valores)
  multiSelect?: boolean; // Se true, o aluno pode assinalar mais do que uma hipótese
}

export interface DisciplineConfig {
  id: string;
  name: string;
  facultyName?: string;
  totalScale: number; // Por padrão 20 valores (sistema universitário português)
  penaltyMode: 'fraction' | 'fixed' | 'none'; // 'fraction' (ex: -1/4 do valor da questão), 'fixed' (ex: -0.25 val), 'none' (0)
  penaltyFraction: number; // ex: 0.25 (1/4 errada desconta 25% da cotação da questão)
  penaltyFixedValue: number; // ex: 0.25 valores fixos por errada
  blankPenalty: number; // 0
  passingGrade: number; // ex: 9.5 ou 10.0 valores
  description?: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  year?: string;
  institution?: string;
  instructions?: string;
  questions: Question[];
  disciplineConfigId?: string;
  createdAt?: string;
  sourceType?: 'pdf' | 'sample' | 'manual';
}

export interface QuestionAnswerState {
  questionId: string;
  selectedOptionKeys: string[]; // Chaves selecionadas pelo aluno (ex: ['c', 'd'])
  selectedOptionKey?: string | null;
  isConfirmed: boolean; // Indica se o aluno confirmou/submeteu a escolha
  isAnswered: boolean;
  isCorrect: boolean | null;
  earnedPoints: number;
  partialCorrectCount?: number;
}

export interface SimulationSummary {
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  partialCount: number; // Questões parcialmente certas em escolhas múltiplas com várias corretas
  blankCount: number;
  pointsEarned: number; // soma de acertos
  pointsPenalized: number; // soma de penalizações
  finalGrade: number; // nota final limitada entre 0 e totalScale
  totalScale: number;
  passingGrade: number;
  passed: boolean;
  percentage: number;
  disciplineConfig: DisciplineConfig;
}
