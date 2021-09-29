export default class LocalStorage {
  constructor() {
    this.database = {};
  }

  setItem(key, value) {
    this.database[key] = value;
  }

  getItem(key) {
    return this.database[key];
  }
}
