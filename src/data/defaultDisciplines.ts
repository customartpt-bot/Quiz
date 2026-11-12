import { DisciplineConfig } from '../types/exam';

export const DEFAULT_DISCIPLINE_CONFIGS: DisciplineConfig[] = [
  {
    id: 'saprog-python',
    name: 'Programação Geoespacial (SAPROG)',
    facultyName: 'Universidade / SIG & Python',
    totalScale: 100,
    penaltyMode: 'none',
    penaltyFraction: 0,
    penaltyFixedValue: 0,
    blankPenalty: 0,
    passingGrade: 50.0,
    description: 'Cada pergunta vale 2.5 valores. Se tiver resposta múltipla, são 1.25 cada. Sem penalização por erradas. Escala de 0 a 100 pontos.',
  },
  {
    id: 'estatistica-espacial',
    name: 'Estatística Espacial',
    facultyName: 'Geografia & SIG',
    totalScale: 100,
    penaltyMode: 'none',
    penaltyFraction: 0,
    penaltyFixedValue: 0,
    blankPenalty: 0,
    passingGrade: 50.0,
    description: 'Quiz dinâmico de 30 questões (selecionadas aleatoriamente de um banco de 189). 3.33 valores cada certa. Sem desconto por erradas.',
  },
];
