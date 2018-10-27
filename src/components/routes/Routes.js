import React, { Component } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from "react-router-dom";

import { theme } from "../../styles/theme";
import Container from "../common/Container";
import Wallet from "../views/wallet/Index";
import Transactions from "../views/transactions/Index";
import Peers from "../views/peers/Index";
import About from "../views/about/Index";
import NotFound from "../common/NotFound";

class Routes extends Component {
	render() {
		return (
			<Router>
				<MuiThemeProvider theme={theme}>
					<Container>
						<Switch>
							{/* <Redirect from="/" to="/wallet" /> */}
							<Route exact path="/" component={Wallet} />
							<Route exact path="/transactions" component={Transactions} />
							<Route exact path="/peers" component={Peers} />
							<Route exact path="/about" component={About} />
							<Route component={NotFound} />
						</Switch>
					</Container>
				</MuiThemeProvider>
			</Router>
		);
	}
}

export default Routes;
