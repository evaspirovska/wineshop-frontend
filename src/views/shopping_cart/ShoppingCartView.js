import {wrapComponent} from "react-snackbar-alert";
import {useDispatch} from "react-redux";
import {useHistory, useParams} from "react-router";
import {ShoppingCartActions} from "../../redux/actions/shoppingCartActions";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import React, {useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import TableContainer from "@material-ui/core/TableContainer";
import {sortElementsByDateCreated} from "../../utils/utils";

const ShoppingCartView = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const history = useHistory();

    const [shoppingCart, setShoppingCart] = useState(null);
    const [products, setProducts] = useState(null);
    const {username} = useParams();

    useEffect(() => {
        dispatch(ShoppingCartActions.fetchShoppingCart(username, (success, response) => {
            if (success) {
                if (username === response.data.username) {
                    setProducts(sortElementsByDateCreated(response.data.productsInShoppingCart));
                    setShoppingCart(response.data);
                } else {
                    createSnackbar({
                        message: 'Sorry, you must be signed in in order to see your shopping cart.',
                        timeout: 3000,
                        theme: 'error'
                    });
                    history.goBack();
                }
            } else {
                createSnackbar({
                    message: 'Error while accessing shopping cart.',
                    timeout: 2500,
                    theme: 'error'
                });
                history.goBack();
            }
        }));
    }, []);

    const handleDeleteFromCart = productId => {
        dispatch(ShoppingCartActions.deleteFromShoppingCart({
            'productId': productId,
            'username': username
        }, (success, response) => {
            if (success) {
                window.location.reload();
            }
        }));
    };

    const calculateTotalPrice = products => {
        let totalPrice = 0;
        products.map(product => (
            totalPrice += product.priceInMKD
        ))
        return totalPrice;
    }

    return (
        <div className={`container p-5`}>
            <div className={`pb-3 mb-3`}>
                <h3>
                    Shopping Cart
                </h3>
            </div>
            <TableContainer component={Paper}>
                <Table className={``} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left"/>
                            <TableCell align="left">Product</TableCell>
                            <TableCell align="left">Price</TableCell>
                            <TableCell align="left">Quantity</TableCell>
                            <TableCell align="left">Total price</TableCell>
                            <TableCell align="left"/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products && products.map((product, i) => (
                            <TableRow key={product.id}>
                                <TableCell component="th" scope="row" padding="none"
                                           align="center">
                                    <img src={`http://localhost:8080/api/products/images/${product.productId}/s/main`}
                                         alt={`Product IMG`}
                                    />
                                </TableCell>
                                <TableCell align="left">{product.productTitle}</TableCell>
                                <TableCell align="left">{product.priceInMKD}</TableCell>
                                <TableCell align="left">{product.quantity}</TableCell>
                                <TableCell align="left">
                                    {product.priceInMKD * product.quantity} MKD
                                </TableCell>
                                <TableCell align="left">
                                    <Button onClick={() => {
                                        // eslint-disable-next-line no-unused-expressions
                                        (window.confirm('Are you sure you wish to delete this item from the cart?')) ?
                                            handleDeleteFromCart(product.id)
                                            : null
                                    }}>
                                        <HighlightOffIcon/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell align="center">Total:</TableCell>
                            <TableCell/>
                            <TableCell/>
                            <TableCell/>
                            <TableCell align="left">
                                {products && calculateTotalPrice(products)} MKD
                            </TableCell>
                            <TableCell/>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={`pt-3 float-right`}>
                <Button component={Link}
                        color="primary"
                        to={`/products`}
                >
                    Continue shopping
                </Button>
                {
                    products && products.length > 0 ?
                        <Button component={Link}
                                color="primary"
                                variant="contained"
                                to={`/order-form/${username}`}
                                className={`text-white text-decoration-none`}
                        >
                            Checkout
                        </Button>
                        : null
                }
            </div>
        </div>
    );
});

export default ShoppingCartView;