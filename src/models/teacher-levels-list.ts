export type TeacherLevelsListSubject = Readonly<{
  id: string;
  label: string;
  shortLabel: string;
  code: string;
  coefficient: number;
  childSubjectCode: string;
  managementCode: string;
  hasChildSubjects: boolean;
  computeChildSubject: boolean;
  editable: string;
  kind: string;
  allowChildSubjectAppreciation: boolean;
  hasGrades: boolean;
  lsunEvaluation: boolean;
  cycleSubjectId: number;
}>;

export type TeacherLevelsListPeriod = Readonly<{
  id: number;
  code: string;
  period: number;
  subPeriod: number;
  coefficient: number;
  label: string;
  shortLabel: string;
  status: string;
  allowAppreciation: boolean;
  allowClassAppreciation: boolean;
  startDate: Date | null;
  endDate: Date | null;
  councilDate: Date | null;
  councilHour: string;
  councilRoom: string;
  subjects: TeacherLevelsListSubject[];
}>;

export type TeacherLevelsListClass = Readonly<{
  id: number;
  label: string;
  code: string;
  groupId: number;
  isPrincipalTeacher: boolean;
  graded: boolean;
  lsunPositioning: number;
  degree: number;
  cycleId: number;
  periodCount: number;
  showAnnualAverage: boolean;
  showYearAverage: boolean;
  showPeriodAverage: boolean;
  showSubjectAverage: boolean;
  principalTeachers: Array<{
    id: number;
    firstName: string;
    lastName: string;
    kind: string;
  }>;
  periods: TeacherLevelsListPeriod[];
}>;

export type TeacherLevelsListLevel = Readonly<{
  id: number;
  code: string;
  label: string;
  classes: TeacherLevelsListClass[];
}>;

export type TeacherLevelsListSchool = Readonly<{
  id: number;
  code: string;
  label: string;
  rne: string;
  degree: number;
  requireSubjectType: boolean;
  isCoefficientEditable: boolean;
  isBoundEditable: boolean;
  minGrade: number;
  maxGrade: number;
  averageOutOf: number;
  allowLetterGrades: boolean;
  levels: TeacherLevelsListLevel[];
}>;

export type TeacherLevelsListCycleParams = Readonly<{
  cycleId: number;
  evaluationColor1: string;
  evaluationColor2: string;
  evaluationColor3: string;
  evaluationColor4: string;
  evaluationLabel1: string;
  evaluationLabel2: string;
  evaluationLabel3: string;
  evaluationLabel4: string;
  emoji1: string;
  emoji2: string;
  emoji3: string;
  emoji4: string;
  maxCharacters: number;
  freeInputEnabled: boolean;
  printedProgramItems: number;
  printedSubSubjectProgramItems: number;
  cycleLabel: string;
  cycleNumber: number;
}>;

export type TeacherLevelsListGridSlot = Readonly<{
  startAt: string;
  endAt: string;
}>;

export type TeacherLevelsListParameters = Readonly<{
  visioEnabled: boolean;
  attendanceUsesTimetable: boolean;
  attendanceUsesSchedule: boolean;
  grid: TeacherLevelsListGridSlot[];
}>;

export type TeacherLevelsList = Readonly<{
  groups: any[];
  otherGroups: any[];
  schools: TeacherLevelsListSchool[];
  cycles: TeacherLevelsListCycleParams[];
  parameters: TeacherLevelsListParameters;
}>;

