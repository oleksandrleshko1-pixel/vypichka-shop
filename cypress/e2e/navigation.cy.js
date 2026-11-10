describe('Навігація', () => {
  beforeEach(() => {
    cy.stubProducts();
  });

  it('відкриває головну сторінку', () => {
    cy.visit('/');
    cy.contains('h1', 'Свіжа випічка до вашого столу').should('be.visible');
    cy.contains('a', 'Зробити замовлення').should('have.attr', 'href', '/catalog');
  });

  it('головна показує лише новинки', () => {
    cy.visit('/');
    cy.contains('Медовик').should('be.visible');
    cy.contains('Макарон').should('be.visible');
    cy.contains('Багет').should('not.exist');
  });

  it('переходить по меню в каталог, кошик і профіль', () => {
    cy.visit('/');
    cy.contains('a', 'Каталог').click();
    cy.url().should('include', '/catalog');
    cy.contains('a', /Кошик/).click();
    cy.url().should('include', '/cart');
    cy.contains('h2', 'Ваше замовлення').should('be.visible');
    cy.contains('a', 'Профіль').click();
    cy.url().should('include', '/auth');
    cy.contains('h2', 'Вхід').should('be.visible');
  });

  it('логотип веде на головну', () => {
    cy.visit('/catalog');
    cy.contains('a', 'Крафтова випічка').click();
    cy.location('pathname').should('eq', '/');
  });

  it('показує сторінку 404 для невідомого шляху', () => {
    cy.visit('/no-such-page');
    cy.contains('404').should('be.visible');
    cy.contains('Сторінку не знайдено').should('be.visible');
    cy.contains('a', 'На головну').click();
    cy.location('pathname').should('eq', '/');
  });
});
