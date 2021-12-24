import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ProductActions} from "../../redux/actions/productActions";

const ProductView = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.product.products);

    useEffect(() => {
        dispatch(ProductActions.fetchAllProducts());
    }, []);

    const handleProductDelete = id => {
        dispatch(ProductActions.deleteProduct(id));
    };

    return (
        <div className={`container pt-5`}>
            <div className={`row pb-3 mb-3`}>
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
                            // TODO: Style the cards
                            <div className={`col-md-4 col-sm-6`}>
                                <div className={`card card-width`}>
                                    <img src="" className={`card-img-top`} alt=""/>
                                    <div className={'card-body'}>
                                        <h5 className={`card-title`}>{product.productTitle}</h5>
                                        <p className={`card-text`}>{product.productDescriptionHTML}</p>
                                        <a href="#" className={`btn btn-primary`}>Button action</a>
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
}

export default ProductView;