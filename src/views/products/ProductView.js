import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ProductActions} from "../../redux/actions/productActions";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Roles from "../../auth/Roles";
import {ShoppingCartActions} from "../../redux/actions/shoppingCartActions";
import {wrapComponent} from "react-snackbar-alert";
import {useHistory} from "react-router";

const ProductView = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const products = useSelector(state => state.product.products);
    const auth = useSelector(state => state.auth.currentUser);
    const history = useHistory();

    const [role, setRole] = useState(null);

    useEffect(() => {
        if (auth) {
            setRole(auth.role);
        }
    }, [auth]);

    useEffect(() => {
        dispatch(ProductActions.fetchAllProducts());
    }, []);

    const handleProductDelete = id => {
        dispatch(ProductActions.deleteProduct(id));
    };

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

    return (
        <div className={`container p-5`}>
            <div className={`pb-3 mb-3`}>
                {
                    role === Roles.ADMIN ?
                        <Button component={Link}
                                to={'/products/add'}
                                variant="contained" color="primary"
                                className={`text-white text-decoration-none float-right`}
                        >
                            ADD PRODUCT
                        </Button>
                        :
                        null
                }
                {/*TODO Robert: The title should be replaced with category name*/}
                <h3>
                    Products
                </h3>
            </div>
            <div className={`row`}>
                <div className={`col-md-3`}>
                    <div>Filter</div>
                    <div>will be located</div>
                    <div>here</div>
                </div>
                <div className={`col-md-9`}>
                    <div className={`row`}>
                        {products && products.map((product, i) => (
                            <div className={`col-md-4 col-sm-6`}>
                                <div className={`card card-width`}>
                                    <img src={'http://localhost:8080/api/products/images/' + product.id + '/m/main'} className={`card-img-top`} alt=""/>
                                    <div className={'card-body'}>
                                        <h5 className={`card-title`}>{product.productTitle}</h5>
                                        <p className={`card-text`}>{product.productDescriptionHTML}</p>
                                    </div>
                                    <div className={`card-footer`}>
                                        {
                                            role === Roles.ADMIN ? <div>
                                                    <Button component={Link}
                                                            to={`/products/edit/${product.id}`}
                                                            variant="contained" color="primary"
                                                            className={`text-white text-decoration-none`}
                                                    >
                                                        EDIT
                                                    </Button>
                                                </div>
                                                :
                                                null
                                        }
                                        <div>
                                            <button type="button"
                                                    onClick={() => handleAddToCart(product.id)}
                                                    className={`btn btn-success`}
                                            >
                                                Add to cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <br/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ProductView;