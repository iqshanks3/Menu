import "./globals.css";

export const metadata = {
  title: "Cafe Menu",
  description: "Modern cafe digital menu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}