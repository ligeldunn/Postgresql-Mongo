CREATE OR REPLACE FUNCTION add_order(
  _email       text,
  _recipe_name text)
  RETURNS boolean AS $$
DECLARE
  _the_user_id   integer;
  _the_recipe_id integer;
  _inventory_quantity integer;
  _ingredient recipe_inventory%rowtype;
BEGIN
  SELECT user_id
  INTO _the_user_id
  FROM users u
  WHERE u.email = _email
  LIMIT 1;

  SELECT recipe_id
  INTO _the_recipe_id
  FROM recipes r
  WHERE r.name = _recipe_name
  LIMIT 1;

  FOR _ingredient IN SELECT *
                    FROM recipe_inventory ri
                    WHERE ri.recipe_id = _the_recipe_id
  LOOP
    SELECT quantity
    INTO _inventory_quantity
    FROM inventory i
    WHERE i.inventory_id = _ingredient.inventory_id;

    UPDATE inventory SET quantity = _inventory_quantity - _ingredient.quantity
    WHERE inventory_id = _ingredient.inventory_id;
  END LOOP;

  INSERT INTO orders(user_id, recipe_id) VALUES (_the_user_id, _the_recipe_id);

  RETURN true;
END;
$$
LANGUAGE plpgsql;
