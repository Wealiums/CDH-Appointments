import createUser from '../app/actions/createUser';

jest.mock('@/config/appwrite', () => ({
  createAdminClient: () => ({
    account: {
      create: jest.fn().mockResolvedValue({}) // Mock success
    }
  })
}));

describe('createUser', () => {
  const getFormData = (overrides = {}) => {
    const defaults = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'StrongPass123',
      'confirm-password': 'StrongPass123',
    };
    const map = new Map(Object.entries({ ...defaults, ...overrides }));
    return {
      get: (key) => map.get(key)
    };
  };

  it('should return an error if fields are missing', async () => {
    const formData = getFormData({ name: '', email: '' });
    const result = await createUser(null, formData);
    expect(result.error).toMatch(/fill in all fields/i);
  });

  it('should return an error if passwords do not match', async () => {
    const formData = getFormData({ 'confirm-password': 'WrongPass' });
    const result = await createUser(null, formData);
    expect(result.error).toMatch(/passwords do not match/i);
  });

  it('should return success if input is valid', async () => {
    const formData = getFormData();
    const result = await createUser(null, formData);
    expect(result.success).toBe(true);
  });
});