export class InputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InputError';
  }
}

export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
  }
}