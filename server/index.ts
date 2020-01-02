import express from 'express';
import path from 'path';
// import PgPool from './db';
import handlers from './handlers';

const salt = process.env.SG_SALT;

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;
const app = express();

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
app.use(express.json());

// All remaining requests return the React app, so it can handle routing.
handlers(app);
app.get('*', function (_req, res) {
  res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

// catch all errors
app.use(function (err: any, _req: express.Request, res: express.Response, _next: any) {
  res.status(err.status || 500).json({ code: err.code, context: err.context, data: err.data })
});

app.listen(PORT, function () {
  console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`);
});
