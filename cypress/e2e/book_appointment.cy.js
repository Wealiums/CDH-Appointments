describe('Book a Appointment', () => {
  before(() => {
    // Login first (assuming test user exists)
    cy.visit('https://cdh-appointments.vercel.app/login');
    cy.get('input[name="email"]').type('test@gmail.com');
    cy.get('input[name="password"]').type('TestTest');
    cy.contains('Login').click();

    cy.url().should('not.include', '/login');
  });

  it('fills and submits the booking form', () => {
    // Visit a specific room booking page
    cy.visit('https://cdh-appointments.vercel.app/rooms/123'); // Replace with a real ID or route

    // Fill out form fields
    cy.get('input[name="check_in_date"]').type('2025-08-10');
    cy.get('input[name="check_in_time"]').type('10:00');
    cy.get('input[name="check_out_time"]').type('11:00');
    cy.get('input[name="appointment_type"]').type('Consultation');
    cy.get('textarea[name="booking_summary"]').type('Discuss project progress');
    cy.get('input[name="room_id"]').should('have.value', '123'); // if hidden
    cy.get('input[name="user_name"]').type('Test User');
    cy.get('input[name="name"]').type('Test Appointment');

    // Submit the form
    cy.contains('Book Now').click();

    // Validate success message or redirect
    cy.contains('Booking confirmed').should('be.visible');
  });
});
