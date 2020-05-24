import { PluginTester, createPluginTester } from './create-plugin-tester';

describe('PluginTester', () => {
  let pluginHandler: { handle: () => jest.Mock<any, any> };
  let pluginTester: PluginTester;

  beforeEach(() => (pluginHandler = { handle: jest.fn() }));
  beforeEach(
    () => (pluginTester = createPluginTester({ handler: pluginHandler as any }))
  );

  it('should mock Http handler', () => {
    const httpHandlerMock = pluginTester.mockHttpHandler();

    expect(jest.isMockFunction(httpHandlerMock)).toBeTruthy();
  });

  it.todo('should run the Http handler using the mock');
});
