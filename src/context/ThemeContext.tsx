import {
  createTheme,
  Theme,
  ThemeProvider as MuiThemeProvider,
  Switch,
  styled,
} from "@mui/material";
import { createContext, useEffect, useMemo, useState } from "react";

declare module "@mui/material/styles" {
  interface Palette {
    appBg: {
      main: string;
    };
    appBgSecond: {
      main: string;
    };
    appGrey: {
      main: string;
    };
    appBgContrast: {
      main: string;
    };
  }
  interface PaletteOptions {
    appBg?: {
      main: string;
    };
    appGrey?: {
      main: string;
    };
    appBgSecond?: {
      main: string;
    };
    appBgContrast?: {
      main: string;
    };
  }
}

const CustomSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75
            0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>`
        )}")`,
      },
      "& + .MuiSwitch-track": {
        backgroundColor: "#03a9f4",
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#03a9f4" : "#2196f3",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386
          6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636
          5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>`
      )}")`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    borderRadius: 20 / 2,
    backgroundColor: theme.palette.mode === "dark" ? "#000000" : "#ffffff",
  },
}));

interface ThemeContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  theme: Theme;
  SwitchButton: React.JSX.Element;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(
  undefined
);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: darkMode ? "dark" : "light",
        primary: {
          main: "#2196f3",
        },
        secondary: {
          main: "#03a9f4",
        },
        appBg: {
          main: darkMode ? "#4997d2" : "#ededed",
        },
        appBgSecond: {
          main: darkMode ? "#224d70" : "#ededed",
        },
        appGrey: {
          main: darkMode ? "#ededed" : "#cfcfcf",
        },
        appBgContrast: {
          main: darkMode ? "#224d70" : "#ffffff",
        },
      },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundColor: darkMode ? "#006ec8" : "#ffffff",
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              backgroundColor: darkMode ? "#4997d2" : "inherit",
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: darkMode ? "#155c93" : "#ffffff",
            },
          },
        },
        MuiCheckbox: {
          styleOverrides: {
            root: {
              color: darkMode ? "#fff" : "inherit",
              "&.Mui-checked": {
                color: darkMode ? "#1a5786" : "inherit",
              },
              "&.MuiCheckbox-indeterminate": {
                color: darkMode ? "#1a5786" : "inherit",
              },
            },
          },
        },
        MuiAvatar: {
          styleOverrides: {
            root: {
              backgroundColor: darkMode ? "#4384b6" : "#ccc",
              color: "white",
            },
          },
        },
      },
    });
  }, [darkMode]);

  const SwitchButton = (
    <CustomSwitch checked={darkMode} onChange={toggleDarkMode} />
  );

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider
      value={{ darkMode, toggleDarkMode, theme, SwitchButton }}
    >
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
