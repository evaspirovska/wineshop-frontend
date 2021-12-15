import React, {useEffect, useState} from "react";
import {useFormik, getIn} from "formik";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import {useDispatch} from "react-redux";
import * as yup from "yup";
import {wrapComponent} from "react-snackbar-alert";
import {useHistory, useParams} from "react-router";
import IconButton from "@material-ui/core/IconButton";
import {CategoryActions} from "../../../redux/actions/categoryActions";
import {AttributeActions} from "../../../redux/actions/attributeActions";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const validationSchema = yup.object({
    name: yup.string("Enter Category").required("Category is required")
});

const CategoryForm = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const {categoryId} = useParams();
    const [category, setCategory] = useState({name: ""});
    const [attributesAndTextFields, setAttributesAndTextFields] = useState({
        attributes: [{
            id: -1,
            name: "",
            suffix: "",
            categoryId: -1,
            isNumeric: false
        }],
        textFields: []
    })

    const initialValues = {
        name: category.name,
        attributes: attributesAndTextFields.attributes
    };

    useEffect(() => {
        if (Boolean(categoryId)) {
            dispatch(CategoryActions.fetchCategory(categoryId, (success, response) => {
                if (Boolean(success)) {
                    setCategory(response.data)
                    dispatch(AttributeActions.fetchAttributesByCategory(categoryId, (success, response) => {
                        if(Boolean(success)){
                            let temp = response.data
                            temp.push({
                                id: -1,
                                name: "",
                                suffix: "",
                                categoryId: -1,
                                isNumeric: true
                            })
                            let prevState = {...attributesAndTextFields}
                            prevState.attributes = temp
                            setAttributesAndTextFields(prevState)
                        }
                        else {
                            createSnackbar({
                                message: 'Attributes fetching error!',
                                timeout: 2500,
                                theme: 'error'
                            });
                        }
                    }))
                } else {
                    createSnackbar({
                        message: 'Category not found!',
                        timeout: 2500,
                        theme: 'error'
                    });
                    history.goBack();
                }
            }));
        }
    }, []);

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: values => {
            if (categoryId) {
                dispatch(
                    CategoryActions.updateCategory(categoryId, values, success => {
                        createSnackbar({
                            message: success ? "Successfully Updated Category" : "Category failed to Update",
                            timeout: 2500,
                            theme: success ? "success" : "error",
                        });
                    })
                );
            } else {
                dispatch(
                    CategoryActions.addCategory(values, (success, response) => {
                        createSnackbar({
                            message: success ? "Successfully created category" : "Category failed to create",
                            timeout: 2500,
                            theme: success ? "success" : "error",
                        });
                        success && history.push(`/categories/edit/${response.data.id}`);
                        //if(formik.values.attributes.length>1)
                            addAttributes(response.data.id)
                    })
                );
            }
        },
    });

    function addAttributes(cat_id){
        formik.values.attributes.forEach(attr => attr.categoryId = cat_id)
        dispatch(
            AttributeActions.addAttributes(formik.values.attributes, (success, response) => {
                window.location.reload()
            })
        );
    }

    addNewAttributeField(0, true)

    function addNewAttributeField(i, initial){
        if(attributesAndTextFields.attributes.length === attributesAndTextFields.textFields.length)
            return
        var temp = []
        temp.push(
            <TextField
                placeholder={'Name'}
                className={`col-4`}
                name={`attributes[${i}].name'`}
                label="Attribute name"
                type="name"
                value={formik.values.attributes[i]['name']}
                onChange={formik.handleChange(`attributes[${i}].name'`)}
            />
        )
        temp.push(
            <TextField
                placeholder={'Suffix'}
                className={'col-4'}
                name={"attributes[" + i + "].suffix"}
                label="Attribute suffix"
                type="name"
                value={formik.values.attributes[i].suffix}
                onChange={formik.handleChange}
            />
        )
        temp.push(
            <FormControl className={'col-3'}>
                <InputLabel>Numeric</InputLabel>
                <Select
                    name={"attributes[" + i + "].isNumeric"}
                    value={formik.values.attributes[i].isNumeric}
                    label="Age"
                    onChange={formik.handleChange}
                >
                    <MenuItem value={true}>True</MenuItem>
                    <MenuItem value={false}>False</MenuItem>
                </Select>
            </FormControl>
        )
        temp.push(
            <IconButton aria-label="add"
                        className={'col-1'}
                        onClick={() => addNewAttributeField(attributesAndTextFields.attributes.length, false)}
            >
                <AddCircleOutlineIcon />
            </IconButton>
        )
        let prevState = {...attributesAndTextFields}
        if(!initial) {
            prevState.attributes = [...prevState.attributes, {
                id: -1,
                name: "",
                suffix: "",
                categoryId: -1,
                isNumeric: false
            }]
        }
        prevState.textFields = [...prevState.textFields, temp]
        setAttributesAndTextFields(prevState)
    }

    return (
        <div className={`container p-5 w-50`}>
            <h3>
                {Boolean(categoryId) ? 'Edit Category' : 'Create Category'}
            </h3>
            <form className={`text-center pt-4`} onSubmit={formik.handleSubmit}>
                <TextField
                    className={``}
                    fullWidth
                    id="name"
                    name="name"
                    label="Category name"
                    type="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                <h3 className={'text-start pt-4 pb-1'}>
                    {"Attributes"}
                </h3>
                {attributesAndTextFields.textFields}
                <div className={`pt-3 float-left`}>
                    <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                    >
                        {categoryId ? "Edit" : "Create"}
                    </Button>
                    <Button
                        color="primary"
                        href={'/admin'}
                    >
                        Exit
                    </Button>
                </div>
            </form>
        </div>
    );
});

export default CategoryForm;
