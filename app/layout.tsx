import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";

// Extract metadata configuration for better maintainability
const SITE_METADATA = {
  title: "Happy New Year 2026",
  description: "Happy New Year 2026",
  url: "https://firework.hint.pro.vn",
  thumbnail: "/thumbnail_logo.png",
  googleVerification: "",
};

// Use a separate function to generate metadata for better readability
const generateMetaTags = (metadata: typeof SITE_METADATA) => (
  <>
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description} />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1,maximum-scale=1 "
    />
    <link rel="icon" href="/src/app/favicon.ico" />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap"
      rel="stylesheet"
    />
    {/* Open Graph / Social Media Meta Tags */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content={metadata.url} />
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:image" content={metadata.thumbnail} />

    {/* Zalo Meta Tags */}
    <meta property="zalo:site_name" content="HiNT" />
    <meta property="zalo:description" content={metadata.description} />
    <meta property="zalo:image" content={metadata.thumbnail} />

    {/* Google Search Console Verification */}
    <meta
      name="google-site-verification"
      content={metadata.googleVerification}
    />
  </>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {generateMetaTags(SITE_METADATA)}
        <script src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/fscreen%401.0.1.js"></script>
        <script src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/Stage%400.1.4.js"></script>
        <script src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/329180/MyMath.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
