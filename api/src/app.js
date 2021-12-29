// Import libraries
import 'dotenv/config';
import express, { application } from 'express';
import cors from 'cors';

// Import files
import models from './models';
import routes from './routes';

// Create Express
const app = express();

// Setup predefined middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}));

// Setup our middleware
app.use((req, res, next) => {
    // TODO authentication check here
    // use an API key with the Authorization header
    req.context = {
        models,
        request_user_id: '1',
    };
    next();
});

// Setup our routes
app.all('/', (req, res) => {
    return res.status(405).send({ status: 405, response: "Endpoint not allowed." });
});

app.use('/account', routes.account);
app.use('/budgets', routes.budgets);
app.use('/purchase', routes.purchase);
app.use('/committee', routes.committee);

// Start and attach app
const server = app.listen(process.env.PORT, () =>
    console.log(`App listening on port ${process.env.PORT}`),
);

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    })
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    })
});
