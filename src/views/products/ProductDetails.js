import {wrapComponent} from "react-snackbar-alert";
import {useHistory, useParams} from "react-router";
import React, {useEffect, useState} from "react";
import {ProductActions} from "../../redux/actions/productActions";
import {useDispatch, useSelector} from "react-redux";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/fontawesome-free-solid';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {ShoppingCartActions} from "../../redux/actions/shoppingCartActions";

const ProductDetails = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const {productId} = useParams();
    const [isLoading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const auth = useSelector(state => state.auth.currentUser);
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (auth) {
            setRole(auth.role);
        }
    }, [auth]);

    useEffect(() => {
        if (Boolean(productId)) {
            dispatch(ProductActions.fetchProduct(productId, (success, response) => {
                if (success) {
                    setProduct(response.data);
                    setLoading(false);
                } else {
                    createSnackbar({
                        message: 'Error getting product details',
                        timeout: 2500,
                        theme: 'error'
                    });
                    history.goBack();
                }
            }));
        }
    }, []);

    const handleAddToCart = id => {
        if (Boolean(role)) {
            dispatch(ShoppingCartActions.addToShoppingCart(auth.username, {
                'productId': id,
                'quantity': 1,
            }, (success, response) => {
                createSnackbar({
                    message: success ? 'Successfully added product to cart.' : 'Failed to add product to cart.',
                    timeout: 2500,
                    theme: success ? 'success' : 'error'
                });
            }))
        } else {
            createSnackbar({
                message: 'Sorry, you must be signed in in order to add items to your shopping cart.',
                timeout: 3000,
                theme: 'error'
            });
        }
    };

    if (isLoading) {
        return (
            <div className={`container pt-5 text-center`}>
                <FontAwesomeIcon icon={faSpinner} size='6x' spin/>
                <h2>Loading</h2>
            </div>
        );
    }
    return (
        <div className={`pt-5`}>
            <div className={`container`}>
                <h2>Product Details</h2>
                <div className={`row`}>
                    <div className={`col-md-5 py-4`}>
                        <img className={`product-details-img-max-width`}
                             src={`http://localhost:8080/api/products/images/${productId}/m/main`}
                             alt={`Product IMG`}/>
                    </div>
                    <div className={`col-md-7`}>
                        <div className={`display-3`}>{product.productTitle}</div>
                        <div className={`display-6 pt-3`}>{product.priceInMKD} MKD</div>
                        <div className={`row pb-2`}>
                            <div className={`col-md-2 pt-5`}>
                                <TextField
                                    fullWidth
                                    id="quantity"
                                    name="quantity"
                                    label="Quantity"
                                    type="number"
                                    value={quantity}
                                    // onChange={handleChange}
                                    // error={touched.quantity && Boolean(errors.quantity)}
                                    // helperText={touched.quantity && errors.quantity}
                                />
                            </div>
                            <div className={`col-md-4 pt-5`}>
                                <Button className={`py-3 px-5`}
                                        color='warning'
                                        variant='contained'
                                        onClick={() => handleAddToCart(productId)}
                                >
                                    Add to cart
                                </Button>
                            </div>
                        </div>
                        <div className={`pt-5`}>
                            Category: {product.categoryName}
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
            <div className={`container`}>
                <div className={`row`}>
                    <div className={`col-md-4`}>
                        <div className={`row ps-4 fw-light`}>
                            DESCRIPTION
                        </div>
                        <div className={`row pt-4`}>
                            {product.productDescriptionHTML}
                        </div>
                    </div>
                    <div className={`col-md-8`}>
                        <div className={`row ps-4 fw-light`}>
                            ADDITIONAL INFORMATION
                        </div>
                        <div className={`row pt-4`}>
                            <table className={`table table-striped table-hover`} aria-label='simple-table'>
                                <tbody>
                                {
                                    Object.entries(product.attributeNameSuffixAndValueMap).map(([key, values]) => {
                                        return (
                                            <tr>
                                                <th scope='row' width='25%'>{key}</th>
                                                <td width='75%'>{values[1]}{values[0]}</td>
                                            </tr>
                                        );
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
})

export default ProductDetails;