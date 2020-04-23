import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { createSpyPlugin } from '@convoyr/core/testing';
import { _HTTP_EXT_CONFIG } from './convoyr.interceptor';

import { ConvoyrModule } from './convoyr.module';

describe('ConvoyModule', () => {
  let spyPlugin;

  describe('with config', () => {
    beforeEach(() => {
      spyPlugin = createSpyPlugin();

      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          ConvoyrModule.forRoot({
            plugins: [spyPlugin],
          }),
        ],
      });
    });

    let httpClient: HttpClient;
    beforeEach(() => (httpClient = TestBed.inject(HttpClient)));

    let httpController: HttpTestingController;
    beforeEach(() => (httpController = TestBed.inject(HttpTestingController)));

    afterEach(() => httpController.verify());

    it('should handle http request', () => {
      const observer = jest.fn();

      httpClient
        .get('https://jscutlery.github.io/items/ITEM_ID')
        .subscribe(observer);

      httpController
        .expectOne('https://jscutlery.github.io/items/ITEM_ID')
        .flush({
          id: 'ITEM_ID',
          title: 'ITEM_TITLE',
        });

      expect(observer).toHaveBeenCalledTimes(1);
      expect(observer.mock.calls[0][0]).toEqual({
        id: 'ITEM_ID',
        title: 'ITEM_TITLE',
      });

      expect(spyPlugin.handler.handle).toHaveBeenCalledTimes(1);
      expect(spyPlugin.handler.handle.mock.calls[0][0].request).toEqual({
        url: 'https://jscutlery.github.io/items/ITEM_ID',
        method: 'GET',
        body: null,
        headers: {},
        params: {},
        responseType: 'json',
      });
      expect(typeof spyPlugin.handler.handle.mock.calls[0][0].next).toEqual(
        'function'
      );
    });
  });

  describe('with dynamic config', () => {
    beforeEach(() => {
      spyPlugin = createSpyPlugin();

      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          ConvoyrModule.forRoot({
            config: () => ({
              plugins: [spyPlugin],
            }),
          }),
        ],
      });
    });

    let httpClient: HttpClient;
    beforeEach(() => (httpClient = TestBed.inject(HttpClient)));

    let httpController: HttpTestingController;
    beforeEach(() => (httpController = TestBed.inject(HttpTestingController)));

    afterEach(() => httpController.verify());

    it('should handle http request', () => {
      const observer = jest.fn();

      httpClient
        .get('https://jscutlery.github.io/items/ITEM_ID')
        .subscribe(observer);

      httpController
        .expectOne('https://jscutlery.github.io/items/ITEM_ID')
        .flush({});

      expect(observer).toHaveBeenCalledTimes(1);
      expect(spyPlugin.handler.handle).toHaveBeenCalledTimes(1);
    });
  });

  describe('with dynamic config and dependency injection', () => {
    class Service {}

    let configFn: jest.Mock;
    let service: Service;

    beforeEach(() => {
      configFn = jest.fn();
      service = new Service();

      TestBed.configureTestingModule({
        providers: [
          {
            provide: Service,
            useValue: service,
          },
        ],
        imports: [
          HttpClientTestingModule,
          ConvoyrModule.forRoot({
            deps: [Service],
            config: configFn,
          }),
        ],
      });
    });

    it('should handle http request', () => {
      const config = {};
      configFn.mockReturnValue(config);

      /* Injecting config triggers the config factory. */
      expect(TestBed.inject(_HTTP_EXT_CONFIG)).toEqual(config);

      expect(configFn).toHaveBeenCalledTimes(1);
      expect(configFn).toHaveBeenCalledWith(service);
    });
  });
});
