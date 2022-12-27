import { Router } from 'express';

export type Route = {
  path: string;
  router: Router;
}