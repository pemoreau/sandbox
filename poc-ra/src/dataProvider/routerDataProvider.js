import { fetchUtils } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const queryString = require('query-string');

export const routerDataProvider = (type, resource, params) => {
    console.log(`routerDataProvider type=${type}, resource=${resource}, params`, params);

    if (type === 'GET_LIST' && resource === 'customers_last_name') {
        const res = dataProvider(type, 'customers', params);
        return res
            .then(response => {
                // console.log('res', response);
                const name_list = [...new Set(response.data.map(({ last_name }) => last_name))];
                const data = name_list.map(name => ({
                    id: name,
                    name: name,
                }));

                // console.log('router nameList', name_list);
                // console.log('router data', data);
                return new Promise((resolve, reject) => resolve({ data, total: data.length }));
            })
            .catch(error => console.log('should not be there', error));
    }

    if (resource === 'mobicoop-addresses') {
        return autocompleteSigDataProvider(type, resource, params);
    }

    // for other request types and resources, fall back to the default request handler
    return dataProvider(type, resource, params);
};

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // add your own headers here
    // options.headers.set('Access-Control-Expose-Headers', 'Content-Range');
    // options.headers.set('Origin', 'http://localhost:3000');
    return fetchUtils.fetchJson(url, options);
};

const dataProvider = jsonServerProvider('https://json-server-now.pemoreau.now.sh', httpClient);

const autocompleteSigDataProvider = (type, resource, params) => {
    console.log('autocompleteSigDataProvider', type, resource, params);

    // const { text } = params.data;
    const text = '4 rue Girardet';
    const apiUrl = 'https://api.mobicoop.io/addresses';
    // const apiUrl = 'https://api.maptiler.com/geocoding';
    // const apiUrl = 'https://search.osmnames.org/q';

    const parameters = {
        q: `${text}`,
    };
    const urlWithParameters = `${apiUrl}/search?${queryString.stringify(parameters)}`;
    // return dataProvider(type, 'commands', params);
    return fetchUtils
        .fetchJson(urlWithParameters)
        .then(response => {
            const data = response.json;
            console.log('autocompleteAddress', data);
            return new Promise((resolve, reject) => resolve({ data, total: data.length }));
        })
        .catch(error => console.log('should not be there', error));
};
