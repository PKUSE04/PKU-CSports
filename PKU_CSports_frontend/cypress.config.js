const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // 请按实际 dev server 端口调整
    supportFile: false,
    specPattern: 'tests/e2e/**/*.cy.{js,ts}'
  }
})

