import fs from 'fs';
import express from 'express';
import cors from 'cors';

import { InputError, AuthError } from './error';
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
  teamJoin,
  setTeamBidAsk,
  sessionStatus,
  assertSessionOwner,
  trade,
  calculateResults,
  fetchSessionHistory,
  setWinningTeams,
  updateTrueValues,
} from './service';
import { BACKEND_PORT } from '../../frontend/src/constants';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));

// // debugging
// app.use((req, res, next) => {
//   console.log(req.originalUrl);
//   // console.log(res)
//   next();
// });

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
      res.status(500).send({ error: 'System Error' });
    }
  }
};

/**************************************************************************
                                     AUTH
**************************************************************************/

const checkAuth = (fn) => async (req, res) => {
  const email = parseEmailViaToken(req.header('Authorization'));
  await fn(req, res, email);
};

app.post(
  '/login',
  handleErrors(async (req, res) => {
    const { email, password } = req.body;
    const token = await login(email, password);
    return res.json({ token });
  })
);

app.post(
  '/register',
  handleErrors(async (req, res) => {
    const { email, password, name } = req.body;
    const token = await register(email, password, name);
    return res.json({ token });
  })
);

app.post(
  '/logout',
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
  '/games',
  handleErrors(
    checkAuth(async (req, res, email) => {
      return res.json({ games: await getUserOwnedGames(email) });
    })
  )
);

app.post(
  '/games/new',
  handleErrors(
    checkAuth(async (req, res, email) => {
      return res.json({
        gameId: await createGame(req.body.name, req.body.desc, email),
      });
    })
  )
);

app.get(
  '/games/:gameId',
  handleErrors(
    checkAuth(async (req, res, email) => {
      const { gameId } = req.params;
      await assertGameOwner(email, gameId);
      return res.json(await getGame(gameId));
    })
  )
);

app.put(
  '/games/:gameId',
  handleErrors(
    checkAuth(async (req, res, email) => {
      const { gameId } = req.params;
      const { sections, name, desc, media } = req.body;
      await assertGameOwner(email, gameId);
      await updateGame(gameId, sections, name, desc, media);
      return res.status(200).send({});
    })
  )
);

app.delete(
  '/games/:gameId',
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
  '/games/:gameId/start',
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
  '/games/:gameId/next',
  handleErrors(
    checkAuth(async (req, res, email) => {
      const { gameId } = req.params;
      await assertGameOwner(email, gameId);
      const stage = await advanceGame(gameId);
      return res.status(200).send({ stage });
    })
  )
);

app.post(
  '/games/:gameId/end',
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

app.get(
  '/admin/session/:sessionId/status',
  handleErrors(
    checkAuth(async (req, res, email) => {
      const { sessionId } = req.params;
      await assertSessionOwner(email, sessionId);
      return res.status(200).json({ status: sessionStatus(sessionId) });
    })
  )
);

app.post(
  '/admin/:gameId/session/:sessionId/results',
  handleErrors(
    checkAuth(async (req, res, email) => {
      const { sessionId } = req.params;
      await assertSessionOwner(email, sessionId);
      await calculateResults(gameId, sessionId);
      return res.status(200).json({});
    })
  )
);

app.post(
  '/game/join/:sessionId',
  handleErrors(async (req, res) => {
    const { sessionId } = req.params;
    const { name } = req.body;
    const teamId = await teamJoin(name, sessionId);
    return res.status(200).send({ teamId });
  })
);

app.put(
  '/game/:teamId/submit',
  handleErrors(async (req, res) => {
    const { teamId } = req.params;
    const { bid, ask, marketIndex } = req.body;
    await setTeamBidAsk(teamId, bid, ask, marketIndex);
    return res.status(200).send({ status: 200 });
  })
);

app.get(
  '/session/:sessionId/status',
  handleErrors(async (req, res) => {
    const { sessionId } = req.params;
    return res.status(200).json(sessionStatus(sessionId, true));
  })
);

app.post(
  '/session/:sessionId/trade',
  handleErrors(async (req, res) => {
    const { sessionId } = req.params;
    const { marketPos } = req.body;
    await trade(sessionId, marketPos);
    return res.status(200).json({});
  })
);

app.post(
  '/session/:sessionId/truevalue',
  handleErrors(async (req, res) => {
    const { sessionId } = req.params;
    const { trueValues } = req.body;
    await updateTrueValues(sessionId, trueValues);
    return res.status(200).json({});
  })
);

/**************************************************************************
                                  HISTORY
**************************************************************************/
app.get(
  '/history/:sessionId',
  handleErrors(async (req, res) => {
    const { sessionId } = req.params;
    const sessionData = await fetchSessionHistory(sessionId);
    return res.status(200).json(sessionData);
  })
);
app.post(
  '/session/:sessionId/result',
  handleErrors(async (req, res) => {
    const { sessionId } = req.params;
    const { position, teamId, marketIndex, isWinner } = req.body;
    await setWinningTeams(position, sessionId, teamId, marketIndex, isWinner);
    return res.status(200).json({});
  })
);

/**************************************************************************
                                  SERVER
**************************************************************************/
// app.get('/', (req, res) => res.redirect('/docs'));

// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || BACKEND_PORT; // env.PORT is for Heroku
const server = app.listen(port, () => {
  console.log(`Backend is now listening on port ${port}!`);
  // console.log(`For API docs, navigate to http://localhost:${port}`);
});

export default server;
