-- Up
CREATE TABLE IF NOT EXISTS profiles (
  id integer PRIMARY KEY autoincrement,
  name text UNIQUE NOT NULL,
  active integer NOT NULL DEFAULT 0 CHECK (
    active = 0
    OR active = 1
  )
);

CREATE TABLE IF NOT EXISTS reviews (
  id integer PRIMARY KEY autoincrement,
  pull_request_id text NOT NULL,
  date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Down
-- DROP TABLE reviews