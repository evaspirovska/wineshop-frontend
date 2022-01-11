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
import {AttributeActions} from "../../redux/actions/attributeActions";
import {CircularProgress} from "@material-ui/core";
import ImageUploadComponent from "../../utils/imageUploadComponent";

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
    const [attributes, setAttributes] = useState([]);
    const [areThereAttributes, setAreThereAttributes] = useState(true);
    const [imageIdsToRemove, setImageIdsToRemove] = useState([]);
    const [images, setImages] = useState({
        images: [],
        mainImage: 0
    });
    const [validateMainImage, setValidateMainImage] = useState(false)
    const [backendWorking, setBackendWorking] = useState(false)
    const formikRef = useRef(null)

    let initialValues = {
        id: '',
        categoryId: '',
        productTitle: '',
        productDescriptionHTML: '',
        priceInMKD: '',
        attributeIdAndValueMap: {},
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
                    formikRef.current.setFieldValue("attributeIdAndValueMap", response.data.attributeIdAndValueMap);
                    dispatch(AttributeActions.fetchAttributesByCategory(response.data.categoryId, (success, response) => {
                        if (success) {
                            setAttributes(response.data);
                        } else {
                            alert("Error while fetching attributes.");
                        }
                    }))
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

    function onChangeCategory(categoryId){
        dispatch(AttributeActions.fetchAttributesByCategory(categoryId, (success, response) => {
            if (success) {
                formikRef.current.setFieldValue("attributeIdAndValueMap", {});
                setAttributes(response.data);
                setAreThereAttributes(response.data.length > 0)
            } else {
                if (response.data) {
                    alert(response.data.message);
                } else {
                    alert("Attribute fetching error!");
                }
                history.push("/products");
            }
        }))
    }

    function deleteProduct(productId){
        if(window.confirm("Are you sure you want to delete this product?")){
            dispatch(ProductActions.deleteProduct(productId))
            history.push("/products");
            window.location.reload();
        }
    }

    function handleImagesChange(imageState){
        setImages(imageState)
    }

    function removeImageRemotely(image_id){
        setImageIdsToRemove([...imageIdsToRemove, image_id])
    }

    function onSubmit(values) {
        var tempImgValuesArray = []
        for(let i=0; i<images.images.length; i++)
            tempImgValuesArray.push(i+1)
        if(images.images.length > 0 && !tempImgValuesArray.includes(images.mainImage)){
            setValidateMainImage(true)
            return;
        }
        else{
            setValidateMainImage(false)
        }
        setBackendWorking(true)
        if(Boolean(productId)){
            let i=0;
            function deleteProductImage(imageId){
                dispatch(
                    ProductActions.deleteProductImage(productId, imageId, (success, response) => {
                        i++
                        if(i<imageIdsToRemove.length)
                            deleteProductImage(imageIdsToRemove[i])
                    })
                )
            }
            deleteProductImage(imageIdsToRemove[i])
        }
        Boolean(productId) ? dispatch(
            ProductActions.updateProduct({
                id: values.id,
                categoryId: values.categoryId,
                productTitle: values.productTitle,
                productDescriptionHTML: values.productDescriptionHTML,
                priceInMKD: values.priceInMKD,
                attributeIdAndValueMap: values.attributeIdAndValueMap
            }, (success, response) => {
                if(success) {
                    if (images.images.length > 0) {
                        setBackendWorking(true);
                        var imagesToUpload = []
                        for(let i=0; i<images.images.length; i++){
                            if(images.images[i] instanceof File){
                                imagesToUpload.push(images.images[i])
                            }
                        }
                        if(imagesToUpload.length === 0){
                            createSnackbar({
                                message: success ? 'Successfully Updated Product' : 'Product failed to Update',
                                timeout: 2500,
                                theme: success ? 'success' : 'error'
                            });
                            setBackendWorking(false)
                        }
                        else{
                            let i=0;
                            function uploadNewImage(imageToUpload){
                                dispatch(
                                    ProductActions.addNewProductImage(productId, imageToUpload, (success2, response) => {
                                        if(!success2){
                                            createSnackbar({
                                                message: 'Image failed to Update',
                                                timeout: 2500,
                                                theme: 'error'
                                            });
                                        }
                                        i++
                                        if(i<imagesToUpload.length){
                                            uploadNewImage(imagesToUpload[i])
                                        }
                                        else{
                                            createSnackbar({
                                                message: success2 ? 'Successfully Updated Product' : 'Product failed to Update',
                                                timeout: 2500,
                                                theme: success2 ? 'success' : 'error'
                                            });
                                            setBackendWorking(false)
                                        }
                                    })
                                )
                            }
                            uploadNewImage(imagesToUpload[i])
                        }
                        if(images.images[images.mainImage-1] instanceof File){
                            createSnackbar({
                                message: 'Please re-select your main product image after images have finished uploading',
                                timeout: 7000,
                                theme: 'warning'
                            });
                        }
                        else{
                            const parts = images.images[images.mainImage-1].split("/")
                            dispatch(
                                ProductActions.setMainProductImage(productId, Number(parts[parts.length - 1].replace(".jpg", "")))
                            )
                        }
                        success && history.push(`/products/edit/${response.data.id}`);
                    } else {
                        createSnackbar({
                            message: success ? 'Successfully Updated Product' : 'Product failed to Update',
                            timeout: 2500,
                            theme: success ? 'success' : 'error'
                        });
                        setBackendWorking(false)
                        success && history.push(`/products/edit/${response.data.id}`);
                    }
                }
            })
        ) : dispatch(
            ProductActions.addProduct({
                categoryId: values.categoryId,
                productTitle: values.productTitle,
                productDescriptionHTML: values.productDescriptionHTML,
                priceInMKD: values.priceInMKD,
                attributeIdAndValueMap: values.attributeIdAndValueMap
            }, (success, response) => {
                if(success) {
                    if (images.images.length > 0) {
                        dispatch(
                            ProductActions.addAllProductImages(response.data.id, images.mainImage, images.images, (success2, response2) => {
                                createSnackbar({
                                    message: success2 ? 'Successfully Created Product' : 'Product failed to Create',
                                    timeout: 2500,
                                    theme: success2 ? 'success' : 'error'
                                });
                                setBackendWorking(false)
                                success2 && history.push(`/products/edit/${response.data.id}`);
                            })
                        )
                    } else {
                        createSnackbar({
                            message: success ? 'Successfully Created Product' : 'Product failed to Create',
                            timeout: 2500,
                            theme: success ? 'success' : 'error'
                        });
                        setBackendWorking(false)
                        success && history.push(`/products/edit/${response.data.id}`);
                    }
                }
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
                                        onChange={change => {
                                            values.categoryId = change.target.value;
                                            onChangeCategory(change.target.value);
                                        }}
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
                        <div className={'row'}>
                            <h4>Attributes</h4>
                        </div>
                        <FieldArray name="attributes">
                            {() => (attributes.map((attribute, i) => {
                                return (
                                    <div key={i} className="list-group list-group-flush">
                                        <div className="list-group-item row">
                                            <div className="form-row row justify-content-between">
                                                <div className="fs-4 col-auto p-0">
                                                    {attributes[i].name + ':'}
                                                </div>
                                                <div className="form-group col-auto">
                                                    <TextField
                                                        className={``}
                                                        fullWidth
                                                        name={`attributeIdAndValueMap[${attribute.id}]`}
                                                        type={attributes[i].numeric ? "number" : "text"}
                                                        onChange={handleChange}
                                                        value={values.attributeIdAndValueMap[attribute.id]}
                                                    />
                                                </div>
                                                <div className="fs-4 col-auto p-0">
                                                    {attributes[i].suffix}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }))}
                        </FieldArray>
                        {
                            areThereAttributes ?  null : "No attributes for this category."
                        }
                        <div className={'row'}>
                            <h4>Images</h4>
                        </div>
                        <ImageUploadComponent
                            handleImagesChange={handleImagesChange}
                            productId={productId ? productId : -1}
                            removeImageRemotely={removeImageRemotely}
                        />
                        {validateMainImage ? <div className={"text-danger"}>Please select the main product image</div> : null}
                        <div className={`pt-3 float-left`}>
                            {backendWorking ? <CircularProgress /> :
                                <Button
                                color="primary"
                                variant="contained"
                                type="submit">
                                {productId ? "Edit" : "Create"}
                            </Button>
                            }
                            {productId && !backendWorking ? <Button
                                color="secondary"
                                variant="contained"
                                onClick={() => deleteProduct(productId)}
                            >
                                Delete Product
                            </Button> : null}
                            {backendWorking ? null :
                                <Button
                                color="primary"
                                href={'/products'}
                            >
                                Exit
                            </Button> }
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
});

export default ProductForm;