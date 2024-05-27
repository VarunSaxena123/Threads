import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';

const ViewCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(JSON.parse(Cookies.get('userCookie')).cart_id);
  const history = useHistory();

  useEffect(() => {
    const userCookie = Cookies.get('userCookie');
    if (userCookie) {
      const parsedCookie = JSON.parse(userCookie);
      const { cart_id } = parsedCookie;
      setCartId(cart_id); // Set the cartId from the cookie
      fetchCartItems(cart_id);
    }
  }, []);

  const fetchCartItems = (cartId) => {
    axios
      .get(`http://192.168.23.204:3000/${cartId}`)
      .then((response) => {
        setCartItems(response.data);
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
      });
  };

  const cartContainerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #fd746c, #ff9068)',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    padding: '20px',
    borderRadius: '5px',
  };

  const backButtonStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: 'linear-gradient(to right, #ff9a9e, #fad0c4)',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const handleBackToShopping = () => {
    history.push('/ShopPage');
  };

  const clearCart = () => {
    axios
      .delete(`http://192.168.23.204:3000/${cartId}`)
      .then((response) => {
        const newCartId = response.data.cart_id;
        setCartId(newCartId);
        const userCookie = JSON.parse(Cookies.get('userCookie'));
        userCookie.cart_id = newCartId;
        Cookies.set('userCookie', JSON.stringify(userCookie));
        setCartItems([]);
        alert('Sucessfull Payment')
      })
      .catch((error) => {
        console.error('Error clearing cart:', error);
      });
  };

  const addButtonStyle = {
    background: 'linear-gradient(to right, #ff9a9e, #fad0c4)',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  };

  const subtractButtonStyle = {
    background: 'linear-gradient(to right, #ff9a9e, #fad0c4)',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <div style={cartContainerStyle}>
      <button onClick={handleBackToShopping} style={backButtonStyle}>
        Back to Shopping
      </button>
      <h1 style={{ textAlign: 'center', color: '#fff' }}>View Cart</h1>
      {cartItems.length > 0 ? (
        <div>
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              cartId={cartId}
              fetchCartItems={fetchCartItems}
              addButtonStyle={addButtonStyle}
              subtractButtonStyle={subtractButtonStyle}
            />
          ))}
          <button onClick={clearCart}>Checkout</button>
        </div>
      ) : (
        <p style={{ color: '#fff' }}>No items in the cart.</p>
      )}
    </div>
  );
};

const CartItem = ({ item, cartId, fetchCartItems, addButtonStyle, subtractButtonStyle }) => {
  const itemContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #ccc',
    paddingBottom: '10px',
  };

  const imageStyle = {
    width: '100px',
    height: 'auto',
    marginRight: '20px',
  };

  const detailsStyle = {
    flex: '1',
  };

  const nameStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#fff',
  };

  const priceStyle = {
    marginBottom: '5px',
    color: '#fff',
  };

  const quantityStyle = {
    marginBottom: '5px',
    color: '#fff',
  };

  const handleAddQuantity = () => {
    axios
      .put(`http://192.168.23.204:3000/basket/add/${item.basket_id}`)
      .then((response) => {
        // Update the cart items after adding quantity
        fetchCartItems(cartId);
      })
      .catch((error) => {
        console.error('Error adding quantity:', error);
      });
  };

  const handleSubtractQuantity = () => {
    axios
      .put(`http://192.168.23.204:3000/basket/subtract/${item.basket_id}`)
      .then((response) => {
        // Update the cart items after subtracting quantity
        fetchCartItems(cartId);
      })
      .catch((error) => {
        console.error('Error subtracting quantity:', error);
      });
  };

  const image_url = require(`../images/${item.photo_url}`);

  return (
    <div style={itemContainerStyle}>
      <img src={image_url} alt={item.p_name} style={imageStyle} />
      <div style={detailsStyle}>
        <h3 style={nameStyle}>{item.p_name}</h3>
        <p style={priceStyle}>
          Total Price: ${(item.price * item.quantity).toFixed(2)}
        </p>
        <p style={quantityStyle}>Quantity: {item.quantity}</p>
        <div>
          <button onClick={handleAddQuantity} style={addButtonStyle}>
            +
          </button>
          <button onClick={handleSubtractQuantity} style={subtractButtonStyle}>
            -
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCart;
