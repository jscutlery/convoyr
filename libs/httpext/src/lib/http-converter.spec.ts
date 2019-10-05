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
  it('should convert Request object to HttpRequest', () => {
    const requests: Request<unknown>[] = [
      {
        url: 'https://presidents.com',
        method: 'PUT',
        body: { data: { name: 'Jack Chirac' } },
        headers: { Authorization: 'token' },
        params: { id: '1' }
      },
      {
        url: 'https://test.com',
        method: 'GET',
        body: null,
        headers: {},
        params: {}
      }
    ];

    const expectations: HttpRequest<any>[] = [
      new HttpRequest(
        'PUT',
        'https://presidents.com',
        { data: { name: 'Jack Chirac' } },
        {
          headers: new HttpHeaders({ Authorization: 'token' }),
          params: new HttpParams().set('id', '1')
        }
      ),
      new HttpRequest('GET', 'https://test.com', {
        headers: new HttpHeaders(),
        params: new HttpParams()
      })
    ];

    requests.forEach((request, i) => {
      const converted = toNgReq(request);
      expect(converted).toHaveProperty('method', expectations[i].method);
      expect(converted).toHaveProperty('url', expectations[i].url);
      expect(converted.body).toEqual(expectations[i].body);
      Object.entries(requests[i].headers).forEach(([header, value]) =>
        expect(expectations[i].headers.get(header)).toBe(value)
      );
    });
  });
});
