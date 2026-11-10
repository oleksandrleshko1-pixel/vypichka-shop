const session = { user: { id: 1, name: 'Олена', email: 'olena@test.ua' }, token: 'test-token' };

describe('Вхід і реєстрація', () => {
  beforeEach(() => {
    cy.stubProducts();
    cy.visit('/auth');
  });

  const registerForm = () => cy.contains('h2', 'Реєстрація').parent();
  const loginForm = () => cy.contains('h2', 'Вхід').parent();

  it('показує обидві форми', () => {
    cy.contains('h2', 'Вхід').should('be.visible');
    cy.contains('h2', 'Реєстрація').should('be.visible');
  });

  it('реєстрація: вимагає ім’я', () => {
    registerForm().contains('button', 'Створити акаунт').click();
    cy.contains("Вкажіть ім'я").should('be.visible');
  });

  it('реєстрація: перевіряє довжину пароля та збіг паролів', () => {
    registerForm().within(() => {
      cy.get('input[placeholder="Ім\'я"]').type('Олена');
      cy.get('input[placeholder="Електронна пошта"]').type('olena@test.ua');
      cy.get('input[placeholder="Пароль"]').type('123');
      cy.get('input[placeholder="Повторіть пароль"]').type('123');
      cy.contains('button', 'Створити акаунт').click();
    });
    cy.contains('Пароль має містити щонайменше 6 символів').should('be.visible');

    registerForm().within(() => {
      cy.get('input[placeholder="Пароль"]').clear().type('123456');
      cy.get('input[placeholder="Повторіть пароль"]').clear().type('654321');
      cy.contains('button', 'Створити акаунт').click();
    });
    cy.contains('Паролі не збігаються').should('be.visible');
  });

  it('реєстрація: вимагає згоду з правилами', () => {
    registerForm().within(() => {
      cy.get('input[placeholder="Ім\'я"]').type('Олена');
      cy.get('input[placeholder="Електронна пошта"]').type('olena@test.ua');
      cy.get('input[placeholder="Пароль"]').type('123456');
      cy.get('input[placeholder="Повторіть пароль"]').type('123456');
      cy.contains('button', 'Створити акаунт').click();
    });
    cy.contains('Потрібна згода з правилами сайту').should('be.visible');
  });

  it('реєстрація: успішна, шапка показує ім’я, вихід працює', () => {
    cy.intercept('POST', '**/api/auth/register', { statusCode: 201, body: session }).as('register');
    cy.intercept('GET', '**/api/orders', { body: [] });
    registerForm().within(() => {
      cy.get('input[placeholder="Ім\'я"]').type('Олена');
      cy.get('input[placeholder="Електронна пошта"]').type('olena@test.ua');
      cy.get('input[placeholder="Пароль"]').type('123456');
      cy.get('input[placeholder="Повторіть пароль"]').type('123456');
      cy.get('input[type="checkbox"]').check();
      cy.contains('button', 'Створити акаунт').click();
    });
    cy.wait('@register');
    cy.location('pathname').should('eq', '/');
    cy.contains('a', 'Олена').should('be.visible').click();
    cy.contains('Ви увійшли').should('be.visible');
    cy.contains('Замовлень поки немає.').should('be.visible');
    cy.contains('button', 'Вийти').click();
    cy.contains('h2', 'Вхід').should('be.visible');
    cy.contains('a', 'Профіль').should('be.visible');
  });

  it('вхід: успішний, переходить на головну', () => {
    cy.intercept('POST', '**/api/auth/login', { body: session }).as('login');
    loginForm().within(() => {
      cy.get('input[placeholder="Електронна пошта"]').type('olena@test.ua');
      cy.get('input[placeholder="Пароль"]').type('123456');
      cy.contains('button', 'Увійти').click();
    });
    cy.wait('@login').its('request.body').should('deep.equal', {
      email: 'olena@test.ua',
      password: '123456',
    });
    cy.location('pathname').should('eq', '/');
    cy.contains('a', 'Олена').should('be.visible');
  });

  it('вхід: показує помилку сервера', () => {
    cy.intercept('POST', '**/api/auth/login', { statusCode: 401, body: { message: 'Невірний пароль' } });
    loginForm().within(() => {
      cy.get('input[placeholder="Електронна пошта"]').type('olena@test.ua');
      cy.get('input[placeholder="Пароль"]').type('wrongpass');
      cy.contains('button', 'Увійти').click();
    });
    cy.contains('Невірний пароль').should('be.visible');
  });

  it('сесія зберігається після перезавантаження', () => {
    cy.intercept('POST', '**/api/auth/login', { body: session });
    loginForm().within(() => {
      cy.get('input[placeholder="Електронна пошта"]').type('olena@test.ua');
      cy.get('input[placeholder="Пароль"]').type('123456');
      cy.contains('button', 'Увійти').click();
    });
    cy.reload();
    cy.contains('a', 'Олена').should('be.visible');
  });
});
