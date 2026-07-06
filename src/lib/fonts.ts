// Hebrew Google fonts, self-hosted via next/font. All are declared with
// preload:false so the browser only downloads the one a page actually uses.
import {
  Heebo,
  Assistant,
  Rubik,
  Varela_Round,
  Secular_One,
  Frank_Ruhl_Libre,
  Suez_One,
  Miriam_Libre,
  Alef,
  David_Libre,
} from "next/font/google";

const heebo = Heebo({ subsets: ["hebrew", "latin"], display: "swap", variable: "--font-heebo", weight: ["400", "500", "700", "800"] });
const assistant = Assistant({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-assistant", weight: ["400", "600", "700"] });
const rubik = Rubik({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-rubik", weight: ["400", "500", "700"] });
const varela = Varela_Round({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-varela", weight: ["400"] });
const secular = Secular_One({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-secular", weight: ["400"] });
const frank = Frank_Ruhl_Libre({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-frank", weight: ["400", "500", "700"] });
const suez = Suez_One({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-suez", weight: ["400"] });
const miriam = Miriam_Libre({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-miriam", weight: ["400", "700"] });
const alef = Alef({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-alef", weight: ["400", "700"] });
const david = David_Libre({ subsets: ["hebrew", "latin"], display: "swap", preload: false, variable: "--font-david", weight: ["400", "500", "700"] });

/** className that exposes every font variable — put on <html>. */
export const fontVariables = [
  heebo,
  assistant,
  rubik,
  varela,
  secular,
  frank,
  suez,
  miriam,
  alef,
  david,
]
  .map((f) => f.variable)
  .join(" ");

/** The app's own UI font (dashboard + marketing). */
export const uiFontClass = heebo.className;
