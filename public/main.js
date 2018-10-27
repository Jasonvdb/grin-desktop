const { BrowserWindow, Notification, dialog } = require("electron");
let { app } = require("electron");
const axios = require("axios");
const { ipcMain } = require("electron");
const appRootDir = require("app-root-dir").get();
const isDev = require("electron-is-dev");
const path = require("path");

const grinBin = `${appRootDir}/grin-bin/grin`;

function createWindow() {
	const win = new BrowserWindow({
		width: 800,
		height: 500,
		backgroundColor: "#00d2ff"
	});

	//TODO isDev is not working
	// if (isDev) {
	win.loadURL("http://localhost:3000/");
	win.webContents.openDevTools();
	// } else {
	//win.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
	//}
}

app.on("closed", () => {
	//TODO kill daemons
	//rmConfig("grin-server.toml");
	//rmConfig("grin-wallet.toml");
	app = null;
});

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
			console.error(error.response.status);
		});
};

//Wallet docs
//https://github.com/mimblewimble/grin/blob/master/doc/api/wallet_owner_api.md
const getGrinWalletResponse = (path, onResult) => {
	//const url = "http://localhost:13420/v1/wallet/owner/retrieve_summary_info";

	const url = `http://localhost:13420/v1${path}`;

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
			console.error("Wallet API call failed ", url);
			console.error(error.response.status);
		});
};

const lsCommand = () => {
	const commandSwitches = [`-al`];

	const spawn = require("child_process").spawn;
	const cpCommand = spawn("ls", commandSwitches);

	cpCommand.stdout.on("data", data => {
		console.log(`LS: ${data}`);
		// dialog.showMessageBox({
		// 	type: "info",
		// 	title: "Hi",
		// 	message: `${grinBin}\n\n${data}`
		// });
	});

	cpCommand.stderr.on("data", data => {
		console.log(`LS ERROR: ${data}`);
	});
};

// const copyConfig = filename => {
// 	const commandSwitches = [`./grin-bin/${filename}`, "./"];

// 	const spawn = require("child_process").spawn;
// 	const cpCommand = spawn("cp", commandSwitches);

// 	cpCommand.stdout.on("data", data => {
// 		console.log(`CP: ${data}`);
// 	});

// 	cpCommand.stderr.on("data", data => {
// 		console.log(`CP ERROR: ${data}`);
// 	});
// };

// const rmConfig = filename => {
// 	const commandSwitches = [`./${filename}`];

// 	const spawn = require("child_process").spawn;
// 	const cpCommand = spawn("rm", commandSwitches);

// 	cpCommand.stdout.on("data", data => {
// 		console.log(`RM: ${data}`);
// 	});

// 	cpCommand.stderr.on("data", data => {
// 		console.log(`RM ERROR: ${data}`);
// 	});
// };

// const commandDaemon = () => {
// 	const commandSwitches = [
// 		"server",
// 		//"-c",
// 		//"./grin-bin/grin-server.toml",
// 		"run"
// 	];

// 	console.log(`${grinBin} ${commandSwitches.join(" ")}`);

// 	const spawn = require("child_process").spawn;
// 	const grinDaemon = spawn(grinBin, commandSwitches);

// 	grinDaemon.stdout.on("data", data => {
// 		console.log(`GRIN DAEMON: ${data}`);
// 	});

// 	grinDaemon.stderr.on("data", data => {
// 		console.log(`GRIN DAEMON ERROR: ${data}`);
// 	});
// };

// const commandGrinApi = () => {
// 	const commandSwitches = ["wallet", "owner_api"];

// 	console.log(`${grinBin} ${commandSwitches.join(" ")}`);

// 	const spawn = require("child_process").spawn;
// 	const grinApi = spawn(grinBin, commandSwitches);

// 	grinApi.stdout.on("data", data => {
// 		console.log(`GRIN API: ${data}`);
// 	});

// 	grinApi.stderr.on("data", data => {
// 		console.log(`GRIN API ERROR: ${data}`);
// 	});
// };

app.on("ready", () => {
	createWindow();

	lsCommand();
	//TODO start grin daemon and wallet owner_api

	//Hack so the grin process picks up the config
	// copyConfig("grin-server.toml");
	// copyConfig("grin-wallet.toml");

	// setTimeout(() => {
	// 	commandDaemon();
	// }, 1000);

	// setTimeout(() => {
	// 	commandGrinApi();
	// }, 2000);

	ipcMain.on("grin-server-request", (event, args) => {
		const { path } = args;
		getGrinServerResponse(path, grinResult => {
			event.sender.send("grin-server-reply", grinResult);
		});
	});

	ipcMain.on("grin-wallet-request", (event, args) => {
		const { path } = args;
		getGrinWalletResponse(path, grinResult => {
			event.sender.send("grin-wallet-reply", grinResult);
		});
	});
});

//TODO get
//http://localhost:13413/v1/status
//http://localhost:13413/v1/peers/connected
//http://localhost:13413/v1/chain
