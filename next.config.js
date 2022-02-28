/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["nl", "en", "fr"],
    defaultLocale: "nl",
  },
};

module.exports = nextConfig;
