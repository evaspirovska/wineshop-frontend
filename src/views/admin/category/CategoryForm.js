import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {useDispatch, useSelector} from "react-redux";
import * as yup from "yup";
import {wrapComponent} from "react-snackbar-alert";
import {useParams, useHistory} from "react-router";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {CategoryActions} from "../../../redux/actions/categoryActions";

const validationSchema = yup.object({
    name: yup.string("Enter Category").required("Category is required"),
});

const CategoryForm = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const {categoryId} = useParams();
    const [category, setCategory] = useState(null);

    const initialValues = {
        name: "",
    };

    useEffect(() => {
        if (Boolean(categoryId)) {
            dispatch(CategoryActions.fetchCategory(categoryId, (success, response) => {
                if (Boolean(success)) {
                    setCategory(response.data)
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
        initialValues: category ? category : initialValues,
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
                        history.push(`/categories/edit/${response.data.id}`);
                    })
                );

            }
        },
    });

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
