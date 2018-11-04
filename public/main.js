const { BrowserWindow, Notification, dialog } = require("electron");
let { app } = require("electron");
const axios = require("axios");
const { ipcMain } = require("electron");
const path = require("path");
const log = require("electron-log");
const fs = require("fs");

const isDev = process.env.ELECTRON_ENV === "development";

const grinInstallDir = `${app.getPath("home")}/.grin`;

//TODO move constants into a config.js in src/

const {
	startGrinServerProcess,
	startGrinWalletAPIProcess,
	startGrinWalletListenProcess,
	initGrinWalletProcess,
	getProcessName
} = require("./grin-child-processes");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let grinServerProcess;
let grinWalletAPIProcess;
let grinWalletListenProcess;
let grinWalletInitProcess;

let logQueue = [];
let logsReady = false;

const sendLog = log => {
	if (win && logsReady) {
		win.webContents.send("logs", log);
	} else {
		logQueue.push(log);
	}
};

const Logger = {
	info: msg => {
		log.info(msg);
		sendLog(msg);
	},
	error: msg => {
		log.error(msg);
		sendLog(`ERROR: ${msg}`);
	}
};

//TODO subscribe to these logs in the frontend
ipcMain.on("logs-ready", () => {
	logQueue.map(line => win && win.webContents.send("logs", line));
	logQueue = [];
	logsReady = true;
});

//TODO wait until the daemon works and add this again
const startGrinServer = async () => {
	try {
		grinServerProcess = await startGrinServerProcess({
			command: "grin",
			logger: Logger
		});

		console.log("Got grinServerProcess");
		//console.log(grinServerProcess);
	} catch (err) {
		Logger.error(`Caught Error When Starting grin node server: ${err}`);
	}
};

const startWalletAPI = async () => {
	try {
		grinWalletAPIProcess = await startGrinWalletAPIProcess({
			command: "grin",
			logger: Logger
		});

		console.log("Got grinWalletAPIProcess");
		//console.log(grinServerProcess);
	} catch (err) {
		Logger.error(`Caught Error When Starting grin wallet API: ${err}`);
	}
};

const startWalletListen = async () => {
	try {
		grinWalletListenProcess = await startGrinWalletListenProcess({
			command: "grin",
			logger: Logger
		});

		console.log("Got grinWalletListenProcess");
		//console.log(grinServerProcess);
	} catch (err) {
		Logger.error(`Caught Error When Starting grin wallet listen: ${err}`);
	}
};

const initWallet = async () => {
	try {
		grinWalletInitProcess = await initGrinWalletProcess({
			command: "grin",
			logger: Logger
		});

		console.log("Got grinWalletInitProcess");
		//console.log(grinServerProcess);
	} catch (err) {
		Logger.error(`Caught Error When Starting grin wallet init: ${err}`);
	}
};

function createWindow() {
	win = new BrowserWindow({
		width: 900,
		height: 550,
		backgroundColor: "#5433ff"
	});

	//TODO isDev is not working
	if (isDev) {
		win.loadURL("http://localhost:3000/");
		win.webContents.openDevTools();
	} else {
		win.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
	}
}

//Server docs
//https://github.com/mimblewimble/grin/blob/master/doc/api/node_api.md
const getGrinServerResponse = (path, password, onResult) => {
	const url = `http://localhost:13413/v1${path}`;

	axios({
		method: "get",
		url,
		auth: {
			username: "grin",
			password
		}
	})
		.then(response => {
			const { data } = response;
			onResult(data);
		})
		.catch(error => {
			if (error && error && error.errno === "ECONNREFUSED") {
				const processName = getProcessName("grin");
				const errorMessage = `Please run the node manually using a terminal until the daemon is functional: ${processName} `;
				Logger.error(errorMessage);
				onResult(null, errorMessage);
			} else {
				Logger.error("Node API call failed ", url);
				Logger.error(error.response ? error.response.status : error.errno);
			}
		});
};

//Wallet docs
//https://github.com/mimblewimble/grin/blob/master/doc/api/wallet_owner_api.md
const getGrinWalletResponse = (path, password, onResult) => {
	const url = `http://localhost:13420/v1${path}`;

	axios({
		method: "get",
		url,
		auth: {
			username: "grin",
			password
		}
	})
		.then(response => {
			const { data } = response;
			onResult(data);
		})
		.catch(error => {
			console.error("Wallet API call failed ", url, " ==== ", password);
			console.error(error.response ? error.response.status : error.errno);

			onResult(null, "Failed to query wallet API");
		});
};

const getWalletPassword = () => {
	const secretFile = `${grinInstallDir}/.api_secret`;

	//Check if api_secret is there to use for API calls
	if (fs.existsSync(secretFile)) {
		const secretFileContent = fs.readFileSync(secretFile, "utf8");
		const grinAPIPassword = secretFileContent.trim();
		return grinAPIPassword;
	} else {
		Logger.error(`No secret found in ${secretFile}`);
		return false;
	}
};

const walletIsInitialized = () => {
	const walletSeedFile = `${grinInstallDir}/wallet_data/wallet.seed`;
	if (fs.existsSync(walletSeedFile)) {
		return true;
	} else {
		Logger.info(`No wallet seed found in ${walletSeedFile}`);
		return false;
	}
};

app.on("ready", () => {
	createWindow();

	if (!walletIsInitialized()) {
		initWallet();
	}

	//startGrinServer(); //TODO place back when working
	startWalletAPI();
	startWalletListen();

	const apiPassword = getWalletPassword();
	if (!apiPassword) {
		return;
	}

	ipcMain.on("grin-server-request", (event, args) => {
		const { path } = args;
		//TODO move all possible paths to shared config and then check the frontend is only sending valid ones
		getGrinServerResponse(path, apiPassword, (result, error = null) => {
			event.sender.send("grin-server-reply", { path, result, error }); //Passing path back so we know what data we received
		});
	});

	ipcMain.on("grin-wallet-request", (event, args) => {
		const { path } = args;
		getGrinWalletResponse(path, apiPassword, (result, error = null) => {
			event.sender.send("grin-wallet-reply", { path, result, error });
		});
	});
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	app.quit();
});

app.on("quit", () => {
	console.log("KILL processes.");
	grinServerProcess && grinServerProcess.kill("SIGINT");
	grinWalletAPIProcess && grinWalletAPIProcess.kill("SIGINT");
	grinWalletListenProcess && grinWalletListenProcess.kill("SIGINT");
});

app.on("closed", () => {
	app = null;
});
