import validateBooking from '../app/actions/validateBooking';
import { DateTime } from 'luxon';

// Mock external dependencies
jest.mock('@/config/appwrite', () => ({
  createSessionClient: jest.fn().mockResolvedValue({
    databases: {
      listDocuments: jest.fn()
        .mockResolvedValueOnce({ documents: [] }) // user bookings
        .mockResolvedValueOnce({ documents: [] }) // accountant bookings
    }
  })
}));

jest.mock('next/headers', () => ({
  cookies: () => ({
    get: () => ({ value: 'mock-session' })
  })
}));

jest.mock('../app/actions/getSingleRoom', () => jest.fn().mockResolvedValue({
  availability: '9 AM - 5 PM'
}));

jest.mock('../app/actions/checkAuth', () => jest.fn().mockResolvedValue({
  user: { id: 'user123' }
}));

describe('validateBooking', () => {
  it('should return error if booking is in the past', async () => {
    const pastCheckIn = DateTime.now().minus({ hours: 2 }).toISO();
    const pastCheckOut = DateTime.now().minus({ hours: 1 }).toISO();

    const result = await validateBooking('room1', pastCheckIn, pastCheckOut);
    expect(result.error).toMatch(/past/i);
  });

  it('should return success if no conflicts and valid hours', async () => {
    const now = DateTime.now().plus({ hours: 2 }).set({ hour: 10, minute: 0 });
    const futureCheckIn = now.toISO({ suppressSeconds: true, suppressMilliseconds: true });
    const futureCheckOut = now.plus({ hours: 1 }).toISO({ suppressSeconds: true, suppressMilliseconds: true });

    const result = await validateBooking('room1', futureCheckIn, futureCheckOut);
    console.log('validateBooking result:', result);
    expect(result.success).toBe(true);
  });
});