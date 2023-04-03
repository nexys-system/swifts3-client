// Sync object
const config = {
  preset: "ts-jest/presets/js-with-ts-esm",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(t|j)s$": [
      "ts-jest",
      {
        /* ts-jest config goes here in Jest */
      },
    ],
  },
};

export default config;
