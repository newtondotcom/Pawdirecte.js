import { decode as decodeBase64 } from "js-base64";
import type { TeacherPredefinedAppreciations } from "~/models";

export const decodeTeacherPredefinedAppreciations = (
  data: any
): TeacherPredefinedAppreciations => ({
  appreciations: Array.isArray(data?.appreciations)
    ? data.appreciations.map((item: any) => ({
        id: Number(item.id),
        code: item.code ?? "",
        label: decodeAppLabel(item.libelle),
        type: item.type ?? "",
        authorId: Number(item.idAuteur ?? 0)
      }))
    : [],
  maxCharacters: Number(data?.parametrage?.nbCaractMax ?? 0)
});

const decodeAppLabel = (value?: string): string => {
  if (!value) return "";
  try {
    return decodeBase64(value);
  } catch {
    return value;
  }
};

