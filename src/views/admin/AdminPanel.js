import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Edit} from '@material-ui/icons';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {wrapComponent} from "react-snackbar-alert";
import {useDispatch, useSelector} from 'react-redux';
import React, {useEffect} from 'react';
import {CategoryActions} from '../../redux/actions/categoryActions';

const AdminPanel = wrapComponent(function ({createSnackbar}) {
    const dispatch = useDispatch();
    const categories = useSelector(state => state.category.categories);

    useEffect(() => {
        dispatch(CategoryActions.fetchAllCategories());
    }, []);

    const handleCategoryDelete = id => {
        dispatch(CategoryActions.deleteCategory(id));
    };

    return (
        <div className={`container p-5`}>
            <div>
                <div className={`btn btn-success float-right`}>
                    <a href={`/categories/add`} className={`text-white text-decoration-none`}>ADD CATEGORY</a>
                </div>
                <h3>
                    Categories
                </h3>
                <div className={`pt-4`}>
                    <TableContainer component={Paper}>
                        <Table className={``} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" padding="none" width={70}>#</TableCell>
                                    <TableCell align="left">Category</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories &&
                                categories.map((category, i) => (
                                    <TableRow key={category.id}>
                                        <TableCell component="th" scope="row" name="categoryId" padding="none"
                                                   align="center">
                                            {i + 1}
                                        </TableCell>
                                        <TableCell align="left">{category.name}</TableCell>
                                        <TableCell align="center">
                                            <Button onClick={() => {
                                                // eslint-disable-next-line no-unused-expressions
                                                ( window.confirm('Are you sure you wish to delete this category?')) ?
                                                    handleCategoryDelete(category.id)
                                                    : null
                                            }}>
                                                <HighlightOffIcon/>
                                            </Button>
                                            <Button
                                                href={`/categories/edit/${category.id}`}
                                            >
                                                <Edit/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
});

export default AdminPanel;