const app = require("express")();
const bodyParser = require("body-parser");
const cors = require('cors');
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api", require("./controllers/userController"));

app.listen( PORT, () => {
	console.log(`Server running at port ${PORT}`);
});
