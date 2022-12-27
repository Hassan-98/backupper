//= Load Environment Variables
import 'dotenv/config';
//= Application
import App from './app';
//= Routes
import StatusRoute from './routes/status.route';
import TasksRoute from './routes/tasks.route';
//= Validate Config Vars
import validateConfigVars from './configs/app.config';

// Validate Config Vars
validateConfigVars();

// Init New Application
const app = new App([
  new StatusRoute(),
  new TasksRoute()
]);

// Start The App
app.start();

export default app;
