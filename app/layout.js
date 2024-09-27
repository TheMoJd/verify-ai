// app/layout.js
import localFont from "next/font/local";
import "@/app/styles/globals.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});


export const metadata = {
    title: "Avis des Experts sur Votre Idée d'Entreprise",
    description: "Obtenez l'avis de trois experts sur votre idée d'entreprise en utilisant l'API d'OpenAI.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="fr">
        <body>{children}</body>
        </html>
    );
}
