import gameImage from '../pages/api/game-image';

describe('game image API', () => {
  it('makes an abortable RAWG request so outages fail quickly', async () => {
    const originalKey = process.env.RAWG_API_KEY;
    const originalFetch = global.fetch;
    process.env.RAWG_API_KEY = 'test-key';
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const response = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await gameImage(
      { query: { name: 'Mario' } } as never,
      response as never
    );

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('api.rawg.io/api/games'),
      expect.objectContaining({ signal: expect.any(Object) })
    );
    process.env.RAWG_API_KEY = originalKey;
    global.fetch = originalFetch;
  });
});
