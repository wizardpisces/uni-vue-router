//copied from https://github.com/vuejs/vue-router/blob/dev/src/util/query.js

import { warn } from './warn';
import { Dictionary } from '../type';

const encodeReserveRE = /[!'()*]/g;
const encodeReserveReplacer = (c: string) => '%' + c.charCodeAt(0).toString(16);
const commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
const encode = (str: any) =>
    encodeURIComponent(str)
        .replace(encodeReserveRE, encodeReserveReplacer)
        .replace(commaRE, ',');

const decode = decodeURIComponent;

export function resolveQuery(
    query?: string,
    extraQuery: Dictionary<string> = {},
    _parseQuery?: Function,
): Dictionary<string> {
    const parse = _parseQuery || parseQuery;
    let parsedQuery;
    try {
        parsedQuery = parse(query || '');
    } catch (e) {
        warn(false, e.message);
        parsedQuery = {};
    }
    for (const key in extraQuery) {
        const val = extraQuery[key];
        parsedQuery[key] = Array.isArray(val) ? val.slice() : val;
    }
    return parsedQuery;
}

function parseQuery(query: string): Dictionary<any> {
    const res: Dictionary<any> = {};

    query = query.trim().replace(/^(\?|#|&)/, '');

    if (!query) {
        return res;
    }

    query.split('&').forEach(param => {
        const parts: any = param.replace(/\+/g, ' ').split('=');
        const key = decode(parts.shift());
        const val = parts.length > 0 ? decode(parts.join('=')) : null;

        if (res[key] === undefined) {
            res[key] = val;
        } else if (Array.isArray(res[key])) {
            res[key].push(val);
        } else {
            res[key] = [res[key], val];
        }
    });

    return res;
}

export function stringifyQuery(obj: Dictionary<string>): string {
    const res = obj
        ? Object.keys(obj)
              .map(key => {
                  const val = obj[key];

                  if (val === undefined) {
                      return '';
                  }

                  if (val === null) {
                      return encode(key);
                  }

                  if (Array.isArray(val)) {
                      const result: any[] = [];
                      val.forEach(val2 => {
                          if (val2 === undefined) {
                              return;
                          }
                          if (val2 === null) {
                              result.push(encode(key));
                          } else {
                              result.push(encode(key) + '=' + encode(val2));
                          }
                      });
                      return result.join('&');
                  }

                  return encode(key) + '=' + encode(val);
              })
              .filter(x => x.length > 0)
              .join('&')
        : null;
    return res ? `?${res}` : '';
}
