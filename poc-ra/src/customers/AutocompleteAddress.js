import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { fetchUtils, FormDataConsumer, Labeled, REDUX_FORM_NAME } from 'react-admin';
import useDebounce from './useDebounce';
import { change } from 'redux-form';

const queryString = require('query-string');

const renderInput = ({ InputProps, classes, ref, ...other }) => (
    <Labeled label="Adresse">
        <TextField
            InputProps={{
                inputRef: ref,
                classes: {
                    root: classes.inputRoot,
                },
                ...InputProps,
            }}
            {...other}
        />
    </Labeled>
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
    const text = input ? input.trim() : '';
    if (!text) {
        return;
    }

    console.log('getSuggestions text ', text);
    const apiUrl = 'https://api.mobicoop.io/addresses';
    const parameters = {
        q: `${text}`,
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

    useEffect(
        () => {
            // Make sure we have a value (user has entered something in input)
            if (debouncedInput) {
                fetchSuggestions(debouncedInput).then(results => {
                    setSuggestions(results.slice(0, 5));
                });
            } else {
                setSuggestions([]);
            }
        },
        // This is the useEffect input array
        // Our useEffect function will only execute if this value changes ...
        // ... and thanks to our hook it will only change if the original ...
        // value (searchTerm) hasn't changed for more than 500ms.
        [debouncedInput],
    );
    /*
addressCountry: "France"
addressLocality: "Nancy"
countryCode: "FRA"
county: "Nancy"
createdDate: null
displayLabel: "4 Rue Girardet, Nancy"
elevation: null
geoJson: null
home: null
houseNumber: "4"
id: 999999999999
latitude: "48.693464"
localAdmin: "Nancy"
longitude: "6.186733"
macroCounty: "arrondissement de Nancy"
macroRegion: "Grand Est"
name: null
postalCode: null
region: "Meurthe-et-Moselle"
relayPoint: null
street: "Rue Girardet"
streetAddress: "4 Rue Girardet"
subLocality: null
updatedDate: null
venue: null
 */
    return (
        <FormDataConsumer>
            {({ formData, dispatch, ...rest }) => (
                <div className={classes.root}>
                    <Downshift
                        id="downshift-simple"
                        onInputValueChange={(inputValue, stateOnHelper) => setInput(inputValue)}
                        onSelect={(selectedItem, stateAndHelpers) => {
                            const address = suggestions.find(
                                element => element.displayLabel === selectedItem,
                            );
                            // console.log('address', address);
                            // console.log('suggestions', suggestions);
                            dispatch(change(REDUX_FORM_NAME, 'address', address.streetAddress));
                            dispatch(change(REDUX_FORM_NAME, 'zipcode', address.postalCode));
                            dispatch(change(REDUX_FORM_NAME, 'city', address.addressLocality));
                        }}
                    >
                        {({
                            getInputProps,
                            getItemProps,
                            isOpen,
                            inputValue,
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
