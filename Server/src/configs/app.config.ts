import { cleanEnv, str, port } from 'envalid';

interface EnvironmentVariables {
  PORT: number;
  NODE_ENV: string;
  WHITELISTED_DOMAINS: string;
  isProduction: boolean;
}

const ENV = (): EnvironmentVariables => cleanEnv(process.env, {
  PORT: port(),
  NODE_ENV: str(),
  WHITELISTED_DOMAINS: str(),
});


export default ENV;
