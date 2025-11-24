import { decode as decodeBase64 } from "js-base64";
import type {
  Period,
  PeriodSubjectPerformance,
  PeriodSubjectsSummary,
  PeriodWithSubjects
} from "~/models";

const toDate = (value: string | undefined | null): Date | undefined => {
  if (!value || String(value).trim() === "") return undefined;
  return new Date(value);
};

const decodeAppreciationText = (value?: string | null): string => {
  if (!value) return "";
  try {
    return decodeBase64(value);
  } catch {
    return value;
  }
};

const decodePeriodSubject = (subject: any): PeriodSubjectPerformance => ({
  id: Number(subject?.id ?? 0),
  subjectCode: subject?.codeMatiere ?? "",
  subSubjectCode: subject?.codeSousMatiere ?? "",
  name: subject?.discipline ?? "",
  studentAverage: subject?.moyenne ?? undefined,
  classAverage: subject?.moyenneClasse ?? undefined,
  minAverage: subject?.moyenneMin ?? undefined,
  maxAverage: subject?.moyenneMax ?? undefined,
  coefficient: Number(subject?.coef ?? 0),
  studentCount: Number(subject?.effectif ?? 0) || undefined,
  rank: Number(subject?.rang ?? 0) || undefined,
  isGroup: Boolean(subject?.groupeMatiere),
  groupId: Number(subject?.idGroupeMatiere ?? 0) || undefined,
  isOption: Boolean(subject?.option),
  isSubSubject: Boolean(subject?.sousMatiere),
  requiresSubSubjectAppreciation: Boolean(subject?.saisieAppreciationSSMat),
  classAppreciation: decodeAppreciationText(subject?.appreciationClasse ?? undefined),
  teachers: Array.isArray(subject?.professeurs)
    ? subject.professeurs.map((teacher: any) => ({
        id: Number(teacher?.id ?? 0),
        name: teacher?.nom ?? ""
      }))
    : [],
  appreciations: Array.isArray(subject?.appreciations)
    ? subject.appreciations
        .filter((entry: any) => typeof entry === "string" && entry.trim() !== "")
        .map((entry: string) => decodeAppreciationText(entry))
    : []
});

const decodeSubjectsSummary = (source: any): PeriodSubjectsSummary => {
  if (!source) {
    return { subjects: [], simulatedSubjects: [] } as PeriodSubjectsSummary;
  }

  return {
    calculatedAt: source?.dateCalcul ?? undefined,
    studentAverage: source?.moyenneGenerale ?? undefined,
    classAverage: source?.moyenneClasse ?? undefined,
    minAverage: source?.moyenneMin ?? undefined,
    maxAverage: source?.moyenneMax ?? undefined,
    principalTeacherName: source?.nomPP ?? undefined,
    principalTeacherAppreciation: source?.appreciationPP ?? undefined,
    headTeacherName: source?.nomCE ?? undefined,
    headTeacherAppreciation: source?.appreciationCE ?? undefined,
    nationalEducationAppreciation: source?.appreciationCN ?? undefined,
    vicePrincipalAppreciation: source?.appreciationVS ?? undefined,
    decision: source?.decisionDuConseil ?? undefined,
    rank: Number(source?.rang ?? 0) || undefined,
    studentCount: Number(source?.effectif ?? 0) || undefined,
    classAppreciation: source?.appreciationGeneraleClasse ?? undefined,
    subjects: Array.isArray(source?.disciplines)
      ? source.disciplines.map(decodePeriodSubject)
      : [],
    simulatedSubjects: Array.isArray(source?.disciplinesSimulation)
      ? source.disciplinesSimulation
      : []
  };
};

const buildBasePeriod = (item: any): Period => ({
  id: item.idPeriode,
  name: item.periode,
  yearly: Boolean(item.annuel),
  isMockExam: Boolean(item.examenBlanc),
  isEnded: Boolean(item.cloture),
  startDate: new Date(item.dateDebut),
  endDate: new Date(item.dateFin),
  councilDate: toDate(item.dateConseil),
  councilStartHour: item.heureConseil ?? undefined,
  councilEndHour: item.heureFinConseil ?? undefined,
  councilClassroom: item.salleConseil ?? undefined
});

export const decodePeriod = (item: any): Period => {
  const base = buildBasePeriod(item);
  if (!item?.ensembleMatieres) return base;
  return {
    ...base,
    subjectsSummary: decodeSubjectsSummary(item.ensembleMatieres)
  };
};

export const decodePeriodWithSubjects = (item: any): PeriodWithSubjects => ({
  ...buildBasePeriod(item),
  subjectsSummary: decodeSubjectsSummary(item.ensembleMatieres)
});
