export type TeacherClassCouncilAppreciation = Readonly<{
  id: string;
  code: string;
  label: string;
  date: Date | null;
  text: string;
}>;

export type TeacherClassCouncilMention = Readonly<{
  id: number;
  label: string;
  line: number;
}>;

export type TeacherClassCouncilAppreciationSetting = Readonly<{
  id: number;
  code: string;
  label: string;
  maxCharacters: number;
}>;

export type TeacherClassCouncilStudent = Readonly<{
  id: number;
  firstName: string;
  lastName: string;
  particle: string;
  gender: "M" | "F";
  arrivalOrder: string;
  photoURL: string;
  tags: Array<Record<string, unknown>>;
  appreciationPrincipalTeacher: TeacherClassCouncilAppreciation;
  appreciationHeadTeacher: TeacherClassCouncilAppreciation;
  appreciationVicePrincipal: TeacherClassCouncilAppreciation;
  appreciationNationalEducation: TeacherClassCouncilAppreciation;
  councilMention: TeacherClassCouncilAppreciation;
}>;

export type TeacherClassCouncilSettings = Readonly<{
  allowPrincipalTeacherToEditVicePrincipal: boolean;
  allowPrincipalTeacherToEditAll: boolean;
  enableClassAppreciation: boolean;
  principalTeacherMaxLength: number;
  mentions: TeacherClassCouncilMention[];
  appreciations: TeacherClassCouncilAppreciationSetting[];
}>;

export type TeacherClassCouncil = Readonly<{
  students: TeacherClassCouncilStudent[];
  settings: TeacherClassCouncilSettings;
  classAppreciation: TeacherClassCouncilAppreciation;
}>;

