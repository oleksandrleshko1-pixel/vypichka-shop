import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// «База даних» — звичайні JSON-файли в папці server/data
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data');
const dbFile = path.join(dir, 'db.json');
const productsFile = path.join(dir, 'products.json');

function ensureDb() {
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({ users: [], orders: [] }, null, 2));
  }
}

export function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
}

export function writeDb(db) {
  ensureDb();
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

export function readProducts() {
  return JSON.parse(fs.readFileSync(productsFile, 'utf8'));
}
