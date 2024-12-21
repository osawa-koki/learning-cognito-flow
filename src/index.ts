import dotenv from "dotenv";

import signup from "./signup";
import signin from "./signin";

dotenv.config();

async function main() {
  const command = process.argv[2];

const COMMANDS = {
  signup: "signup",
  signin: "signin",
};

switch (command) {
  case COMMANDS.signup:
    console.log(await signup());
    break;
  case COMMANDS.signin:
    console.log(await signin());
    break;
  default:
    console.error(`Invalid command: '${command}'`);
    console.error(`Available commands: ${Object.values(COMMANDS).map((cmd) => `'${cmd}'`).join(", ")}`);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("Done");
  })
  .catch((error) => {
    console.error(error);
  });
