function CrossFrameCommand(from, command, data) {
    this.from = from;
    this.command = command;
    this.data = data;
};

CrossFrameCommand.prototype.set = function (from, command, data) {
    this.from = from;
    this.command = command;
    this.data = data;
}

// CrossFrameCommand.prototype.intoJSON = function () {

//     var JSON_format = "";

//     JSON_format = JSON_format + "{";
//     JSON_format = JSON_format + "\"from\": " + "\"" + this.from + "\"" + ",";
//     JSON_format = JSON_format + "\"command\": " + "\"" + this.command + "\"" + ",";
//     JSON_format = JSON_format + "\"data\": " + "\"" + this.data + "\"";
//     JSON_format = JSON_format + "}";

//     return JSON_format;
// }

var crossframecmd = new CrossFrameCommand("none", "none", "none");





