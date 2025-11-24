import { teacherLevelsList } from "../../src";

import { ExampleCredentialsError, credentials } from "../_credentials";
import { loginUsingCredentials } from "../_login-using-crendentials";

void (async function main() {
  if (!credentials.teacher_username || !credentials.teacher_password)
    throw new ExampleCredentialsError("teacher");

  const { session, account } = await loginUsingCredentials(
    credentials.teacher_username,
    credentials.teacher_password
  );

  const currentTeacherId = account.id;
  const levels = await teacherLevelsList(session, currentTeacherId);
  console.log(JSON.stringify(levels.schools[0].levels[0].classes[0].isCurrentUserPrincipal, null, 2));
})();

