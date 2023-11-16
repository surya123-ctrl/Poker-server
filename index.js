const express = require('express');
const app = express();
const PORT = 8000;

app.get('/', (req, res) => {
    res.json({ message: "Hello" })
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})