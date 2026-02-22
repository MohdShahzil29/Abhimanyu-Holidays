// craco.config.js
const path = require("path");
require("dotenv").config();

const webpackConfig = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  babel: {
    loaderOptions: (babelLoaderOptions, { env }) => {
      if (env === "production" && Array.isArray(babelLoaderOptions.plugins)) {
        babelLoaderOptions.plugins = babelLoaderOptions.plugins.filter(
          (plugin) => {
            if (typeof plugin === "string") {
              return !plugin.includes("react-refresh/babel");
            }
            if (Array.isArray(plugin) && typeof plugin[0] === "string") {
              return !plugin[0].includes("react-refresh/babel");
            }
            return true;
          },
        );
      }
      return babelLoaderOptions;
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      const isProduction = process.env.NODE_ENV === "production";

      // Add ignored patterns to reduce watched directories
      webpackConfig.watchOptions = {
        ...webpackConfig.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/build/**',
          '**/dist/**',
          '**/coverage/**',
          '**/public/**',
        ],
      };

      // Safety: ensure React Refresh babel plugin is not present in production builds.
      if (isProduction && webpackConfig?.module?.rules) {
        webpackConfig.module.rules.forEach((rule) => {
          if (!Array.isArray(rule.oneOf)) return;
          rule.oneOf.forEach((oneOfRule) => {
            const plugins = oneOfRule?.options?.plugins;
            if (!Array.isArray(plugins)) return;
            oneOfRule.options.plugins = plugins.filter((plugin) => {
              if (typeof plugin === "string") {
                return !plugin.includes("react-refresh/babel");
              }
              if (Array.isArray(plugin) && typeof plugin[0] === "string") {
                return !plugin[0].includes("react-refresh/babel");
              }
              return true;
            });
          });
        });
      }

      return webpackConfig;
    },
  },
};

module.exports = webpackConfig;
