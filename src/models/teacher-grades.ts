import type { Grade } from "~/models/grade";
import type { GradesOverview } from "~/models/grades-overview";
import type { Period } from "~/models/period";

export type TeacherLSUNEntry = Readonly<{
  subjectCode: string;
  subjectLabel: string;
  subSubjectCode?: string;
  subSubjectLabel?: string;
  isFirstSubject: boolean;
  isFirstSubSubject: boolean;
  subjectElementCount: number;
  subSubjectElementCount: number;
  description: string;
  elementId: number;
  value: string;
  afc: number;
  competencyId: number;
  knowledgeId: number;
  requiresValidation: boolean;
  professors: Array<{
    id: number;
    name: string;
  }>;
}>;

export type TeacherLSUNMap = Record<string, Array<TeacherLSUNEntry>>;

export type TeacherGradesSettings = Readonly<{
  evaluationColors: string[];
  evaluationLabels: string[];
  evaluationComponentLabels: string[];
  showStudentAverage: boolean;
  showPeriodAverage: boolean;
  showNotes: boolean;
  showCompetencies: boolean;
  showTeacherAppreciations: boolean;
  showPrincipalTeacherAppreciation: boolean;
  showHeadOfSchoolAppreciation: boolean;
  showVicePrincipalAppreciation: boolean;
  showClassAppreciation: boolean;
  showMentions: boolean;
}>;

export type TeacherGradesResponse = Readonly<{
  studentId: number;
  statsCode: string;
  periods: Period[];
  grades: Grade[];
  overview: GradesOverview;
  lsun: TeacherLSUNMap;
  settings: TeacherGradesSettings;
}>;

