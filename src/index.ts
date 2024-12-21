import dotenv from "dotenv";

dotenv.config();

const command = process.argv[2];

const COMMANDS = {
  signup: "signup",
  signin: "signin",
};

switch (command) {
  case COMMANDS.signup:
    break;
  case COMMANDS.signin:
    break;
  default:
    console.error(`Invalid command: '${command}'`);
    console.error(`Available commands: ${Object.values(COMMANDS).map((cmd) => `'${cmd}'`).join(", ")}`);
    process.exit(1);
}
