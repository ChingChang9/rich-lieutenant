const { Client } = require("discord-rpc");
const rpc = new Client({ transport: "ipc" });
const app = process.argv[2];

const banner = `______ _                       _           ____________  _____
|  _  (_)                     | |          | ___ \\ ___ \\/  __ \\
| | | |_ ___  ___ ___  _ __ __| |  ______  | |_/ / |_/ /| /  \\/
| | | | / __|/ __/ _ \\| '__/ _\` | |______| |    /|  __/ | |
| |/ /| \\__ \\ (_| (_) | | | (_| |          | |\\ \\| |    | \\__/\\
|___/ |_|___/\\___\\___/|_|  \\__,_|          \\_| \\_\\_|     \\____/

                                                               `;

const config = app === "homework" ? require("./config.json").homework : require("./config.json").music;
rpc.login(config.clientId).catch(console.error);

rpc.on("ready", async () => {
	console.clear();
	console.log(banner);
	process.stdout.write("Setting RPC activity...");

  const { setPresence } = require(`./src/${ app }.js`);
  await setPresence(rpc);
  updateConsole("RPC has been set!");
  if (app !== "homework") {
    let updatecounter = 0;
    setInterval(async () => {
      await setPresence(rpc);
      updateConsole(`Updated the RPC ${ ++updatecounter } time${ updatecounter === 1 ? "" : "s" }!`);
    }, 20 * 1000);
  }
});

function updateConsole(text) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(text);
}