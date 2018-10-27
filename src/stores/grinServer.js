const { ipcRenderer } = window.require("electron");
import { observable, action, computed } from "mobx";

class Server {
	@observable
	statusDetails = null;

	constructor() {
		//Listen for updates
		console.log("Listening for server state updates");
		ipcRenderer.on("grin-server-reply", (event, statusDetails) => {
			this.statusDetails = statusDetails;
		});
	}

	@action
	refreshStatus() {
		ipcRenderer.send("grin-server-request", { path: "/status" });
	}

	@computed
	get isConnected() {
		return !!this.statusDetails;
	}
}

const grinServer = new Server();

export default grinServer;
