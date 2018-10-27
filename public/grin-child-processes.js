const os = require("os");
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

function getProcessName(binName) {
	const filename = os.platform() === "win32" ? `${binName}.exe` : binName;
	console.log(__dirname);
	const filePath = __dirname.includes("asar")
		? path.join(__dirname, "..", "..", "assets", "bin", os.platform(), filename)
		: path.join(__dirname, "..", "assets", "bin", os.platform(), filename);
	return fs.existsSync(filePath) ? filePath : filename;
}

async function startChildProcess(name, args, logger) {
	return new Promise((resolve, reject) => {
		const processName = getProcessName(name);
		logger.info(`Process name: ${processName}`);
		const childProcess = cp.spawn(processName, args);
		childProcess.stdout.on("data", data => {
			//logger.info(`${name}: ${data}`);
			resolve(childProcess);
		});
		childProcess.stderr.on("data", data => {
			logger.error(`${name} Error: ${data}`);
			reject(new Error(data));
		});
		childProcess.on("error", reject);
	});
}

module.exports.startGrinServerProcess = async function({ command, logger }) {
	const args = ["server", "run"];
	return startChildProcess(command, args, logger);
};

module.exports.startGrinWalletAPIProcess = async function({ command, logger }) {
	const args = ["wallet", "--external", "owner_api"];
	return startChildProcess(command, args, logger);
};

module.exports.startGrinWalletListenProcess = async function({
	command,
	logger
}) {
	const args = ["wallet", "--external", "listen"];
	return startChildProcess(command, args, logger);
};
