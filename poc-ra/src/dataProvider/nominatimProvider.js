import { stringify } from 'query-string';
import {
    GET_LIST,
    GET_ONE,
    CREATE,
    UPDATE,
    DELETE,
    GET_MANY,
    GET_MANY_REFERENCE,
} from 'react-admin';
const queryString = require('query-string');

const apiUrl = 'https://nominatim.openstreetmap.org';

export const fetchNominatim = async text => {
    const url = `${apiUrl}/search`;
    const parameters = {
        q: text,
        format: 'json',
        addressdetails: 1,
    };
    const urlWithParamaters = `${url}?${queryString.stringify(parameters)}`;
    // console.log('url', urlWithParamaters);
    const response = await fetch(urlWithParamaters);
    const json = await response.json();
    console.log('fetchNominatim');
    return json;
};

/**
 * Maps react-admin queries to my REST API
 *
 * @param {string} type Request type, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request type
 * @returns {Promise} the Promise for a data response
 */
export default (type, resource, params) => {
    let url = '';
    const options = {
        headers: new Headers({
            Accept: 'application/json',
        }),
    };
    switch (type) {
        case GET_LIST: {
            const { page, perPage } = params.pagination;
            const { field, order } = params.sort;
            const query = {
                sort: JSON.stringify([field, order]),
                range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
                filter: JSON.stringify(params.filter),
            };
            url = `${apiUrl}/${resource}?${stringify(query)}`;
            break;
        }
        case GET_ONE:
            url = `${apiUrl}/${resource}/${params.id}`;
            break;
        case GET_MANY: {
            const query = {
                filter: JSON.stringify({ id: params.ids }),
            };
            url = `${apiUrl}/${resource}?${stringify(query)}`;
            break;
        }
        default:
            throw new Error(`Unsupported Data Provider request type ${type}`);
    }

    return fetch(url, options)
        .then(res => res.json())
        .then(response =>
            /* Convert HTTP Response to Data Provider Response */
            /* Covered in the next section */
            ({ data: null }),
        );
};
