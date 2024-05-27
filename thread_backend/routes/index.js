var express = require('express');
var router = express.Router();
var axios = require('axios');

var pool = require('./pool');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/check-malicious', async (req, res) => {
  try {
    const { query } = req.body;

    const response = await axios.post('http://localhost:5000/check_malicious', {
      query: query
    });

    if (response.status === 200) {
      const data = response.data;
      res.json({ is_malicious: data.is_malicious });
    } else {
      throw new Error('Failed to check site for maliciousness.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/products', (req, res) => {
  pool.query('SELECT * FROM products ORDER BY p_id', (error, results) => {
    if (error) {
      console.error('Error retrieving products:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results.rows);
    }
  });
});

// Add item to basket
router.post('/', (req, res) => {
  console.log(req.body);
  const { cart_id, product_id, quantity } = req.body;
  pool.query(
    `INSERT INTO basket (cart_id, product_id, quantity) 
     VALUES ($1, $2, $3)
     ON CONFLICT (cart_id, product_id)
     DO UPDATE SET quantity = basket.quantity + EXCLUDED.quantity
     RETURNING basket_item_id`,
    [cart_id, product_id, quantity],
    (error, results) => {
      if (error) {
        console.error('Error adding item to basket:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        const basketItemId = results.rows[0].basket_item_id;
        res.status(201).send(`Item added to basket with ID: ${basketItemId}`);
      }
    }
  );
});

// Subtract 1 from the quantity of an item in the basket
router.put('/basket/subtract/:basket_item_id', (req, res) => {
  const { basket_item_id } = req.params;
  
  pool.query(
    'UPDATE basket SET quantity = quantity - 1 WHERE basket_item_id = $1 RETURNING quantity',
    [basket_item_id],
    (error, results) => {
      if (error) {
        console.error('Error subtracting quantity:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        const updatedQuantity = results.rows[0].quantity;
        if (updatedQuantity <= 0) {
          // If quantity is zero or less, remove the item from the basket
          pool.query(
            'DELETE FROM basket WHERE basket_item_id = $1',
            [basket_item_id],
            (error) => {
              if (error) {
                console.error('Error removing item from basket:', error);
                res.status(500).json({ error: 'Internal server error' });
              } else {
                res.status(200).json({ message: 'Item removed from basket' });
              }
            }
          );
        } else {
          res.status(200).json({ message: 'Quantity subtracted' });
        }
      }
    }
  );
});

// Add 1 to the quantity of an item in the basket
router.put('/basket/add/:basket_item_id', (req, res) => {
  const { basket_item_id } = req.params;
  
  pool.query(
    'UPDATE basket SET quantity = quantity + 1 WHERE basket_item_id = $1 RETURNING quantity',
    [basket_item_id],
    (error, results) => {
      if (error) {
        console.error('Error adding quantity:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        const updatedQuantity = results.rows[0].quantity;
        res.status(200).json({ message: 'Quantity added', quantity: updatedQuantity });
      }
    }
  );
});

// Print items in basket
router.get('/:cart_id', (req, res) => {
  const cart_id = req.params.cart_id;
  console.log(cart_id);
  pool.query('SELECT u.user_name, p.photo_url, p.p_name, p.price, b.basket_item_id as basket_id, b.quantity FROM users u INNER JOIN userbasket ub ON u.u_id = ub.u_id INNER JOIN basket b ON ub.cart_id = b.cart_id INNER JOIN products p ON b.product_id = p.p_id WHERE b.cart_id = $1 ORDER BY b.basket_item_id', [cart_id], (error, results) => {
    if (error) {
      console.error('Error adding item to basket:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json(results.rows);
    }
  });
});

// Clear basket
router.delete('/:cart_id', (req, res) => {
  const cart_id = req.params.cart_id;
  pool.query('UPDATE userbasket SET is_active = false WHERE cart_id = $1 RETURNING *', [cart_id], (error, results) => {
    if (error) {
      console.error('Error adding item to basket:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // Create a new userbasket record with is_active=true for the user
      const u_id = results.rows[0].u_id;
      pool.query('INSERT INTO userbasket (u_id, is_active) VALUES ($1, true) RETURNING cart_id', [u_id], (error, results) => {
        if (error) {
          throw error;
        } else {
          console.log(results.rows);
          data = {
            cart_id: results.rows[0].cart_id
          }
          res.status(200).send(data);
        }
      });
    }
    
  });
});

module.exports = router;
