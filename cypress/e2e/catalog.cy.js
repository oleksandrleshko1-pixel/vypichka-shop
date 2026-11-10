describe('Каталог', () => {
  beforeEach(() => {
    cy.stubProducts();
    cy.visit('/catalog');
    cy.wait('@products');
  });

  it('показує всі товари та їх кількість', () => {
    cy.contains('Знайдено · 3 товарів').should('be.visible');
    ['Медовик', 'Багет', 'Макарон'].forEach((title) => cy.contains(title).should('be.visible'));
  });

  it('фільтрує за категорією', () => {
    cy.contains('label', 'Торти').find('input').uncheck();
    cy.contains('Медовик').should('not.exist');
    cy.contains('Знайдено · 2 товарів').should('be.visible');
    cy.contains('label', 'Торти').find('input').check();
    cy.contains('Медовик').should('be.visible');
  });

  it('показує «Нічого не знайдено», якщо знято всі категорії', () => {
    ['Торти', 'Тістечка', 'Хліб', 'Печиво'].forEach((name) => {
      cy.contains('label', name).find('input').uncheck();
    });
    cy.contains('Нічого не знайдено.').should('be.visible');
  });

  it('сортує за ціною', () => {
    cy.get('select[aria-label="Сортування"]').select('priceAsc');
    cy.get('article h3').first().should('contain', 'Багет');
    cy.get('select[aria-label="Сортування"]').select('priceDesc');
    cy.get('article h3').first().should('contain', 'Медовик');
  });

  it('відкриває сторінку товару і додає його в кошик', () => {
    cy.contains('article h3 a', 'Медовик').click();
    cy.url().should('include', '/catalog/medovyk');
    cy.contains('h1', 'Медовик').should('be.visible');
    cy.contains('420 ₴').should('be.visible');
    cy.contains('button', 'Додати в кошик').click();
    cy.contains('Додано!').should('be.visible');
    cy.contains('a', 'Кошик · 1').should('be.visible');
    cy.contains('a', 'Перейти в кошик').click();
    cy.contains('Медовик').should('be.visible');
  });

  it('показує повідомлення, якщо товару не існує', () => {
    cy.visit('/catalog/nope');
    cy.contains('Товар не знайдено').should('be.visible');
    cy.contains('a', 'Назад до каталогу').click();
    cy.url().should('include', '/catalog');
  });

  it('кнопка «+» на картці додає товар і оновлює лічильник', () => {
    cy.addToCart('Медовик');
    cy.addToCart('Медовик');
    cy.addToCart('Багет');
    cy.contains('a', 'Кошик · 3').should('be.visible');
  });
});

describe('Каталог: помилка сервера', () => {
  it('показує повідомлення про помилку', () => {
    cy.intercept('GET', '**/api/products', { statusCode: 500, body: { message: 'Збій сервера' } });
    cy.visit('/catalog');
    cy.contains('Не вдалося завантажити товари: Збій сервера').should('be.visible');
  });
});
