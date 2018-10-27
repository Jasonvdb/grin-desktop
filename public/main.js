const { BrowserWindow, Notification, dialog } = require("electron");
let { app } = require("electron");
const axios = require("axios");
const { ipcMain } = require("electron");
const path = require("path");
const log = require("electron-log");

const isDev = process.env.ELECTRON_ENV === "development";

//TODO move constants into a config.js in src/
const {
	startGrinServerProcess,
	startGrinWalletAPIProcess,
	startGrinWalletListenProcess
} = require("./grin-child-processes");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let grinServerProcess;
let grinWalletAPIProcess;
let grinWalletListenProcess;

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
const getGrinServerResponse = (path, onResult) => {
	const url = `http://localhost:13413/v1${path}`;

	axios({
		method: "get",
		url,
		auth: {
			username: "grin",
			password: "NYTXd2PmYjBlujFLqrC2"
		}
	})
		.then(response => {
			const { data } = response;
			onResult(data);
		})
		.catch(error => {
			console.error("Node API call failed ", url);
			console.error(error.response ? error.response.status : error.errno);
		});
};

//Wallet docs
//https://github.com/mimblewimble/grin/blob/master/doc/api/wallet_owner_api.md
const getGrinWalletResponse = (path, onResult) => {
	const url = `http://localhost:13420/v1${path}`;

	axios({
		method: "get",
		url,
		auth: {
			username: "grin",
			password: "NYTXd2PmYjBlujFLqrC2" //TODO read from ~/.grin/.api_secret
		}
	})
		.then(response => {
			const { data } = response;
			onResult(data);
		})
		.catch(error => {
			console.error("Wallet API call failed ", url);
			console.error(error.response ? error.response.status : error.errno);
		});
};

app.on("ready", () => {
	createWindow();
	//TODO check if a wallet has been initialized first
	const grinInstallDir = `${app.getPath("home")}/.grin`;
	console.log("Check DIR: ", grinInstallDir);

	//startGrinServer(); //TODO place back when working
	startWalletAPI();
	startWalletListen();

	ipcMain.on("grin-server-request", (event, args) => {
		const { path } = args;
		//TODO move all possible paths to shared config and then check the frontend is only sending valid ones
		getGrinServerResponse(path, result => {
			event.sender.send("grin-server-reply", { path, result }); //Passing path back so we know what data we received
		});
	});

	ipcMain.on("grin-wallet-request", (event, args) => {
		const { path } = args;
		getGrinWalletResponse(path, result => {
			event.sender.send("grin-wallet-reply", { path, result });
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
