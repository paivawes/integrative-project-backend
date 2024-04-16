import { app } from './config/app';

app.listen(process.env.NODE_PORT, async () => {
  console.log('Server on');
});
