import { teacherLevelsList } from "../../src";

import { ExampleCredentialsError, credentials } from "../_credentials";
import { loginUsingCredentials } from "../_login-using-crendentials";

void (async function main() {
  if (!credentials.teacher_username || !credentials.teacher_password)
    throw new ExampleCredentialsError("teacher");

  const { session } = await loginUsingCredentials(
    credentials.teacher_username,
    credentials.teacher_password
  );

  const levels = await teacherLevelsList(session);
  console.log(JSON.stringify(levels, null, 2));
})();

