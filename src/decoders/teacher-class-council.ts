import type {
  TeacherClassCouncil,
  TeacherClassCouncilAppreciation,
  TeacherClassCouncilAppreciationSetting,
  TeacherClassCouncilMention,
  TeacherClassCouncilSettings,
  TeacherClassCouncilStudent
} from "~/models";

const decodeAppreciation = (input: any): TeacherClassCouncilAppreciation => {
  const date =
    typeof input?.date === "string" && input.date.trim() !== ""
      ? new Date(input.date)
      : null;

  return {
    id: input?.id ?? "",
    code: input?.code ?? "",
    label: input?.libelle ?? "",
    date,
    text: input?.text ?? ""
  };
};

const decodeStudent = (student: any): TeacherClassCouncilStudent => ({
  id: Number(student.id),
  firstName: student.prenom,
  lastName: student.nom,
  particle: student.particule ?? "",
  gender: student.sexe,
  arrivalOrder: student.ordreArrivee ?? "",
  photoURL: student.photo ?? "",
  tags: Array.isArray(student.dispositifs) ? student.dispositifs : [],
  appreciationPrincipalTeacher: decodeAppreciation(student.appreciationPP),
  appreciationHeadTeacher: decodeAppreciation(student.appreciationCE),
  appreciationVicePrincipal: decodeAppreciation(student.appreciationVS),
  appreciationNationalEducation: decodeAppreciation(student.appreciationCN),
  councilMention: decodeAppreciation(student.mentionDuConseil)
});

const decodeMention = (mention: any): TeacherClassCouncilMention => ({
  id: Number(mention.id),
  label: mention.libelle ?? "",
  line: Number(mention.numLigne ?? 0)
});

const decodeAppreciationSetting = (
  appreciation: any
): TeacherClassCouncilAppreciationSetting => ({
  id: Number(appreciation.id),
  code: appreciation.code ?? "",
  label: appreciation.libelle ?? "",
  maxCharacters: Number(appreciation.nbCaracteres ?? appreciation.nbMaxCaractere ?? 0)
});

const decodeSettings = (data: any): TeacherClassCouncilSettings => ({
  allowPrincipalTeacherToEditVicePrincipal: Boolean(data?.PPModifVS),
  allowPrincipalTeacherToEditAll: Boolean(data?.PPModifTout),
  enableClassAppreciation: Boolean(data?.saisieAppreciationClasse),
  principalTeacherMaxLength: Number(data?.longueurMaxAppPP ?? 0),
  mentions: Array.isArray(data?.mentions) ? data.mentions.map(decodeMention) : [],
  appreciations: Array.isArray(data?.appreciations)
    ? data.appreciations.map(decodeAppreciationSetting)
    : []
});

export const decodeTeacherClassCouncil = (data: any): TeacherClassCouncil => {
  return {
    students: Array.isArray(data?.eleves) ? data.eleves.map(decodeStudent) : [],
    settings: decodeSettings(data?.parametrage ?? {}),
    classAppreciation: decodeAppreciation(data?.appreciationGenerale ?? {})
  };
};

