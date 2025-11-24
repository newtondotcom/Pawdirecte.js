export type PeriodSubjectTeacher = Readonly<{
  id: number;
  name: string;
}>;

export type PeriodSubjectPerformance = Readonly<{
  id: number;
  subjectCode: string;
  subSubjectCode: string;
  name: string;
  studentAverage?: string;
  classAverage?: string;
  minAverage?: string;
  maxAverage?: string;
  coefficient: number;
  studentCount?: number;
  rank?: number;
  isGroup: boolean;
  groupId?: number;
  isOption: boolean;
  isSubSubject: boolean;
  requiresSubSubjectAppreciation?: boolean;
  classAppreciation?: string;
  teachers: PeriodSubjectTeacher[];
  appreciations: string[];
}>;

export type PeriodSubjectsSummary = Readonly<{
  calculatedAt?: string;
  studentAverage?: string;
  classAverage?: string;
  minAverage?: string;
  maxAverage?: string;
  principalTeacherName?: string;
  principalTeacherAppreciation?: string;
  headTeacherName?: string;
  headTeacherAppreciation?: string;
  nationalEducationAppreciation?: string;
  vicePrincipalAppreciation?: string;
  decision?: string;
  rank?: number;
  studentCount?: number;
  classAppreciation?: string;
  subjects: PeriodSubjectPerformance[];
  simulatedSubjects?: ReadonlyArray<unknown>;
}>;

export type Period = Readonly<{
  id: string;
  name: string;
  yearly: boolean;
  isMockExam: boolean;
  isEnded: boolean;
  startDate: Date;
  endDate: Date;
  councilDate?: Date;
  councilStartHour?: string;
  councilEndHour?: string;
  councilClassroom?: string;
  subjectsSummary?: PeriodSubjectsSummary;
}>;

export type PeriodWithSubjects = Period & {
  subjectsSummary: PeriodSubjectsSummary;
};
