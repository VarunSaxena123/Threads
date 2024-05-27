import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Redirect, withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { useHistory } from 'react-router-dom';

function Product({ product }) {
    const [quantity, setQuantity] = useState(0);

    const handleAddToCart = () => {
        if (quantity > 0) {
            const cartId = JSON.parse(Cookies.get('userCookie'));
            const payload = {
                cart_id: cartId.cart_id,
                product_id: product.p_id,
                quantity: quantity,
            };

            axios
                .post('http://192.168.23.204:3000/', payload)
                .then(response => {
                    console.log('Added to cart:', response.data);
                    setQuantity(0)
                })
                .catch(error => {
                    console.error('Error adding to cart:', error);
                });
        }

    };

    const imagePath = require(`../images/${product.photo_url}`);

    const productItemStyle = {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        marginBottom: '20px',
    };

    const imageContainerStyle = {
        width: '100px',
        marginRight: '20px',
    };

    const productImageStyle = {
        width: '100%',
        height: 'auto',
    };

    const productContentStyle = {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
    };

    const productTextContainerStyle = {
        flex: '1',
    };

    const productNameStyle = {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '5px',
    };

    const productDescriptionStyle = {
        fontSize: '14px',
        color: '#666',
    };

    const addToCartContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10px',
    };

    const quantityInputStyle = {
        width: '50px',
        marginRight: '10px',
    };

    const addToCartButtonStyle = {
        background: 'linear-gradient(to right, #ff9a9e, #fad0c4)',
        border: 'none',
        color: '#fff',
        fontSize: '16px',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    return (
        <div style={productItemStyle}>
            <div style={imageContainerStyle}>
                <img src={imagePath} alt={product.name} style={productImageStyle} />
            </div>
            <div style={productContentStyle}>
                <div style={productTextContainerStyle}>
                    <h3 style={productNameStyle}>{product.p_name}</h3>
                    <p style={productDescriptionStyle}>{product.p_description}</p>
                    <h5 style={productNameStyle}>₹{product.price}</h5>
                </div>
                <div style={addToCartContainerStyle}>
                    <input
                        type="number"
                        value={quantity}
                        min="0"
                        onChange={e => {
                            const value = parseInt(e.target.value);
                            if (value >= 0) {
                                setQuantity(value);
                            } else {
                                setQuantity(0);
                            }
                        }}
                        style={quantityInputStyle}
                    />
                    <button onClick={handleAddToCart} style={addToCartButtonStyle}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}


function ShopPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
            .get('http://192.168.23.204:3000/products')
            .then(response => {
                setProducts(response.data);
                console.log(Cookies.get('userCookie'));
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    const history = useHistory();

    const handleViewCart = () => {
        history.push('/ViewCart');
    };

    const handleLogout = () => {
        Cookies.remove('userCookie');
        history.push('/'); // Redirect to the main page
    };
    

    return (
        <div style={pageContainerStyle}>
            <button onClick={handleViewCart} style={viewCartButtonStyle}>
                View Cart
            </button>
            <button onClick={handleLogout} style={logoutButtonStyle}>
                Logout
            </button>
            <h1 style={pageTitleStyle}>Product List</h1>
            <div style={productListStyle}>
                {products.length > 0 ? (
                    products.map(product => (
                        <Product key={product.id} product={product} />
                    ))
                ) : (
                    <p>Loading products...</p>
                )}
            </div>
        </div>
    );
}

const pageContainerStyle = {
    background: 'linear-gradient(to bottom right, #FFD700, #FFA500)',
    padding: '20px',
};

const pageTitleStyle = {
    textAlign: 'center',
    color: '#fff',
};

const productListStyle = {
    display: 'block',
};

const viewCartButtonStyle = {
    background: 'linear-gradient(to right, #ff9a9e, #fad0c4)',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px',
};

const logoutButtonStyle = {
    background: 'linear-gradient(to right, #ff9a9e, #fad0c4)',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px',
};

export default ShopPage;