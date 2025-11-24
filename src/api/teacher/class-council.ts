import { Buffer } from "node:buffer";
import { Request } from "~/core/request";
import {
  decodeTeacherClassCouncil,
  decodeTeacherClassCouncilAppreciation
} from "~/decoders/teacher-class-council";
import { decodeTeacherPredefinedAppreciations } from "~/decoders/teacher-predefined-appreciation";
import {
  SessionTokenRequired,
  type Session,
  type TeacherClassCouncil,
  type TeacherClassCouncilAppreciation,
  type TeacherClassCouncilStudentInput,
  type TeacherClassCouncilStudentUpdatePayload,
  type TeacherClassCouncilStudentUpdateResult,
  type TeacherPredefinedAppreciations
} from "~/models";

export const teacherClassCouncil = async (
  session: Session,
  teacherId: number,
  classId: number,
  periodId: string
): Promise<TeacherClassCouncil> => {
  if (!session.token) throw new SessionTokenRequired();

  const request = new Request(
    `/enseignants/${teacherId}/C/${classId}/periodes/${periodId}/conseilDeClasse.awp?verbe=get`
  )
    .addVersionURL()
    .setToken(session.token)
    .setFormData({});

  const response = await request.send(session.fetcher);
  session.token = response.token;

  return decodeTeacherClassCouncil(response.data);
};

export const teacherPredefinedAppreciations = async (
  session: Session,
  teacherId: number,
  classId: number
): Promise<TeacherPredefinedAppreciations> => {
  if (!session.token) throw new SessionTokenRequired();

  const request = new Request(
    `/Prof Principal/${teacherId}/C/${classId}/appreciationsPredefinies.awp?verbe=get`
  )
    .addVersionURL()
    .setToken(session.token)
    .setFormData({});

  const response = await request.send(session.fetcher);
  session.token = response.token;

  return decodeTeacherPredefinedAppreciations(response.data);
};

export const teacherSubjectPredefinedAppreciations = async (
  session: Session,
  teacherId: number,
  classId: number
): Promise<TeacherPredefinedAppreciations> => {
  if (!session.token) throw new SessionTokenRequired();

  const request = new Request(
    `/Enseignant/${teacherId}/C/${classId}/appreciationsPredefinies.awp?verbe=get`
  )
    .addVersionURL()
    .setToken(session.token)
    .setFormData({});

  const response = await request.send(session.fetcher);
  session.token = response.token;

  return decodeTeacherPredefinedAppreciations(response.data);
};

type AppreciationLike = TeacherClassCouncilAppreciation | null | undefined;

const encodeTextIfNeeded = (value?: string | null): string => {
  if (!value) return "";
  try {
    const base64 = Buffer.from(value, "base64").toString("base64");
    if (base64 === value) return value;
  } catch {
    // value is not base64, encode it below.
  }
  return Buffer.from(value, "utf-8").toString("base64");
};

const formatDateTime = (value?: string | Date | null): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  const date = value as Date;
  const pad = (num: number) => `${num}`.padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const serializeAppreciation = (input?: AppreciationLike) => ({
  id: input?.id ?? "",
  code: input?.code ?? "",
  libelle: input?.label ?? "",
  date: formatDateTime(input?.date ?? null),
  text: encodeTextIfNeeded(input?.text ?? "")
});

const serializeMention = (input?: AppreciationLike) => ({
  id: Number(input?.id ?? ""),
  libelle: input?.label ?? ""
});

const serializeStudentPayload = (student: TeacherClassCouncilStudentInput) => ({
  id: student.id,
  nom: student.lastName,
  prenom: student.firstName,
  particule: student.particle ?? "",
  photo: student.photoURL.replace("https:", "") ?? "",
  ordreArrivee: student.arrivalOrder ?? "",
  sexe: student.gender ?? "",
  isFirst: Boolean(student.isFirst),
  isLast: Boolean(student.isLast),
  appreciationPP: serializeAppreciation(student.appreciationPrincipalTeacher),
  appreciationCE: serializeAppreciation(student.appreciationHeadTeacher),
  appreciationVS: serializeAppreciation(student.appreciationVicePrincipal),
  appreciationCN: serializeAppreciation(student.appreciationNationalEducation),
  mentionDuConseil: serializeMention(student.councilMention),
  dispositifs: student.tags ?? []
});

const decodeUpdateResponse = (
  data: any
): TeacherClassCouncilStudentUpdateResult => ({
  appreciationPrincipalTeacher: decodeTeacherClassCouncilAppreciation(
    data?.appreciationPP
  ),
  appreciationHeadTeacher: decodeTeacherClassCouncilAppreciation(
    data?.appreciationCE
  ),
  appreciationVicePrincipal: decodeTeacherClassCouncilAppreciation(
    data?.appreciationVS
  ),
  appreciationNationalEducation: decodeTeacherClassCouncilAppreciation(
    data?.appreciationCN
  ),
  councilMention: decodeTeacherClassCouncilAppreciation(data?.mentionDuConseil),
  classAppreciation: decodeTeacherClassCouncilAppreciation(
    data?.appreciationGenerale
  )
});

export const updateTeacherClassCouncilStudent = async (
  session: Session,
  teacherId: number,
  classId: number,
  periodId: string,
  payload: TeacherClassCouncilStudentUpdatePayload
): Promise<TeacherClassCouncilStudentUpdateResult> => {
  if (!session.token) throw new SessionTokenRequired();

  const body = {
    eleve: serializeStudentPayload(payload.student),
    appreciationGeneraleClasse: serializeAppreciation(payload.classAppreciation)
  };

  const request = new Request(
    `/enseignants/${teacherId}/C/${classId}/periodes/${periodId}/conseilDeClasse/eleves/${payload.student.id}.awp?verbe=post`
  )
    .addVersionURL()
    .setToken(session.token)
    .setFormData(body);

  console.log(payload.classAppreciation);
  console.log(request.content);
  const response = await request.send(session.fetcher);
  session.token = response.token;

  return decodeUpdateResponse(response.data);
};

