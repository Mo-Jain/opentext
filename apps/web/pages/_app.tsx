import Header from "@/components/Header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/toaster"



export default function App({ Component, pageProps }: AppProps) {
  return<>
    <Header />
    <Component {...pageProps} />
    <Toaster />
  </> ;
}
