/// <reference types="cypress" />

describe('工具页面权限测试', () => {
  beforeEach(() => {
    // 清除本地存储，确保测试隔离
    cy.clearLocalStorage()
  })

  it('普通用户不应看到发布按钮', () => {
    // 使用 onBeforeLoad 在页面加载前设置 localStorage
    cy.visit('/#/pages/tools/tools', {
      onBeforeLoad(win) {
        win.localStorage.setItem('userInfo', JSON.stringify({
          username: 'testuser',
          role: 'user'
        }))
      }
    })
    
    cy.contains('工具')
    
    // 等待组件生命周期执行（onShow 读取 localStorage）
    cy.wait(1000)
    
    // 发布按钮不应存在
    cy.get('.publish-btn').should('not.exist')
  })

  it('协会用户应看到发布按钮', () => {
    // 使用 onBeforeLoad 在页面加载前设置 localStorage
    cy.visit('/#/pages/tools/tools', {
      onBeforeLoad(win) {
        win.localStorage.setItem('userInfo', JSON.stringify({
          username: 'assoc',
          role: 'association'
        }))
      }
    })
    
    cy.contains('工具')
    
    // 等待组件生命周期执行（onShow 读取 localStorage 并更新 computed）
    // uni-app 的 onShow 可能在页面显示后异步执行，需要等待
    cy.wait(1000)
    
    // 发布按钮应存在（增加超时时间，等待组件更新）
    cy.get('.publish-btn', { timeout: 10000 }).should('exist')
    cy.get('.publish-btn').should('contain.text', '发布')
  })
})

