import { createMuiTheme } from "@material-ui/core/styles";
import primaryColor from "@material-ui/core/colors/deepOrange";
import secondaryColor from "@material-ui/core/colors/cyan";

const defaultRootStyle = {
	flexGrow: 1,
	textAlign: "center",
	height: "100%",
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
		useNextVariants: true,
		fontFamily: "OpenSans Light"
	},
	overrides: {
		MuiButton: {
			root: {
				borderRadius: 30,
				borderWidth: 0.5,
				borderColor: "white",
				borderStyle: "solid"
			}
		}
	}
});

export { theme, defaultRootStyle, defaultContentStyle };
