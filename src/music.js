const applescript = require("applescript");

const applescriptInfo = `tell application "Music" to get { name of current track, artist of current track, player position, player state }`;

module.exports = {
  setPresence(rpc) {
    applescript.execString(applescriptInfo, (error, result) => {
      const [songName, artist, currentTime, playerState] = result;
      const startTime = new Date().getTime() - Math.floor(currentTime * 1000);

      return rpc.setActivity({
        details: songName,
        state: `by ${ artist }`,
        startTimestamp: playerState === "playing" ? startTime : undefined,
        largeImageKey: "music",
        largeImageText: "Music",
        smallImageKey: playerState === "playing" ? "play" : "pause",
        smallImageText: playerState === "playing" ? "Playing" : "Paused",
        instance: false
      }).catch((error) => console.log(error));
    });
  }
}