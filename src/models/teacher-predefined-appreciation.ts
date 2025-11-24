export type TeacherPredefinedAppreciationItem = Readonly<{
  id: number;
  code: string;
  label: string;
  type: string;
  authorId: number;
}>;

export type TeacherPredefinedAppreciations = Readonly<{
  appreciations: TeacherPredefinedAppreciationItem[];
  maxCharacters: number;
}>;

