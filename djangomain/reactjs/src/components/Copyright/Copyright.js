import React from 'react'; 
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const copyright = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
            <Link to="/">
            The Free Market
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default copyright;