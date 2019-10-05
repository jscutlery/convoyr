import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HttpExtModule } from './http-ext.module';
import { Plugin } from './plugin';
import mock = jest.mock;

describe('HttpExtModule', () => {
  let mockHandle: jest.Mock;

  beforeEach(() => {
    /* A plugin handle that just calls through the next plugin.*/
    mockHandle = jest.fn(({ req, next }) => next({ req }));

    function spyingPlugin(): Plugin {
      return {
        handle: mockHandle
      };
    }

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HttpExtModule.forRoot({
          plugins: [spyingPlugin()]
        })
      ]
    });
  });

  let httpClient: HttpClient;
  beforeEach(() => (httpClient = TestBed.get(HttpClient)));

  let httpController: HttpTestingController;
  beforeEach(() => (httpController = TestBed.get(HttpTestingController)));

  afterEach(() => httpController.verify());

  it('should log once', () => {
    const observer = jest.fn();

    httpClient
      .get('https://jscutlery.github.io/items/ITEM_ID')
      .subscribe(observer);

    httpController
      .expectOne('https://jscutlery.github.io/items/ITEM_ID')
      .flush({
        id: 'ITEM_ID',
        title: 'ITEM_TITLE'
      });

    expect(observer).toHaveBeenCalledTimes(1);
    expect(observer.mock.calls[0][0]).toEqual({
      id: 'ITEM_ID',
      title: 'ITEM_TITLE'
    });

    expect(mockHandle).toHaveBeenCalledTimes(1);
    expect(mockHandle.mock.calls[0][0].req).toEqual({
      url: 'https://jscutlery.github.io/items/ITEM_ID',
      method: 'GET',
      body: null,
      headers: {},
      params: {}
    });
    expect(typeof mockHandle.mock.calls[0][0].next).toEqual('function');
  });
});
