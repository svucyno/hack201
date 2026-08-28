import "./globals.css";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import GlobalAIAssistant from "../components/GlobalAIAssistant";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700", "800", "900"], variable: "--font-outfit" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata = {
  title: "QFlux | Quantum Simulator IDE",
  description: "Research-grade quantum circuit editor, 3D WebGL Bloch spheres, and high-performance simulation engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-[#030712] text-slate-100 antialiased overflow-x-hidden selection:bg-cyan-500/30`}>
        {children}
        {/* Global Quantum Pilot Assistant */}
        <GlobalAIAssistant />
      </body>
    </html>
  );
}
