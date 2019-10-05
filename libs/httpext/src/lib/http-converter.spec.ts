import { HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';

import { Request } from './http';
import { fromNgReq, toNgReq } from './http-converter';
import objectContaining = jasmine.objectContaining;

describe('fromNgReq', () => {
  it('should convert HttpRequest with body to Request object', () => {
    const ngRequest = new HttpRequest(
      'POST',
      'https://angular.io',
      { data: 'hello world' },
      { headers: new HttpHeaders({ Authorization: 'token' }) }
    );
    expect(fromNgReq(ngRequest)).toEqual({
      url: 'https://angular.io',
      method: 'POST',
      body: { data: 'hello world' },
      headers: { Authorization: 'token' },
      params: {}
    });
  });

  it('should convert HttpRequest without body to Request object', () => {
    const ngRequest = new HttpRequest('GET', 'https://wikipedia.com', {
      params: new HttpParams().set('id', '1')
    });
    expect(fromNgReq(ngRequest)).toEqual({
      url: 'https://wikipedia.com',
      method: 'GET',
      body: null,
      headers: {},
      params: { id: '1' }
    });
  });
});

describe('toNgReq', () => {
  it('should convert Request with body to HttpRequest', () => {
    const request: Request = {
      url: 'https://presidents.com',
      method: 'PUT',
      body: { data: { name: 'Jacques Chirac' } },
      headers: { Authorization: 'Bearer token' },
      params: { id: '1' }
    };

    const ngRequest = toNgReq(request);
    expect(ngRequest).toEqual(
      objectContaining({
        method: 'PUT',
        url: 'https://presidents.com',
        body: { data: { name: 'Jacques Chirac' } }
      })
    );
    expect(ngRequest.headers.get('Authorization')).toEqual('Bearer token');
  });

  it('should convert Request wihtout body to HttpRequest', () => {
    const request: Request = {
      url: 'https://test.com',
      method: 'GET',
      body: null,
      headers: {},
      params: {}
    };

    const ngRequest = toNgReq(request);
    expect(ngRequest).toEqual(
      objectContaining({
        method: 'GET',
        url: 'https://test.com'
      })
    );
  });
});
