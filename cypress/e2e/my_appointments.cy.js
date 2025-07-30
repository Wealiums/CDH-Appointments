describe('User Appointment List', () => {
  before(() => {
    cy.visit('https://cdh-appointments.vercel.app/login');
    cy.get('input[name="email"]').type('test@gmail.com');
    cy.get('input[name="password"]').type('TestTest');
    cy.contains('Login').click();
  });

  it('displays user bookings on /bookings page', () => {
    cy.visit('https://cdh-appointments.vercel.app/bookings');
    
    // Wait for data to load and validate at least one booking
    cy.get('.booked-room-card, .booking-entry').should('exist'); 
    cy.contains('Check-in').should('exist'); // Customize based on actual UI
  });
});
