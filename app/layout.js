import "./globals.css";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import GlobalAIAssistant from "../components/GlobalAIAssistant";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["800", "900"], variable: "--font-outfit" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata = {
  title: "QFlux | Quantum Simulator IDE",
  description: "Professional research-grade quantum circuit editor and high-performance simulation engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${outfit.variable} ${jetbrains.variable}`}>
       <head>
          <link rel="icon" href="/favicon.ico" />
       </head>
      <body className={`${inter.className} bg-[#000000] text-[#fafafa] antialiased overflow-x-hidden selection:bg-blue-500/30`}>
        {children}
        {/* Global Quantum Pilot Assistant */}
        <GlobalAIAssistant />
      </body>
    </html>
  );
}
