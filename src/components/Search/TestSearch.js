import React, {useCallback, useState} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import Grid from "@mui/material/Grid";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {Typography} from "@mui/material";
import debounce from "lodash/debounce";

const TestSearch = ({ onCitySelect, callAPI }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInput = useCallback(
        debounce((event) => {
            const inputValue = event.target.value;

            if (inputValue && inputValue.length > 1) {
                setSearchTerm(inputValue);

                setLoading(true);

                callAPI(inputValue.toLowerCase()).then(res => {
                    setOptions(res.options);
                    setLoading(false);
                }).catch(error => {
                    setLoading(false);
                    console.error('Error:', error);
                })
            } else {
                setOptions([]);
            }
        }, 200),
        [],
    )

    return (
        <Autocomplete
            options={options}
            getOptionLabel={(option) => option.label}
            loading={loading}
            onInputChange={handleInput}
            // onInputChange={handleSearch}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search City"
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                <IconButton onClick={() => onCitySelect(searchTerm)}>
                                    <SearchIcon />
                                </IconButton>
                            </>
                        ),
                    }}
                />
            )}
            renderOption={(props, option) => {
                return (
                    <li {...props} key={Math.floor(Math.random() * 1000)}>
                        <Grid container alignItems="center">
                            <Grid item sx={{ display: 'flex', width: 44 }}>
                                <LocationOnIcon sx={{ color: 'text.secondary' }} />
                            </Grid>
                            <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                <Typography variant="body2" color="text.secondary">
                                    {option.label}
                                </Typography>
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
        />
    );
};

export default TestSearch;