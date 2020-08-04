import app from "../app";
const PORT = process.env.PORT || 3000;

app.server.listen(PORT, () => console.log("Listening on port " + PORT));
