import fs from "fs";
import express from "express";
import cors from "cors";

import { InputError, AuthError } from "./error";
import {
  parseEmailViaToken,
  login,
  logout,
  register,
  save,
  assertGameOwner,
  getUserOwnedGames,
  createGame,
  getGame,
  updateGame,
  deleteGame,
  startGame,
  advanceGame,
  endGame,
  submitPrices,
} from './service';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

const handleErrors = (fn) => async (req, res) => {
  try {
    await fn(req, res);
    // save() server progress
    save();
  } catch (err) {
    if (err instanceof InputError) {
      res.status(400).send({ error: err.message });
    } else if (err instanceof AuthError) {
      res.status(403).send({ error: err.message });
    } else {
      console.log(err);
      res.status(500).send({ error: "System Error" });
    }
  }
};

/**************************************************************************
                                     AUTH
**************************************************************************/

const checkAuth = (fn) => async (req, res) => {
  const email = parseEmailViaToken(req.header("Authorization"));
  await fn(req, res, email);
};

app.post(
  "/login",
  handleErrors(async (req, res) => {
    const { email, password } = req.body;
    const token = await login(email, password);
    return res.json({ token });
  })
);

app.post(
  "/register",
  handleErrors(async (req, res) => {
    const { email, password, name } = req.body;
    const token = await register(email, password, name);
    return res.json({ token });
  })
);

app.post(
  "/logout",
  handleErrors(
    // checkAuth finds the email and subsequently runs following async function
    checkAuth(async (req, res, email) => {
      await logout(email);
      return res.json({});
    })
  )
);

/**************************************************************************
                                     GAME
**************************************************************************/
app.get(
  "/games",
  handleErrors(
    checkAuth(async (req, res, email) => {
      return res.json({ games: await getUserOwnedGames(email) });
    })
  )
);

app.post(
  "/games/new",
  handleErrors(
    checkAuth(async (req, res, email) => {
      return res.json({
        gameId: await createGame(req.body.name, req.body.desc, email),
      });
    })
  )
);

app.get(
  "/games/:gameId",
  handleErrors(
    checkAuth(async (req, res, email) => {
      const { gameId } = req.params;
      await assertGameOwner(email, gameId);
      return res.json(await getGame(gameId));
    })
  )
);

app.put(
  "/games/:gameId",
  handleErrors(
    checkAuth(async (req, res, email) => {
      const { gameId } = req.params;
      const { markets, name, desc, media } = req.body;
      await assertGameOwner(email, gameId);
      await updateGame(gameId, markets, name, desc, media);
      return res.status(200).send({});
    })
  )
);

app.delete(
  "/games/:gameId",
  handleErrors(
    checkAuth(async (req, res, email) => {
      const { gameId } = req.params;
      await assertGameOwner(email, gameId);
      await deleteGame(gameId);
      return res.status(200).send({});
    })
  )
);

app.post(
  "/games/:gameId/start",
  handleErrors(
    checkAuth(async (req, res, email) => {
      const { gameId } = req.params;
      await assertGameOwner(email, gameId);
      const sessionId = await startGame(gameId);
      return res.status(200).send({ sessionId });
    })
  )
);

app.post(
  "/games/:gameId/next",
  handleErrors(
    checkAuth(async (req, res, email) => {
      const { gameId } = req.params;
      await assertGameOwner(email, gameId);
      const stage = await advanceGame(gameId); // Note: right now, stage is a dictionary
      return res.status(200).send({ stage });
    })
  )
);

app.post(
  "/games/:gameId/end",
  handleErrors(
    checkAuth(async (req, res, email) => {
      const { gameId } = req.params;
      await assertGameOwner(email, gameId);
      await endGame(gameId);
      return res.status(200).send({});
    })
  )
);

/**************************************************************************
                                  PLAY
**************************************************************************/
// may want to remove game/:gameId param in favour of a helper function
app.put(
  '/games/:gameId/play/:teamId/prices',
  handleErrors(async (req, res) => { // no auth because temporary user?
    const { teamId, gameId } = req.params;
    const { ask, bid } = req.body;
    await submitPrices(teamId, gameId, ask, bid);
    return res.status(200).send({});
}));


/**************************************************************************
                                  SERVER
**************************************************************************/
// app.get('/', (req, res) => res.redirect('/docs'));

// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const configData = JSON.parse(fs.readFileSync("../frontend/src/config.json"));
const port = "BACKEND_PORT" in configData ? configData.BACKEND_PORT : 5000;
const server = app.listen(port, () => {
  console.log(`Backend is now listening on port ${port}!`);
  // console.log(`For API docs, navigate to http://localhost:${port}`);
});

export default server;
