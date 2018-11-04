import React, { Component } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from "react-router-dom";
import { observer } from "mobx-react";

import { theme } from "../../styles/theme";
import Container from "../common/Container";
import Wallet from "../views/wallet/Index";
import Sync from "../views/sync/Index";
import Transactions from "../views/transactions/Index";
import Peers from "../views/peers/Index";
import Contacts from "../views/contacts/Index";
import About from "../views/about/Index";
import Settings from "../views/settings/Index";
import Send from "../views/send/Index";
import Receive from "../views/receive/Index";
import NotFound from "../common/NotFound";
import grinServer from "../../stores/grinServer";

@observer
class Routes extends Component {
	render() {
		return (
			<Router>
				<MuiThemeProvider theme={theme}>
					{grinServer.isSyncing ? (
						<Sync />
					) : (
						<Container>
							<Switch>
								{/* <Redirect from="/" to="/wallet" /> */}
								<Route exact path="/" component={Wallet} />
								<Route exact path="/send" component={Send} />
								<Route exact path="/receive" component={Receive} />
								<Route exact path="/transactions" component={Transactions} />
								<Route exact path="/peers" component={Peers} />
								<Route exact path="/contacts" component={Contacts} />
								<Route exact path="/about" component={About} />
								<Route exact path="/settings" component={Settings} />
								<Route component={Wallet} />
							</Switch>
						</Container>
					)}
				</MuiThemeProvider>
			</Router>
		);
	}
}

export default Routes;
