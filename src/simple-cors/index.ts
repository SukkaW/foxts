import { fastStringArrayJoin } from '../fast-string-array-join';

export interface SimpleCorsOptions {
  origin:
    | string
    | string[]
    | ((origin: string) => Promise<string | undefined | null> | string | undefined | null),
  allowMethods?: string[] | ((origin: string) => Promise<string[]> | string[]),
  allowHeaders?: string[],
  maxAge?: number,
  credentials?: boolean,
  exposeHeaders?: string[]
};

/**
 * A very simple CORS implementation for using in simple serverless workers
 *
 * Example usage:
 *
 * ```ts
 * const simpleCors = createSimpleCors({});
 *
 * export function fetch(req: Request) {
 *   if (req.method === 'OPTIONS') {
 *     return simpleCors(req, new Response(null, { status: 204 });
 *   }
 *   const resp = Response.json({ message: 'Hello, world!' });
 *   return simpleCors(req, resp);
 * }
 * ```
 */
export function createSimpleCors(options?: SimpleCorsOptions) {
  const defaults: SimpleCorsOptions = {
    origin: '*',
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };

  let findAllowOrigin: (origin: string) => Promise<string | undefined | null> | string | undefined | null;
  const optsOrigin = opts.origin;
  if (typeof optsOrigin === 'string') {
    if (optsOrigin === '*') {
      findAllowOrigin = () => '*';
    } else {
      findAllowOrigin = (origin: string) => (optsOrigin === origin ? origin : null);
    }
  } else if (typeof optsOrigin === 'function') {
    findAllowOrigin = optsOrigin;
  } else {
    const allowedOrigins = new Set(optsOrigin);
    findAllowOrigin = (origin: string) => (allowedOrigins.has(origin) ? origin : null);
  }

  let findAllowMethods: (origin: string) => Promise<string[]> | string[];
  const optsAllowMethods = opts.allowMethods;
  if (typeof optsAllowMethods === 'function') {
    findAllowMethods = optsAllowMethods;
  } else if (Array.isArray(optsAllowMethods)) {
    findAllowMethods = () => optsAllowMethods;
  } else {
    findAllowMethods = () => [];
  }

  const shouldVaryIncludeOrigin = optsOrigin !== '*';

  return async function simpleCors(request: Request, response: Response): Promise<Response> {
    let allowOrigin = findAllowOrigin(request.headers.get('Origin') || '');
    if (allowOrigin && typeof allowOrigin === 'object' && 'then' in allowOrigin) {
      allowOrigin = await allowOrigin;
    }
    if (allowOrigin) {
      response.headers.set('Access-Control-Allow-Origin', allowOrigin);
    }
    // Suppose the server sends a response with an Access-Control-Allow-Origin value with an explicit origin (rather than the "*" wildcard).
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
    if (shouldVaryIncludeOrigin) {
      const existingVary = request.headers.get('Vary');

      if (existingVary) {
        response.headers.set('Vary', existingVary);
      } else {
        response.headers.set('Vary', 'Origin');
      }
    }
    if (opts.credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    if (opts.exposeHeaders?.length) {
      response.headers.set('Access-Control-Expose-Headers', fastStringArrayJoin(opts.exposeHeaders, ','));
    }

    let allowMethods = findAllowMethods(request.headers.get('origin') || '');
    if ('then' in allowMethods) {
      allowMethods = await allowMethods;
    }
    if (allowMethods.length) {
      response.headers.set('Access-Control-Allow-Methods', fastStringArrayJoin(allowMethods, ','));
    }

    if (request.method === 'OPTIONS') {
      if (opts.maxAge != null) {
        response.headers.set('Access-Control-Max-Age', opts.maxAge.toString());
      }

      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = request.headers.get('Access-Control-Request-Headers');
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        response.headers.set('Access-Control-Allow-Headers', fastStringArrayJoin(headers, ','));
        response.headers.append('Vary', 'Access-Control-Request-Headers');
      }

      // return new Response(null, {
      //   headers: c.res.headers,
      //   status: 204,
      //   statusText: 'No Content'
      // });
    }

    return response;
  };
}
