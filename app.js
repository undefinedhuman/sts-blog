const app = require("./src/server");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose")

mongoose
    .connect('mongodb://localhost:27017/sts_blog', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Successfully connected to mongodb!')
    }).catch((err) => {
    console.log('Error while connecting to database: ' + err.stack)
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});