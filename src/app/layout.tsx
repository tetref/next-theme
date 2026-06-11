import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@dashboardpack/core/providers/theme-provider";
import { LocaleProvider } from "@dashboardpack/core/lib/i18n/locale-context";
import { Toaster } from "@dashboardpack/core/components/ui/sonner";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Zenith Dashboard — Admin Template",
  description: "A clean, minimal admin dashboard built with Next.js, shadcn/ui, and Tailwind CSS v4. Achromatic design that lets the features speak.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=localStorage.getItem("zenith-density");if(d&&["compact","comfortable","spacious"].includes(d)){document.documentElement.classList.add("density-"+d)}else{document.documentElement.classList.add("density-comfortable")}}catch(e){document.documentElement.classList.add("density-comfortable")}})();
(function(){try{var c=localStorage.getItem("zenith-color-preset");var p={"neutral":[0,0],"zinc":[286,0.006],"blue":[240,0.19],"violet":[280,0.19],"rose":[350,0.19],"orange":[50,0.19]};if(c&&p[c]){var s=document.documentElement.style;var a=p[c][1]<0.05;var v=a?"oklch(0.205 "+p[c][1]+" "+p[c][0]+")":"oklch(0.55 "+p[c][1]+" "+p[c][0]+")";s.setProperty("--primary",v);s.setProperty("--primary-foreground",a?"oklch(0.985 0 0)":"oklch(1 0 0)");s.setProperty("--sidebar-primary",v);if(!a){s.setProperty("--chart-1",v)}s.setProperty("--ring",a?"oklch(0.708 "+p[c][1]+" "+p[c][0]+")":v)}}catch(e){}})();
(function(){try{var l=localStorage.getItem("zenith-layout");if(l==="topnav"){document.documentElement.classList.add("layout-topnav")}else{document.documentElement.classList.add("layout-sidebar")}}catch(e){document.documentElement.classList.add("layout-sidebar")}})();
(function(){try{var b=localStorage.getItem("zenith-container");if(b==="boxed"){document.documentElement.classList.add("container-boxed")}else{document.documentElement.classList.add("container-fluid")}}catch(e){document.documentElement.classList.add("container-fluid")}})();
(function(){try{var r=localStorage.getItem("zenith-direction");if(r==="rtl"){document.documentElement.dir="rtl";document.documentElement.classList.add("dir-rtl")}else{document.documentElement.dir="ltr";document.documentElement.classList.add("dir-ltr")}}catch(e){document.documentElement.dir="ltr";document.documentElement.classList.add("dir-ltr")}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="system" storageKey="zenith-theme">
          <LocaleProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none"
            >
              Skip to content
            </a>
            {children}
            <Toaster richColors closeButton />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
