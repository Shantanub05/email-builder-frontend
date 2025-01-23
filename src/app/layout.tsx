import "./globals.css";
import LayoutContainer from "@/components/ui/LayoutContainer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full w-full">
      <body className="h-full w-full">
        <LayoutContainer>{children}</LayoutContainer>
      </body>
    </html>
  );
}
