import React, {useEffect, useRef, useState} from "react";
import {Form, Field, FieldArray, Formik, useFormikContext, useFormik} from "formik";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import * as yup from "yup";
import {wrapComponent} from "react-snackbar-alert";
import {useHistory, useParams} from "react-router";
import {ProductActions} from "../../redux/actions/productActions";
import {CategoryActions} from "../../redux/actions/categoryActions";

const validationSchema = yup.object({
    productTitle: yup.string("Enter product title").required("Product title is required"),
    productDescriptionHTML: yup.string("Enter description").required("Description is required"),
    priceInMKD: yup.number("Enter price").required("Price is required").min(0, 'Minimum price is 0 MKD'),
    categoryId: yup.number("Please select cateogry").required("Category is required"),
});

const ProductForm = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const {productId} = useParams();
    const [categories, setCategories] = useState([]);
    const formikRef = useRef(null)

    let initialValues = {
        id: '',
        categoryId: '',
        productTitle: '',
        productDescriptionHTML: '',
        priceInMKD: '',
        valueForProductAttribute: [],
    }

    useEffect(() => {
        if (Boolean(productId)) {
            dispatch(ProductActions.fetchProduct(productId, (success, response) => {
                if (success) {
                    formikRef.current.setFieldValue("id", response.data.id);
                    formikRef.current.setFieldValue("categoryId", response.data.categoryId);
                    formikRef.current.setFieldValue("productTitle", response.data.productTitle);
                    formikRef.current.setFieldValue("productDescriptionHTML", response.data.productDescriptionHTML);
                    formikRef.current.setFieldValue("priceInMKD", response.data.priceInMKD);
                    formikRef.current.setFieldValue("valueForProductAttribute", response.data.valueForProductAttribute);
                } else {
                    if (response.data.message) {
                        alert(response.data.message);
                    } else {
                        alert("Product not found");
                    }
                    history.push("/products");
                }
            }));
        }
        dispatch(CategoryActions.fetchAllCategories((success, response) => {
            if (success) {
                setCategories(response.data);
            } else {
                alert("Error while fetching categories.");
            }
        }));
    }, []);

    function onSubmit(values) {
        Boolean(productId) ? dispatch(
            ProductActions.updateProduct({
                id: values.id,
                categoryId: values.categoryId,
                productTitle: values.productTitle,
                productDescriptionHTML: values.productDescriptionHTML,
                priceInMKD: values.priceInMKD,
            }, (success, response) => {
                createSnackbar({
                    message: success ? 'Successfully Updated Product' : 'Product failed to Update',
                    timeout: 2500,
                    theme: success ? 'success' : 'error'
                });
                success && history.push(`/products/edit/${response.data.id}`);
            })
        ) : dispatch(
            ProductActions.addProduct({
                categoryId: values.categoryId,
                productTitle: values.productTitle,
                productDescriptionHTML: values.productDescriptionHTML,
                priceInMKD: values.priceInMKD,
            }, (success, response) => {
                createSnackbar({
                    message: success ? 'Successfully Created Product' : 'Product failed to Create',
                    timeout: 2500,
                    theme: success ? 'success' : 'error'
                });
                success && history.push(`/products/edit/${response.data.id}`);
            })
        );
    }
    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}
                innerRef={formikRef}>
            {({errors, values, touched, setValues, handleChange}) => (
                <Form className={`container pt-5 w-50`}>
                    <div>
                        <h3>
                            {Boolean(productId) ? 'Edit Product' : 'New Product'}
                        </h3>
                        <TextField
                            fullWidth
                            id="productTitle"
                            name="productTitle"
                            label="Product Title"
                            className={`py-2`}
                            value={values.productTitle}
                            onChange={handleChange}
                            error={touched.productTitle && Boolean(errors.productTitle)}
                            helperText={touched.productTitle && errors.productTitle}
                        />
                        <TextField
                            fullWidth
                            id="productDescriptionHTML"
                            name="productDescriptionHTML"
                            label="Description"
                            multiline
                            rows={5}
                            className={`py-2`}
                            value={values.productDescriptionHTML}
                            onChange={handleChange}
                            error={touched.productDescriptionHTML && Boolean(errors.productDescriptionHTML)}
                            helperText={touched.productDescriptionHTML && errors.productDescriptionHTML}
                        />
                        <div className={`row`}>
                            <div className={`col`}>
                                <TextField
                                    fullWidth
                                    id="priceInMKD"
                                    name="priceInMKD"
                                    label="Price in MKD"
                                    className={`py-2`}
                                    type="number"
                                    value={values.priceInMKD}
                                    onChange={handleChange}
                                    error={touched.priceInMKD && Boolean(errors.priceInMKD)}
                                    helperText={touched.priceInMKD && errors.priceInMKD}
                                />
                            </div>
                            <div className={`col py-2`}>
                                <InputLabel id="label-category">Category</InputLabel>
                                <Select fullWidth
                                        id='categoryId' name='categoryId'
                                        onChange={handleChange}
                                        value={values.categoryId}
                                >
                                    {
                                        categories.map((category, i) => {
                                            return (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                                {touched.categoryId && Boolean(errors.categoryId) ? (
                                    <small className={`redGrade`}>{errors.categoryId}</small>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className={`pt-3 float-left`}>
                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                        >
                            {productId ? "Edit" : "Create"}
                        </Button>
                        <Button
                            color="primary"
                            href={'/products'}
                        >
                            Exit
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
});

export default ProductForm;
