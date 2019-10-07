import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { fetchUtils, FormDataConsumer, REDUX_FORM_NAME } from 'react-admin';
import useDebounce from './useDebounce';
import { change } from 'redux-form';

const queryString = require('query-string');

const renderInput = ({ InputProps, classes, ref, ...other }) => (
    <TextField
        label="Adresse"
        placeholder="Placeholder"
        style={{ width: 300 }}
        InputProps={{
            // inputRef: ref,
            // classes: {
            //     root: classes.inputRoot,
            // },
            ...InputProps,
        }}
        {...other}
    />
);

const renderSuggestion = ({ suggestion, index, itemProps, highlightedIndex, selectedItem }) => {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(suggestion.displayLabel) > -1;

    return (
        <MenuItem
            {...itemProps}
            key={suggestion.displayLabel}
            selected={isHighlighted}
            component="div"
            style={{
                fontWeight: isSelected ? 500 : 400,
            }}
        >
            {suggestion.displayLabel}
        </MenuItem>
    );
};

renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.number,
    index: PropTypes.number,
    itemProps: PropTypes.object,
    selectedItem: PropTypes.string,
    suggestion: PropTypes.shape({ displayLabel: PropTypes.string }).isRequired,
};

const fetchSuggestions = input => {
    if (!input) {
        return new Promise((resolve, reject) => resolve([]));
    }

    const apiUrl = 'https://api.mobicoop.io/addresses';
    const parameters = {
        q: `${input}`,
    };
    const urlWithParameters = `${apiUrl}/search?${queryString.stringify(parameters)}`;
    return fetchUtils
        .fetchJson(urlWithParameters)
        .then(response => response.json)
        .catch(error => {
            console.error(error);
            return [];
        });
};

const GeocompleteInput = props => {
    const { classes } = props;

    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const debouncedInput = useDebounce(input, 200);

    useEffect(() => {
        if (debouncedInput) {
            fetchSuggestions(debouncedInput).then(results => {
                setSuggestions(results.slice(0, 5));
            });
        } else {
            setSuggestions([]);
        }
    }, [debouncedInput]);

    return (
        <FormDataConsumer>
            {({ dispatch, ...rest }) => (
                <div className={classes.root}>
                    <Downshift
                        id="downshift-simple"
                        onInputValueChange={(inputValue, stateAndHelperss) =>
                            setInput(inputValue ? inputValue.trim() : '')
                        }
                        onSelect={(selectedItem, stateAndHelpers) => {
                            const address = suggestions.find(
                                element => element.displayLabel === selectedItem,
                            );
                            if (address) {
                                // dispatch here the fields you want to store in the react-admin model
                                dispatch(change(REDUX_FORM_NAME, 'address', address.streetAddress));
                                dispatch(change(REDUX_FORM_NAME, 'zipcode', address.postalCode));
                                dispatch(change(REDUX_FORM_NAME, 'city', address.addressLocality));
                            }
                        }}
                    >
                        {({
                            getInputProps,
                            getItemProps,
                            isOpen,
                            selectedItem,
                            highlightedIndex,
                        }) => (
                            <div className={classes.container}>
                                {renderInput({
                                    fullWidth: true,
                                    classes,
                                    InputProps: getInputProps({
                                        placeholder: 'Entrer une adresse',
                                    }),
                                })}
                                {isOpen ? (
                                    <Paper className={classes.paper} square>
                                        {suggestions.map((suggestion, index) =>
                                            renderSuggestion({
                                                suggestion,
                                                index,
                                                itemProps: getItemProps({
                                                    item: suggestion.displayLabel,
                                                }),
                                                highlightedIndex,
                                                selectedItem,
                                            }),
                                        )}
                                    </Paper>
                                ) : null}
                            </div>
                        )}
                    </Downshift>
                </div>
            )}
        </FormDataConsumer>
    );
};

GeocompleteInput.propTypes = {
    classes: PropTypes.object.isRequired,
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 250,
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    inputRoot: {
        flexWrap: 'wrap',
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});

export default withStyles(styles)(GeocompleteInput);
