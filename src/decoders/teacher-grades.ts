import { decode as decodeBase64 } from "js-base64";
import type {
  TeacherGradesSettings,
  TeacherLSUNEntry,
  TeacherLSUNMap
} from "~/models";

export const decodeTeacherLSUN = (lsun: Record<string, any> | null | undefined): TeacherLSUNMap => {
  const normalized: TeacherLSUNMap = {};
  if (!lsun) return normalized;

  for (const [periodId, entries] of Object.entries(lsun)) {
    normalized[periodId] = Array.isArray(entries)
      ? entries.map((entry: any): TeacherLSUNEntry => ({
          subjectCode: entry.codeMatiere,
          subjectLabel: entry.libelleMatiere,
          subSubjectCode: entry.codeSousMatiere || "",
          subSubjectLabel: entry.libelleSousMatiere || "",
          isFirstSubject: Boolean(entry.isFirstOfMatiere),
          isFirstSubSubject: Boolean(entry.isFirstOfSousMatiere),
          subjectElementCount: Number(entry.nbElemProgMatiere ?? 0),
          subSubjectElementCount: Number(entry.nbElemProgSousMatiere ?? 0),
          description: entry.libelleElementProgramme,
          elementId: Number(entry.idElemProg ?? 0),
          value: entry.valeur,
          afc: Number(entry.afc ?? 0),
          competencyId: Number(entry.idCompetence ?? 0),
          knowledgeId: Number(entry.idConnaissance ?? 0),
          requiresValidation: Boolean(entry.cdt),
          professors: Array.isArray(entry.professeurs)
            ? entry.professeurs.map((prof: any) => ({
                id: Number(prof.id ?? 0),
                name: prof.nom
              }))
            : []
        }))
      : [];
  }

  return normalized;
};

const decodeLabel = (value?: string | null): string => {
  if (!value) return "";
  try {
    return decodeBase64(value);
  } catch {
    return value;
  }
};

export const decodeTeacherGradesSettings = (
  parametrage: Record<string, any> | null | undefined
): TeacherGradesSettings => {
  const settings = parametrage ?? {};

  const evaluationColors = [
    settings.couleurEval1,
    settings.couleurEval2,
    settings.couleurEval3,
    settings.couleurEval4
  ].filter(Boolean);

  const evaluationLabels = [
    decodeLabel(settings.libelleEval1),
    decodeLabel(settings.libelleEval2),
    decodeLabel(settings.libelleEval3),
    decodeLabel(settings.libelleEval4)
  ].filter(Boolean);

  const evaluationComponentLabels = [
    decodeLabel(settings.libelleEvalCompNum1),
    decodeLabel(settings.libelleEvalCompNum2),
    decodeLabel(settings.libelleEvalCompNum3)
  ].filter(Boolean);

  return {
    evaluationColors,
    evaluationLabels,
    evaluationComponentLabels,
    showStudentAverage: Boolean(settings.moyenneGenerale),
    showPeriodAverage: Boolean(
      settings.moyennePeriodeReleve ?? settings.moyennePeriodeAnnuelle
    ),
    showNotes: Boolean(settings.affichageNote ?? true),
    showCompetencies: Boolean(settings.affichageCompetence),
    showTeacherAppreciations: Boolean(settings.appreciationsProf),
    showPrincipalTeacherAppreciation: Boolean(settings.appreciationProfPrinc),
    showHeadOfSchoolAppreciation: Boolean(settings.appreciationCE),
    showVicePrincipalAppreciation: Boolean(settings.appreciationVS),
    showClassAppreciation: Boolean(settings.affichageAppreciationClasse),
    showMentions: Boolean(settings.affichageMention)
  };
};

