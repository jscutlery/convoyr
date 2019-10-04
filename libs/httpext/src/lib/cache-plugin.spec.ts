import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpExtModule } from './http-ext.module';
import { useCachePlugin } from './cache-plugin';

describe('CachePlugin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HttpExtModule.forRoot({
          plugins: [useCachePlugin()]
        })
      ]
    });
  });

  let httpClient: HttpClient;
  beforeEach(() => (httpClient = TestBed.get(HttpClient)));

  let httpController: HttpTestingController;
  beforeEach(() => (httpController = TestBed.get(HttpTestingController)));

  afterEach(() => httpController.verify());

  xit('🚧 should retrieve resource with exact same url once', () => {
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

    httpClient
      .get('https://jscutlery.github.io/items/ITEM_ID')
      .subscribe(observer);

    httpController.expectNone('https://jscutlery.github.io/items/ITEM_ID');

    expect(observer).toHaveBeenCalledTimes(2);
    expect(observer.mock.calls[1][0]).toEqual({
      id: 'ITEM_ID',
      title: 'ITEM_TITLE'
    });
  });
});
