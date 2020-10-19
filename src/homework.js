const readline = require("readline");
const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

module.exports = {
  async setPresence(rpc) {
    const [details, state, largeText, smallText] = await promptStatus();
    const startTime = new Date().getTime();

    return rpc.setActivity({
      details: details,
      state: state,
      startTimestamp: startTime,
      largeImageKey: "kaguya",
      largeImageText: largeText,
      smallImageKey: "crying",
      smallImageText: smallText,
      instance: false
    }).catch((error) => console.log(error));
  }
}

async function promptStatus() {
  const details = await new Promise((resolve, reject) => {
    reader.question("Course: ", (details) => resolve(details));
  });
  const state = await new Promise((resolve, reject) => {
    reader.question("Assignment: ", (state) => resolve(state));
  });
  const largeText = await new Promise((resolve, reject) => {
    reader.question("Topic: ", (largeText) => resolve(largeText));
  });
  const smallText = await new Promise((resolve, reject) => {
    reader.question("Module: ", (smallText) => resolve(smallText));
  });

  return [details, state, largeText, smallText];
}