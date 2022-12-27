//= Modules
import cors, { CorsOptions, CorsRequest } from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import logger from 'morgan';
//= Error Handling Middleware
import errorHandlerMiddleware from './middlewares/error.handler.middleware';
//= Types
import { Route } from './types/route.type';

class App {
  public app: express.Application;
  public port: (string | number);
  public api_prefix: string = '/api';
  public isProduction: boolean;
  public whitelistedDomains: string[] = process.env.WHITELISTED_DOMAINS?.split('|') || [''];

  constructor(routes: Route[]) {
    this.app = express();
    this.port = process.env.PORT || 9999;
    this.isProduction = process.env.NODE_ENV === 'production' ? true : false;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log('\x1b[32m%s\x1b[0m', `\n✅ [Server] listening at port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    if (this.isProduction) {
      // Disable etag and x-powered-by
      this.app.disable("etag").disable("x-powered-by");
      // HPP Protect
      this.app.use(hpp());
      // Helmet Protect
      this.app.use(helmet());
      // Cross-Origin Resource Sharing
      this.app.use(cors(this.corsOptionsDelegate));
    } else {
      this.app.use(cors({ origin: true, credentials: true }));
    }

    // Req & Res Compression
    this.app.use(compression());
    // Set Morgan Logger
    this.app.use(logger(':method :url :status - :response-time ms'));
    // Setting JSON in Body Of Requests
    this.app.use(express.json({ limit: '200mb' }));
    this.app.use(express.urlencoded({ limit: '200mb', extended: true }));
  }

  private corsOptionsDelegate(req: CorsRequest, callback: (err: Error | null, options?: CorsOptions) => void): void {
    var corsOptions;

    if (this.whitelistedDomains.indexOf(req.headers.origin as string) > -1) corsOptions = {
      origin: true,
      credentials: true,
    }

    else corsOptions = { origin: false, credentials: true }

    callback(null, corsOptions)
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use(this.api_prefix, route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorHandlerMiddleware);
  }
}

export default App;
