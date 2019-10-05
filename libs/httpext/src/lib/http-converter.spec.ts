import { HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';

import { Request } from './http';
import { fromNgReq, toNgReq } from './http-converter';

describe('fromNgReq', () => {
  it('should convert HttpRequest to Request object', () => {
    const requests = [
      new HttpRequest(
        'POST',
        'https://angular.io',
        { data: 'hello world' },
        { headers: new HttpHeaders({ Authorization: 'token' }) }
      ),
      new HttpRequest('GET', 'https://wikipedia.com', {
        params: new HttpParams().set('id', '1')
      })
    ];

    const expectations: Request<unknown>[] = [
      {
        url: 'https://angular.io',
        method: 'POST',
        body: { data: 'hello world' },
        headers: { Authorization: 'token' },
        params: {}
      },
      {
        url: 'https://wikipedia.com',
        method: 'GET',
        body: null,
        headers: {},
        params: { id: '1' }
      }
    ];

    requests.forEach((ngRequest, i) =>
      expect(fromNgReq(ngRequest)).toEqual(expectations[i])
    );
  });
});

describe('toNgReq', () => {
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
