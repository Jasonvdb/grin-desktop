import { createMuiTheme } from "@material-ui/core/styles";
import baseColor from "@material-ui/core/colors/cyan";
import primaryColor from "@material-ui/core/colors/deepOrange";
import secondaryColor from "@material-ui/core/colors/cyan";

// const cardBoxShadow = "-1px -1px 1px 1px rgba(234, 234, 234, 1)";

const defaultRootStyle = {
	flexGrow: 1,
	textAlign: "center",
	height: "90%",
	display: "flex",
	flexDirection: "column"
};

const defaultContentStyle = {
	flex: 1,
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-around",
	alignContent: "center"
};

const theme = createMuiTheme({
	palette: {
		primary: primaryColor,
		secondary: secondaryColor,
		background: { default: "transparent" },
		sidebar: { default: "transparent" },
		text: { default: "#fff", primary: "#fff", secondary: "#fff" },
		divider: "rgba(255, 255, 255, 0.3)"
	},
	typography: {
		fontFamily: "OpenSans Light"
	},
	overrides: {
		MuiButton: {
			root: {
				borderRadius: 30,
				borderWidth: 0.5,
				borderColor: "white",
				borderStyle: "solid"
			},
			default: {
				borderColor: "white"
			}
		}
	}
});

export { theme, defaultRootStyle, defaultContentStyle };
