import { Instrument_Serif, Inter_Tight } from "next/font/google";

export const interTight = Inter_Tight({
  subsets: ["latin"],
  style: "normal",
  display: "swap",
  variable: "--font-inter-tight",
});

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
  variable: "--font-instrument-serif",
});
