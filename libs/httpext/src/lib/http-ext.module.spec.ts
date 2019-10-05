import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HttpExtModule } from './http-ext.module';
import { Plugin } from './plugin';

describe('HttpExtModule', () => {
  beforeEach(() => {
    function spyingPlugin(): Plugin {
      return {
        handle({ req, next }) {
          console.log('hello world');
          return next({ req });
        }
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
    console.log = jest.fn();

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

    expect(console.log).toHaveBeenCalledWith('hello world');
  });
});
