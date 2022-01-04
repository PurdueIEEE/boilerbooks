// Import libraries
import 'dotenv/config';
import express, { application } from 'express';
import cors from 'cors';

// Import files
import models, { db_conn } from './models';
import routes from './routes';

// Create Express
const app = express();

// Setup predefined middleware
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}));

// Setup our middleware
app.use((req, res, next) => {
    // If we are attempting to go to the /account or /login endpoints, don't authenticate
    if (req.originalUrl === '/account' || req.originalUrl === '/login') {
        req.context = {
            models,
        };
        next();
    } else {
        // use an API key with the Authorization header
        if (req.headers['x-api-key'] === undefined) {
            return res.status(401).send("Must authenticate first");
        }

        // TODO sanitize api key input
        // TODO validate api key time, force login if key is old
        db_conn.execute(
            "SELECT username FROM Users WHERE Users.apikey = ?",
            [req.headers['x-api-key']],
            function(err, results, fields) {
                if(err) {
                    console.log('MySQL ' + err.stack);
                    return res.status(500).send("Internal Server Error");
                }

                if(results.length === 0) {
                    return res.status(401).send("Invalid API Key");
                }

                req.context = {
                    models,
                    request_user_id: results[0].username,
                };
                next();
            }
        );
    }
});

// Setup our routes
app.all('/', (req, res) => {
    return res.status(405).send({ status: 405, response: "Endpoint not allowed." });
});

app.use('/account', routes.account);
app.use('/budgets', routes.budgets);
app.use('/purchase', routes.purchase);
app.use('/committee', routes.committee);
app.use('/login', routes.login);

// Start and attach app
const server = app.listen(process.env.PORT, () =>
    console.log(`App listening on port ${process.env.PORT}`),
);

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing server');
    server.close(() => {
        console.log('HTTP server closed');
    });
    db_conn.end((err) => {
        console.log('MySQL connection closed');
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing server');
    server.close(() => {
        console.log('HTTP server closed');
    });
    db_conn.end((err) => {
        console.log('MySQL connection closed');
    });
});
