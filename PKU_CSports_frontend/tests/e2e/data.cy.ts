/// <reference types="cypress" />

describe('数据中心页面 E2E', () => {
  it('应能切换联赛和数据类型标签', () => {
    cy.intercept('GET', '**/api/standings/players*', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            player_id: 1,
            player_name: '张俊哲',
            team_name: '信工联队',
            goals: 9,
            assists: 3
          }
        ]
      }
    }).as('getPlayers')

    cy.intercept('GET', '**/api/standings*', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            team_id: 1,
            team_name: '信工联队',
            points: 6,
            win: 2
          }
        ]
      }
    }).as('getStandings')

    cy.visit('/#/pages/data/data')
    cy.contains('数据中心')
    
    // 切换到积分榜
    cy.contains('积分').click()
    cy.wait('@getStandings')
    cy.get('.ranking-row').should('have.length.greaterThan', 0)
  })
})

