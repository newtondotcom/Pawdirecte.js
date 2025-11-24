import { decodeAccountKind } from "~/decoders/account-kind";
import type { Account } from "~/models/account";

export const decodeAccount = (account: any): Account => {
  const profile = account.profile ?? {};
  const accountClass =
    profile.classe && profile.classe.code && profile.classe.libelle
      ? {
          short: profile.classe.code,
          long: profile.classe.libelle
        }
      : null;
  const gender =
    typeof profile.sexe !== "undefined" && profile.sexe !== null
      ? profile.sexe
      : account.civilite === "Mme"
        ? "F"
        : "M";

  return {
    loginID: account.idLogin,
    id: account.id,
    userID: account.uid,
    username: account.identifiant,
    kind: decodeAccountKind(account.typeCompte),
    ogecID: account.codeOgec,
    main: account.main,
    lastConnection: account.lastConnexion,
    firstName: account.prenom,
    lastName: account.nom,
    email: account.email,
    phone: profile.telPortable ?? "",
    schoolName: account.nomEtablissement,
    schoolUAI: profile.rneEtablissement ?? account.rneEtablissement ?? "",
    schoolLogoPath: account.logoEtablissement,
    schoolAgendaColor: account.couleurAgendaEtablissement,
    access_token: account.accessToken,
    socket_token: account.socketToken,
    gender,
    profilePictureURL: profile.photo ?? "",
    modules: account.modules,
    currentSchoolCycle: account.anneeScolaireCourante,
    class: accountClass
  };
};
