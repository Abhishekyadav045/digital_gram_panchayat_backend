// require('dotenv').config();               // Load .env variables
require('dotenv').config({ debug: false });

const express = require('express');
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mailRoutes = require("./routes/mailRoutes");







/* ---------- MongoDB CONNECTION ---------- */
mongoose.set('strictQuery', false);
mongoose.Promise = global.Promise;

if (!process.env.MONGO_URI) {
    throw new Error(' MONGO_URI is not defined in .env');
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(' MongoDB connected'))
    .catch(err => {

        console.error("FULL ERROR:");
        console.error(err);
        process.exit(1);
    });




/* ---------- GLOBAL MIDDLEWARE ---------- */
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/api", mailRoutes);
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(__dirname)); // for uploads data in foldfer
app.use("/uploads", express.static("uploads"));




/* ---------- ROUTES ---------- */
// app.use('/api', require('./routes/blogRoutes'));
// app.use('/api', require('./routes/categoryRoutes'));
app.use('/api', require('./routes/userRoutes'));
app.use("/api", require("./routes/complaintRoutes"));
app.use("/api", require("./routes/contactRoutes"));








/* ---------- START SERVER ---------- */
const PORT = process.env.PORT;
if (!PORT) {
    throw new Error(' PORT is not defined in .env');
}

app.listen(PORT, () =>
    console.log(` Server running → http://localhost:${PORT}`)
);



/* ---------- ERROR HANDLERS ---------- */
app.use((req, res, next) => {
    setImmediate(() => next(new Error('Route not found')));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).send(err.message);
});




