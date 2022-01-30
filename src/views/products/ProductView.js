import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ProductActions} from "../../redux/actions/productActions";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import Roles from "../../auth/Roles";
import ProductsFilterComponent from "../../utils/productsFilterComponent";
import {Card, CardContent, CardActions, CardActionArea, CardMedia, Typography} from "@mui/material";

const ProductView = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.product.products);
    const auth = useSelector(state => state.auth.currentUser);
    const [productsFetched, setProductsFetched] = useState(false)

    const [role, setRole] = useState(Roles.USER);

    useEffect(() => {
        if (auth) {
            setRole(auth.role);
        }
    }, [auth]);

    useEffect(() => {
        dispatch(ProductActions.fetchAllProducts((success, response) => {
            if(Boolean(success)){
                setProductsFetched(true)
            }
        }));
    }, []);

    const handleProductDelete = id => {
        dispatch(ProductActions.deleteProduct(id));
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
                {productsFetched ?
                    <div className={`col-md-3`}>
                        <h4>
                            Filter products
                        </h4>
                        <ProductsFilterComponent products={products} />
                    </div>
                    : null
                }
                <div className={`col-md-9`}>
                    <div className={`row`}>
                        {products && products.map((product, i) => (
                            <div className={`col-md-4 col-sm-6`}>
                                <Card sx={{ maxWidth: 345 }}>
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            height="280"
                                            image={"http://localhost:8080/api/products/images/" + product.id + "/m/main"}
                                            alt="green iguana"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {product.productTitle}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {product.productDescriptionHTML}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    { role === Roles.ADMIN ?
                                        <CardActions>
                                            <Button color="primary"
                                                    component={Link}
                                                    to={`/products/edit/${product.id}`}
                                            >
                                                EDIT
                                            </Button>
                                        </CardActions>
                                        : null
                                    }
                                </Card>
                                <br/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductView;