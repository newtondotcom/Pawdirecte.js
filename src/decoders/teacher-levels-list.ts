import { decode as decodeBase64 } from "js-base64";
import type {
  TeacherLevelsList,
  TeacherLevelsListClass,
  TeacherLevelsListCycleParams,
  TeacherLevelsListLevel,
  TeacherLevelsListPeriod,
  TeacherLevelsListSchool,
  TeacherLevelsListSubject
} from "~/models";

const toDate = (value: string | undefined): Date | null => {
  if (!value || value.trim() === "") return null;
  return new Date(value);
};

const decodeSubject = (subject: any): TeacherLevelsListSubject => ({
  id: subject.id?.toString() ?? "",
  label: subject.libelle ?? "",
  shortLabel: subject.libelleCourt ?? "",
  code: subject.code ?? "",
  coefficient: Number(subject.coef ?? 0),
  childSubjectCode: subject.codeSSMatiere ?? "",
  managementCode: subject.codeGestion ?? "",
  hasChildSubjects: Boolean(subject.avecSousMatiere),
  computeChildSubject: Boolean(subject.calculSousMatiere),
  editable: subject.isEditable ?? "",
  kind: subject.type ?? "",
  allowChildSubjectAppreciation: Boolean(subject.saisieAppreciationSSMat),
  hasGrades: Boolean(subject.avecNotation),
  lsunEvaluation: Boolean(subject.evaluationLSUN),
  cycleSubjectId: Number(subject.idMatiereCycle ?? 0)
});

const decodePeriod = (period: any): TeacherLevelsListPeriod => ({
  id: Number(period.id ?? 0),
  code: period.codePeriode ?? "",
  period: Number(period.periode ?? 0),
  subPeriod: Number(period.sousPeriode ?? 0),
  coefficient: Number(period.coef ?? 0),
  label: period.libelle ?? "",
  shortLabel: period.libelleCourt ?? "",
  status: period.etat ?? "",
  allowAppreciation: Boolean(period.saisieAppreciation),
  allowClassAppreciation: Boolean(period.saisieAppreciationClasse),
  startDate: toDate(period.dateDebut),
  endDate: toDate(period.dateFin),
  councilDate: toDate(period.dateConseil),
  councilHour: period.heureConseil ?? "",
  councilRoom: period.salleConseil ?? "",
  subjects: Array.isArray(period.matieres)
    ? period.matieres.map(decodeSubject)
    : []
});

type PrincipalTeacher = {
  id: number;
  firstName: string;
  lastName: string;
  kind: string;
};

const decodeClass = (classe: any, currentTeacherId?: number): TeacherLevelsListClass => {
  const principalTeachers: PrincipalTeacher[] = Array.isArray(classe.tabPP)
    ? classe.tabPP.map((teacher: any): PrincipalTeacher => ({
        id: Number(teacher.id ?? 0),
        firstName: teacher.prenom ?? "",
        lastName: teacher.nom ?? "",
        kind: teacher.type ?? ""
      }))
    : [];

  const isCurrentUserPrincipal =
    typeof currentTeacherId === "number" &&
    principalTeachers.some((teacher) => teacher.id === currentTeacherId);

  return {
    id: Number(classe.id ?? 0),
    label: classe.libelle ?? "",
    code: classe.code ?? "",
    groupId: Number(classe.idGroupe ?? 0),
    isPrincipalTeacher: Boolean(classe.isPP),
    isCurrentUserPrincipal,
    graded: Boolean(classe.estNote),
    lsunPositioning: Number(classe.positionnementLSU ?? 0),
    degree: Number(classe.degre ?? 0),
    cycleId: Number(classe.idCycleEtab ?? 0),
    periodCount: Number(classe.pcpNbPeriode ?? 0),
    showAnnualAverage: Boolean(classe.pcpMoyAnnuelle),
    showYearAverage: Boolean(classe.pcpMoyGenAnnee),
    showPeriodAverage: Boolean(classe.pcpMoyPeriode),
    showSubjectAverage: Boolean(classe.pcpMoyMatiere),
    principalTeachers,
    periods: Array.isArray(classe.periodes)
      ? classe.periodes.map(decodePeriod)
      : []
  };
};

const decodeLevel = (level: any, currentTeacherId?: number): TeacherLevelsListLevel => ({
  id: Number(level.id ?? 0),
  code: level.code ?? "",
  label: level.libelle ?? "",
  classes: Array.isArray(level.classes)
    ? level.classes.map((classe: any) => decodeClass(classe, currentTeacherId))
    : []
});

const decodeSchool = (school: any, currentTeacherId?: number): TeacherLevelsListSchool => ({
  id: Number(school.id ?? 0),
  code: school.code ?? "",
  label: school.libelle ?? "",
  rne: school.rne ?? "",
  degree: Number(school.degre ?? 0),
  requireSubjectType: Boolean(school.isTypeDevoirObligatoire),
  isCoefficientEditable: Boolean(school.isCoefModifiable),
  isBoundEditable: Boolean(school.isBorneModifiable),
  minGrade: Number(school.borneMin ?? 0),
  maxGrade: Number(school.borneMax ?? 0),
  averageOutOf: Number(school.moyenneSur ?? 20),
  allowLetterGrades: Boolean(school.saisieLettre),
  levels: Array.isArray(school.niveaux)
    ? school.niveaux.map((level: any) => decodeLevel(level, currentTeacherId))
    : []
});

const decodeCycleLabel = (value?: string): string => {
  if (!value) return "";
  try {
    return decodeBase64(value);
  } catch {
    return value;
  }
};

const decodeCycle = (cycle: any): TeacherLevelsListCycleParams => ({
  cycleId: Number(cycle.idCycleEtab ?? 0),
  evaluationColor1: cycle.paramsLSU?.couleurEval1 ?? "",
  evaluationColor2: cycle.paramsLSU?.couleurEval2 ?? "",
  evaluationColor3: cycle.paramsLSU?.couleurEval3 ?? "",
  evaluationColor4: cycle.paramsLSU?.couleurEval4 ?? "",
  evaluationLabel1: decodeCycleLabel(cycle.paramsLSU?.libelleEval1),
  evaluationLabel2: decodeCycleLabel(cycle.paramsLSU?.libelleEval2),
  evaluationLabel3: decodeCycleLabel(cycle.paramsLSU?.libelleEval3),
  evaluationLabel4: decodeCycleLabel(cycle.paramsLSU?.libelleEval4),
  emoji1: cycle.paramsLSU?.emojiEval1 ?? "",
  emoji2: cycle.paramsLSU?.emojiEval2 ?? "",
  emoji3: cycle.paramsLSU?.emojiEval3 ?? "",
  emoji4: cycle.paramsLSU?.emojiEval4 ?? "",
  maxCharacters: Number(cycle.paramsLSU?.nombreCaracteresMax ?? 0),
  freeInputEnabled: Boolean(cycle.paramsLSU?.saisieLibreActive),
  printedProgramItems: Number(cycle.paramsLSU?.nbElementsProgrammeImprimes ?? 0),
  printedSubSubjectProgramItems: Number(
    cycle.paramsLSU?.nbElementsProgrammeImprimesSousMatiere ?? 0
  ),
  cycleLabel: cycle.paramsLSU?.libelleCycle ?? "",
  cycleNumber: Number(cycle.paramsLSU?.numeroCycle ?? 0)
});

export const decodeTeacherLevelsList = (
  data: any,
  currentTeacherId?: number
): TeacherLevelsList => ({
  groups: Array.isArray(data?.groupes) ? data.groupes : [],
  otherGroups: Array.isArray(data?.autresGroupes) ? data.autresGroupes : [],
  schools: Array.isArray(data?.etablissements)
    ? data.etablissements.map((school: any) => decodeSchool(school, currentTeacherId))
    : [],
  cycles: Array.isArray(data?.cycles) ? data.cycles.map(decodeCycle) : [],
  parameters: {
    visioEnabled: Boolean(data?.parametres?.isVisioEnable),
    attendanceUsesTimetable: Boolean(data?.parametres?.appelAvecEDT),
    attendanceUsesSchedule: Boolean(data?.parametres?.appelAvecGrilleHoraire),
    grid: Array.isArray(data?.parametres?.grille)
      ? data.parametres.grille.map((slot: any) => ({
          startAt: slot.heure_debut ?? "",
          endAt: slot.heure_fin ?? ""
        }))
      : []
  }
});

