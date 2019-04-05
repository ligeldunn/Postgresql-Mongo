CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone_number varchar(255) NOT NULL,
  address1 text NOT NULL,
  address2 text,
  city text NOT NULL,
  state varchar(255) NOT NULL,
  zip varchar(9) NOT NULL
);

CREATE TABLE inventory (
  inventory_id SERIAL PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 0)
);

CREATE TABLE recipes (
  recipe_id SERIAL PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text NOT NULL
);

CREATE TABLE recipe_inventory (
  recipe_id INTEGER NOT NULL,
  inventory_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes,
  FOREIGN KEY (inventory_id) REFERENCES inventory
);

CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
  recipe_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users,
  FOREIGN KEY (recipe_id) REFERENCES recipes
);


