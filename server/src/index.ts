import 'dotenv/config';
import express from "express";
import cors from "cors";
import gameRouter from "./routes/game";
import searchRouter from "./routes/search";
import githubSearchRouter from "./routes/githubSearch";

const app = express();
const port = process.env.PORT || 9091;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/v1', gameRouter);
app.use('/api/v1', searchRouter);
app.use('/api/v1', githubSearchRouter);

// Health check
app.get('/api/v1/health', (req, res) => {
  console.log('Health check success');
  res.status(200).json({ status: 'ok' });
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/`);
});
