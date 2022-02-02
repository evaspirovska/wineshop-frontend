import TextField from "@mui/material/TextField";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import React from "react";

const DefaultCategoryAttributes = () => {
    return (
        <div className={`list-group list-group-flush`}>
            <div className={`list-group-item`}>
                <div className={`row`}>
                    <div className={`col-5`}>
                        <TextField
                            className={``}
                            fullWidth
                            name={`productTitle`}
                            label="Product Title"
                            type="name"
                            value={`Product Title`}
                            disabled
                        />
                    </div>
                    <div className="form-group col-3">
                        <FormControl fullWidth>
                            <InputLabel>Numeric</InputLabel>
                            <Select
                                name={`isNumeric`}
                                value={false}
                                disabled
                            >
                                <MenuItem value={false}>False</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
            <div className={`list-group-item`}>
                <div className={`row`}>
                    <div className={`col-5`}>
                        <TextField
                            className={``}
                            fullWidth
                            name={`productDescriptionHTML`}
                            label="Product Description"
                            type="text"
                            value={`Description`}
                            disabled
                        />
                    </div>
                    <div className="form-group col-3">
                        <FormControl fullWidth>
                            <InputLabel>Numeric</InputLabel>
                            <Select
                                name={`isNumeric`}
                                value={false}
                                disabled
                            >
                                <MenuItem value={false}>False</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
            <div className={`list-group-item`}>
                <div className={`row`}>
                    <div className={`col-5`}>
                        <TextField
                            className={``}
                            fullWidth
                            name={`priceInMKD`}
                            label="Product Price"
                            type="name"
                            value={`Product Price`}
                            disabled
                        />
                    </div>
                    <div className="form-group col-3">
                        <FormControl fullWidth>
                            <InputLabel>Numeric</InputLabel>
                            <Select
                                name={`isNumeric`}
                                value={true}
                                disabled
                            >
                                <MenuItem value={true}>True</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DefaultCategoryAttributes;