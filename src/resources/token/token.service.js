const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const tokenRepo = require('./token.db.repository');
const {
  JWT_SECRET_KEY,
  JWT_EXPIRE_TIME,
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_EXPIRE_TIME
} = require('../../common/config');

const refresh = async userId => {
  return getTokens(userId);
};

const getTokens = async userId => {
  const token = jwt.sign({ id: userId }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE_TIME
  });

  const tokenId = uuid();
  const refreshToken = jwt.sign(
    { id: userId, tokenId },
    JWT_REFRESH_SECRET_KEY,
    {
      expiresIn: JWT_REFRESH_EXPIRE_TIME
    }
  );

  await tokenRepo.upsert({
    userId,
    tokenId,
    expire: Date.now() + JWT_REFRESH_EXPIRE_TIME * 1000
  });

  return { token, refreshToken };
};

const upsert = token => tokenRepo.upsert(token);

module.exports = { refresh, getTokens, upsert };
