const { ipcRenderer } = window.require("electron");
//TODO use mobx here
class Server {
	statusDetails = null;

	constructor() {
		//Listen for updates
		console.log("Listening for updates");
		ipcRenderer.on("grin-server-reply", (event, statusDetails) => {
			this.statusDetails = statusDetails;
		});
	}

	refreshStatus(onSuccess = null, onError = null) {
		ipcRenderer.send("grin-server-request", { path: "/status" });
	}
}

const grinServer = new Server();

export default grinServer;
