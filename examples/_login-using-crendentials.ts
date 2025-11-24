import {
  checkDoubleAuth,
  initDoubleAuth,
} from "~/api/double-auth";
import * as readline from "readline";
import { DoubleAuthRequired, Session } from "~/models";
import { login, setAccessToken } from "~/api/login";

// This is an identifier that'll be
// linked to the token generated, should be very secure !
export const uuid = "your-device-uuid";

export async function loginUsingCredentials(
  username: string,
  password: string
) {
  console.info("Initializing a session using credentials...");
  const session: Session = { username, device_uuid: uuid };

  const accounts = await login(session, password).catch(async (error) => {
    // Handle double authentication, if required.
    if (error instanceof DoubleAuthRequired) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const qcm = await initDoubleAuth(session);
      console.info("Double authentication required.");
      console.info("Reply to this question:", qcm.question);

      for (const index in qcm.answers) {
        console.info(`[${index}]`, qcm.answers[index]);
      }

      const answerIndex = await new Promise<string>((resolve) => {
        rl.question("Answer the question by providing the index of the answer: ", (answer) => {
          rl.close();
          resolve(answer);
        });
      });

      if (!answerIndex) throw new Error("No answer provided.");
      const answer = qcm.answers[Number.parseInt(answerIndex)];

      // Answer the question.
      if (await checkDoubleAuth(session, answer)) {
        console.info("Double authentication confirmed.");
      }

      return login(session, password);
    }
    throw error;
  });

  // Grab the first account, and show some information.
  const account = accounts[0];
  setAccessToken(session, account);
  console.log(
    "Logged in to",
    account.firstName,
    account.lastName,
    "from",
    account.schoolName
  );

  return { session, account };
}
