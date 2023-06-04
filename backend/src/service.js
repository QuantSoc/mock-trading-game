import fs from "fs";
import jwt from "jsonwebtoken";
import AsyncLock from "async-lock";
import { InputError, AuthError } from "./error";

const lock = new AsyncLock();

const JWT_SECRET = "abraCadabraDoo";
const DATABSE = "./database.json";

/**************************************************************************
                                SERVER STATE
**************************************************************************/

let users = {};
let games = {};
let sessions = {};

const update = (users, games, sessions) =>
  new Promise((resolve, reject) => {
    lock.acquire("saveData", () => {
      try {
        fs.writeFileSync(
          DATABSE,
          JSON.stringify({ users, games, sessions }, null, 4)
        );
        resolve();
      } catch {
        reject(new Error("Database update failed"));
      }
    });
  });

export const save = () => update(users, games, sessions);

export const reset = () => {
  update({}, {}, {});
  users = {};
  games = {};
  sessions = {};
};

try {
  const data = JSON.parse(fs.readFileSync(DATABSE));
  users = data.users;
  games = data.games;
  sessions = data.sessions;
} catch {
  console.log("Database not found, generating new one.");
  save();
}

/**************************************************************************
                                  HELPERS
**************************************************************************/
const copy = (x) => JSON.parse(JSON.stringify(x));
// const userLock = function (callback) {
//   return new Promise((resolve, reject) => {
//     lock.acquire('userAuthLock', callback(resolve, reject));
//   })
// }
export const userLock = (callback) =>
  new Promise((resolve, reject) => {
    lock.acquire("userAuthLock", callback(resolve, reject));
  });

export const gameLock = (callback) =>
  new Promise((resolve, reject) => {
    lock.acquire("gameLock", callback(resolve, reject));
  });

export const sessionLock = (callback) =>
  new Promise((resolve, reject) => {
    lock.acquire("sessionLock", callback(resolve, reject));
  });

const randomNumber = (max) =>
  Math.round(
    Math.random() * (max - Math.floor(max / 10)) + Math.floor(max / 10)
  );

const generateRandomId = (currIds, max = 999999999) => {
  let randNum = randomNumber(max);
  while (currIds.includes(randNum)) {
    randNum = randomNumber(max);
  }
  return randNum.toString();
};

const newSessionId = () => generateRandomId(Object.keys(sessions), 999999);
const newGameId = () => generateRandomId(Object.keys(games));
const newTeamId = () =>
  generateId(Object.keys(sessions).map((s) => Object.keys(sessions[s].teams)));

/**************************************************************************
                                AUTH FUNCTIONS
**************************************************************************/

export const parseEmailViaToken = (authHeader) => {
  try {
    const token = authHeader.split(" ")[1];
    const { email } = jwt.verify(token, JWT_SECRET);
    if (!(email in users)) {
      throw new AuthError("Invalid Token");
    }
    return email;
  } catch {
    throw new AuthError("Invalid Token");
  }
};

export const login = (email, password) =>
  userLock((resolve, reject) => {
    if (email in users && users[email].password === password) {
      users[email].isActive = true;
      resolve(jwt.sign({ email }, JWT_SECRET, { algorithm: "HS256" }));
    }
    reject(new InputError("Invalid Credentials"));
  });

export const logout = (email) =>
  userLock((resolve, reject) => {
    users[email].isActive = false;
    resolve();
  });

export const register = (email, password, username) =>
  userLock((resolve, reject) => {
    email in users
      ? reject(new InputError("Email already in use"))
      : (users[email] = {
          username,
          password,
          isActive: true,
        });
    const token = jwt.sign({ email }, JWT_SECRET, { algorithm: "HS256" });
    resolve(token);
  });

/**************************************************************************
                              GAME FUNCTIONS
**************************************************************************/

const newGamePayload = (name, desc, owner) => ({
  name,
  desc,
  owner,
  markets: [],
  active: null,
  createdAt: new Date().toISOString(),
});

export const assertGameOwner = (email, gameId) =>
  gameLock((resolve, reject) => {
    if (!(gameId in games)) {
      reject(new InputError("Game not found"));
    } else if (games[gameId].owner !== email) {
      reject(new InputError("You are not the owner of this game"));
    } else {
      resolve();
    }
  });

export const getUserOwnedGames = (email) =>
  gameLock((resolve, reject) => {
    resolve(
      Object.keys(games)
        .filter((gameId) => games[gameId].owner === email)
        .map((gameId) => ({
          id: parseInt(gameId, 10),
          name: games[gameId].name,
          owner: games[gameId].owner,
          active: getActiveGameSessionId(gameId),
          // oldSessions: getInactiveSessionsIdFromQuizId(quizId),
          createdAt: games[gameId].createdAt,
        }))
    );
  });

export const createGame = (name, desc, email) =>
  gameLock((resolve, reject) => {
    if (name === undefined) {
      reject(new InputError("Please give this quiz a name"));
    } else {
      const newId = newGameId();
      games[newId] = newGamePayload(name, desc, email);
      resolve(games[name]);
    }
  });

export const getGame = (gameId) =>
  gameLock((resolve, reject) => {
    resolve({
      ...games[gameId], // destructures all the game object entries
      active: getActiveGameSessionId(gameId),
      // oldSessions: getInactiveSessionsIdFromQuizId(quizId),
    });
  });

export const updateGame = (gameId, markets, name, desc, media) =>
  gameLock((resolve, reject) => {
    markets && (games[gameId].markets = markets);
    name && (games[gameId].name = name);
    desc && (games[gameId].desc = desc);
    media && (games[gameId].media = media);
    resolve();
  });

export const deleteGame = (gameId) =>
  gameLock((resolve, reject) => {
    delete games[gameId];
  });

export const startGame = (gameId) =>
  gameLock((resolve, reject) => {
    if (gameHasActiveSession(gameId)) {
      return reject(new InputError("Game already started"));
    } else {
      const id = newSessionId();
      sessions[id] = newSessionPayload(gameId);
      resolve(id);
    }
  });

export const advanceGame = (gameId) =>
  gameLock((resolve, reject) => {
    const session = getActiveGameSession(gameId);
    if (!session.active) {
      return reject(new InputError("Game not started"));
    }
    updatePortfolios(gameId, session.currQuestion);

    const totalQuestions = session.questions.length;
    session.position += 1;
    if (session.position >= session.questions[currQuestion].length) {
      // go to start of next question
      session.currQuestion += 1;
      session.position = 0;
    }
    session.answerAvailable = false;
    session.isoTimeLastQuestionStarted = new Date().toISOString();
    if (session.currQuestion >= totalQuestions) {
      endGame(gameId);
    }

    resolve({ 
      currQuestion: session.currQuestion,
      position: session.position,
    });
  });

export const endGame = (gameId) =>
  gameLock((resolve, reject) => {
    const session = getActiveGameSession(gameId);
    session.active = false;
    resolve();
  });

/**************************************************************************
                            SESSION FUNCTIONS
**************************************************************************/

const newSessionPayload = (gameId) => ({
  gameId,
  currQuestion: -1,
  position: -1,
  // isoTimeLastQuestionStarted: null,
  teams: {},
  questions: copy(games[gameId].markets),
  active: true,
  answerAvailable: false,
});

const gameHasActiveSession = (gameId) =>
  Object.keys(sessions).filter(
    (session) => sessions[session].gameId === gameId && sessions[session].active
  ).length > 0;

const getActiveGameSessionId = (gameId) => {
  const activeSessions = Object.keys(sessions).filter(
    (s) => sessions[s].gameId === gameId && sessions[s].active
  );
  if (activeSessions.length === 1) {
    return parseInt(activeSessions[0], 10);
  }
  return null;
};

const getActiveGameSession = (gameId) => {
  if (!gameHasActiveSession(gameId)) {
    throw new InputError("Game session inactive");
  }
  const sessionId = getActiveGameSessionId(gameId);
  return sessionId !== null ? sessions[sessionId] : null;
};

const getInactiveGameSessons = (gameId) => {
  Object.keys(sessions)
    .filter(
      (seshId) => sessions[seshId].gameId === gameId && !sessions[seshId].active
    )
    .map((seshId) => parseInt(seshId, 10));
};

export const submitPrices = (teamId, gameId, ask, bid) => sessionLock((resolve, reject) => {
  if (ask === undefined || bid === undefined) {
    return reject(new InputError('Prices must be provided'));
  } else {
    const session = getActiveGameSession(gameId);
    if (session.position === -1 || session.currQuestion === -1) {
      return reject(new InputError('Session has not started yet'));
    } else if (session.answerAvailable) {
      return reject(new InputError('Can\'t answer question once answer is available'));
    } else {
      session.teams[teamId].answers[session.currQuestion][session.position] = {
        questionStartedAt: session.isoTimeLastQuestionStarted,
        answeredAt: new Date().toISOString(),
        ask: parseFloat(ask),
        bid: parseFloat(bid),
      };
      resolve();
    }
  }
});

const updatePortfolios = (gameId, currQuestion) => sessionLock((resolve, reject) => {
  // Question <=> Market (equivalent)
  const session = getActiveGameSession(gameId);
  for (const team of Object.keys(session.teams)) { // team <=> teamId
    const portfolio = session.teams[team].portfolio;
    const bid = session.teams[team].answers[currQuestion].bid;
    // const ask = session.teams[team].answers[currQuestion].ask;

    for (const team of Object.keys(session.teams)) {
      const portfolio2 = session.teams[team].portfolio;
      // const bid2 = session.teams[team].answers[currQuestion].bid;
      const ask2 = session.teams[team].answers[currQuestion].ask;
      if (bid >= ask2) {
        portfolio.cash -= (bid + ask2) / 2;
        portfolio.contracts[currQuestion] += 1;
        portfolio2.cash += (bid + ask2) / 2;
        portfolio2.contracts[currQuestion] -= 1;
      }
      // if (bid2 >= ask) {
      //   portfolio2.cash -= (bid2 + ask) / 2;
      //   portfolio2.contracts[currQuestion] += 1;
      //   portfolio.cash += (bid2 + ask) / 2;
      //   portfolio.contracts[currQuestion] -= 1;
      // }
    }
  }

});

// TODO: evaluatePortfolios

// TODO: getPortfolio
export const getPortfolio = (teamId, gameId) => sessionLock((resolve, reject) => {
  const session = getActiveGameSession(gameId);
  if (session.position === -1 || session.currQuestion === -1) {
    return reject(new InputError('Session has not started yet'));
  } 
  if (session.questions[session.currQuestion].trueValue === undefined) {
    return reject(new InputError('True value not available yet'));
  }
  // TODO: if portfolio has not been updated yet, update it?? when/where should <-- this be done?
  resolve(session.teams[teamId].portfolio);
});

// TODO: submitMarketValue
export const submitTrueValue = (teamId, gameId, trueValue) => sessionLock((resolve, reject) => {
  if (trueValue === undefined) { 
    return reject(new InputError('true value must be provided'));
  } else {
    const session = getActiveGameSession(gameId);
    if (session.position === -1 || session.currQuestion === -1) {
      return reject(new InputError('Session has not started yet'));
    } else if (session.answerAvailable) {
      return reject(new InputError('Can\'t answer question once answer is available'));
    } else {
      session.questions[session.currQuestion][session.position].trueValue = parseFloat(trueValue);
      resolve();
    }
  }
});
    

const newTeamPayload = (teamId, numMarkets) => ({
  teamName,
  portfolio: {
    cash: 0,
    contracts: new Array(numMarkets).fill(0), // index by question/market number. 
                                              // contracts[1] = #contracts owned of the 2nd market
  },
});
