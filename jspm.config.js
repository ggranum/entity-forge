SystemJS.config({
  paths: {
    "github:": "jspm_packages/github/",
    "npm:": "jspm_packages/npm/",
    "forge/": "src/forge",
    "check/": "src/check/",
    "generate/": "src/generate",
    "validation/": "src/validation",
    "entityforge/": "src/"
  },
  browserConfig: {
    "baseURL": "/"
  },
  transpiler: "plugin-typescript",
  packages: {
    "entityforge": {
      defaultExtension: 'ts',
      "main": "entity-forge.ts",
      "meta": {
        "*.ts": {
          "loader": "plugin-typescript"
        }
      }
    },
    "check": {
      defaultExtension: 'ts',
      "main": "index.ts",
      "meta": {
        "*.ts": {
          "loader": "plugin-typescript",
        },
        "deps": ["validation"]
      }
    },
    "validation": {
      defaultExtension: 'ts',
      "main": "src/validation/index.ts",
      "meta": {
        "*.ts": {
          "loader": "plugin-typescript"
        }
      }
    },
    "test": {
      defaultExtension: 'ts',
      "main": "entity-forge-test.ts",
      "meta": {
        "*.ts": {
          "loader": "plugin-typescript"
        }
      }
    }

  }
});

SystemJS.config({
  packageConfigPaths: [
    "github:*/*.json",
    "npm:@*/*.json",
    "npm:*.json"
  ],
  map: {},
  packages: {}
});
