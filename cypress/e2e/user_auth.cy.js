describe('User Registration and Login', () => {
  it('Registers a new user', () => {
    cy.visit('http://localhost:3000/register');

    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('Password123');
    cy.contains('Register').click();

    // Assuming a success message or redirect
    cy.url().should('include', '/login');
  });

  it('Logs in the user', () => {
    cy.visit('http://localhost:3000/login');

    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('Password123');
    cy.contains('Login').click();

    cy.url().should('not.include', '/login');
    cy.contains('My Bookings'); // or any element visible after login
  });
});