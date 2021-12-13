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

    req.context = {
        models
    };
    next();
});

// Setup our routes
app.all('/', (req, res) => {
    return res.status(405).send("Endpoint not allowed.");
})

app.use('/account', routes.account);
app.use('/budgets', routes.budgets);
app.use('/purchase', routes.purchase);

// Start and attach app
app.listen(process.env.PORT, () =>
    console.log(`App listening on port ${process.env.PORT}`),
);
