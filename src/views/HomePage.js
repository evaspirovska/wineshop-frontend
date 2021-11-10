import { Grid } from '@material-ui/core';
import React from 'react';

const HomePage = () => {

    return (
        <Grid container className={`container`}>
            <Grid item lg={12} className={`text-center`}>
                <h2>
                    Home Page
                </h2>
                <h3>
                    Welcome to WineShop
                </h3>
            </Grid>
        </Grid>
    );
};
export default HomePage;
