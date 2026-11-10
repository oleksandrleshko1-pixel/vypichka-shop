describe('Кошик і оформлення замовлення', () => {
  beforeEach(() => {
    cy.stubProducts();
    cy.visit('/catalog');
    cy.wait('@products');
    cy.addToCart('Медовик');
    cy.addToCart('Медовик');
    cy.addToCart('Багет');
    cy.contains('a', /Кошик/).click();
  });

  const fill = (name, phone, address) => {
    if (name) cy.get('input[placeholder="Ім\'я"]').type(name);
    if (phone) cy.get('input[placeholder="Телефон"]').type(phone);
    if (address) cy.get('input[placeholder="Адреса"]').type(address);
  };
  const submit = () => cy.contains('button', 'Підтвердити замовлення').click();

  it('показує товари та загальну суму', () => {
    cy.contains('Медовик').should('be.visible');
    cy.contains('840 ₴').should('be.visible');
    cy.contains('900 ₴').should('be.visible');
  });

  it('змінює кількість і видаляє товар', () => {
    cy.get('button[aria-label="Більше"]').eq(1).click();
    cy.contains('120 ₴').should('be.visible');
    cy.get('button[aria-label="Видалити: Медовик"]').click();
    cy.contains('Медовик').should('not.exist');
    cy.contains('60 ₴ за шт.').should('be.visible');
  });

  it('кошик зберігається після перезавантаження сторінки', () => {
    cy.reload();
    cy.contains('Медовик').should('be.visible');
    cy.contains('900 ₴').should('be.visible');
  });

  it('перемикає доставку та самовивіз', () => {
    cy.get('input[placeholder="Адреса"]').should('exist');
    cy.contains('button', 'Самовивіз').click();
    cy.get('input[placeholder="Адреса"]').should('not.exist');
    cy.contains('button', 'Доставка').click();
    cy.get('input[placeholder="Адреса"]').should('exist');
  });

  it('валідація: порожня форма', () => {
    submit();
    cy.contains("Вкажіть ім'я").should('be.visible');
  });

  it('валідація: некоректний телефон', () => {
    fill('Олена', '12', 'вул. Мирна 1');
    submit();
    cy.contains('Вкажіть коректний телефон').should('be.visible');
  });

  it('валідація: немає адреси при доставці', () => {
    fill('Олена', '+380501234567');
    submit();
    cy.contains('Вкажіть адресу доставки').should('be.visible');
  });

  it('оформлює замовлення і очищує кошик', () => {
    cy.intercept('POST', '**/api/orders', { statusCode: 201, body: { id: 101 } }).as('order');
    fill('Олена', '+380501234567', 'вул. Мирна 1');
    submit();
    cy.wait('@order').its('request.body').should((body) => {
      expect(body.items).to.deep.equal([
        { id: 'medovyk', qty: 2 },
        { id: 'baguette', qty: 1 },
      ]);
      expect(body.customer.name).to.eq('Олена');
      expect(body.delivery).to.eq(true);
    });
    cy.contains('Дякуємо за замовлення!').should('be.visible');
    cy.contains('№101').should('be.visible');
    cy.contains('a', 'До каталогу').click();
    cy.contains('a', 'Кошик · 0').should('be.visible');
  });

  it('самовивіз надсилає замовлення без адреси', () => {
    cy.intercept('POST', '**/api/orders', { statusCode: 201, body: { id: 7 } }).as('order');
    cy.contains('button', 'Самовивіз').click();
    fill('Олена', '+380501234567');
    submit();
    cy.wait('@order').its('request.body').should((body) => {
      expect(body.delivery).to.eq(false);
      expect(body.address).to.eq(null);
    });
    cy.contains('Дякуємо за замовлення!').should('be.visible');
  });

  it('показує помилку сервера і залишає кошик', () => {
    cy.intercept('POST', '**/api/orders', { statusCode: 400, body: { message: 'Товар недоступний' } });
    fill('Олена', '+380501234567', 'вул. Мирна 1');
    submit();
    cy.contains('Товар недоступний').should('be.visible');
    cy.contains('Медовик').should('be.visible');
  });
});
