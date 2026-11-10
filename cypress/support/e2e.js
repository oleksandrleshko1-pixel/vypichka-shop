// Підміна запиту до API товарів, щоб тести не залежали від запущеного сервера
Cypress.Commands.add('stubProducts', () => {
  cy.intercept('GET', '**/api/products', { fixture: 'products.json' }).as('products');
});

// Додає товар у кошик зі сторінки каталогу
Cypress.Commands.add('addToCart', (title) => {
  cy.get(`button[aria-label="Додати в кошик: ${title}"]`).click();
});
