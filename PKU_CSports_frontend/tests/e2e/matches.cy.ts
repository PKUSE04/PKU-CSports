/// <reference types="cypress" />

describe('赛事页 E2E', () => {
  it('加载赛程并展示球队名', () => {
    // 在访问页面前拦截接口，保证有可渲染数据，避免依赖后端/网络波动
    cy.intercept('GET', '**/api/matches*', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            id: 1,
            date_time: '2025-10-17 19:00',
            home_team_name: '信工联队',
            away_team_name: '元社联队',
            status: '已结束',
            venue: '邱德拔B2'
          }
        ]
      }
    }).as('getMatches')

    cy.visit('/#/pages/matches/matches')
    cy.contains('赛事')
    cy.wait('@getMatches')

    cy.get('.match-card', { timeout: 8000 }).should('have.length.greaterThan', 0)
    cy.get('.match-card').first().within(() => {
      cy.get('.team').first().should('contain.text', '信工联队')
      cy.contains('vs')
    })
  })
})

