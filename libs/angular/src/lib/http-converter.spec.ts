import { HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { HttpExtRequest } from '@convoy/core';

import { fromNgRequest, toNgRequest } from './http-converter';

describe('fromNgRequest', () => {
  it('should convert HttpRequest with body to Request object', () => {
    const ngRequest = new HttpRequest(
      'POST',
      'https://angular.io',
      { data: 'hello world' },
      { headers: new HttpHeaders({ Authorization: 'token' }) }
    );
    expect(fromNgRequest(ngRequest)).toEqual({
      url: 'https://angular.io',
      method: 'POST',
      body: { data: 'hello world' },
      headers: { Authorization: 'token' },
      responseType: 'json',
      params: {},
    });
  });

  it('should convert HttpRequest without body to Request object', () => {
    const ngRequest = new HttpRequest('GET', 'https://wikipedia.com', {
      params: new HttpParams().set('id', '1'),
    });
    expect(fromNgRequest(ngRequest)).toEqual({
      url: 'https://wikipedia.com',
      method: 'GET',
      body: null,
      headers: {},
      params: { id: '1' },
      responseType: 'json',
    });
  });
});

describe('toNgRequest', () => {
  it('should convert Request with body to HttpRequest', () => {
    const request: HttpExtRequest = {
      url: 'https://presidents.com',
      method: 'PUT',
      body: { data: { name: 'Jacques Chirac' } },
      headers: { Authorization: 'Bearer token' },
      responseType: 'json',
      params: { id: '1' },
    };

    const ngRequest = toNgRequest(request);
    expect(ngRequest).toEqual(
      expect.objectContaining({
        method: 'PUT',
        url: 'https://presidents.com',
        body: { data: { name: 'Jacques Chirac' } },
      })
    );
    expect(ngRequest.headers.get('Authorization')).toEqual('Bearer token');
  });

  it('should convert Request without body to HttpRequest', () => {
    const request: HttpExtRequest = {
      url: 'https://test.com',
      method: 'GET',
      body: null,
      headers: {},
      responseType: 'json',
      params: {},
    };

    const ngRequest = toNgRequest(request);
    expect(ngRequest).toEqual(
      expect.objectContaining({
        method: 'GET',
        url: 'https://test.com',
      })
    );
  });
});
