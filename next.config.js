/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["nl", "en", "fr", "pl"],
    defaultLocale: "nl",
  },
};

module.exports = nextConfig;
