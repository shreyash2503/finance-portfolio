import express from 'express';

const app = express();


app.listen(process.env.port, () => {
    console.log(`Server is running on port ${process.env.port}`);
})