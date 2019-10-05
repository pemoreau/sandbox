import { fetchUtils } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

const queryString = require('query-string');

export const routerDataProvider = (type, resource, params) => {
    console.log(`routerDataProvider type=${type}, resource=${resource}, params`, params);
    if (type === 'UPDATE' && resource === 'customers') {
        sigDataProvider(type, params);
        // autocompleteSigDataProvider(type, params);
    }
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

const sigDataProvider = (type, params) => {
    const { address, city, zipcode } = params.data;
    const {
        address: previousAddress,
        city: previousCity,
        zipcode: previousZipcode,
    } = params.previousData;
    if (address !== previousAddress || city !== previousCity || zipcode !== previousZipcode) {
        if (address !== previousAddress) {
            console.log('address changed', address, previousAddress);
        }
        if (city !== previousCity) {
            console.log('city changed', city, previousCity);
        }
        if (zipcode !== previousZipcode) {
            console.log('zipcode changed', zipcode, previousZipcode);
        }
    } else {
        console.log('nothing changed');
    }

    const apiUrl = 'https://nominatim.openstreetmap.org';
    const parameters = {
        q: `${address ? address : ''} ${city ? city : ''} ${zipcode ? zipcode : ''}`,
        format: 'json',
        addressdetails: 1,
    };
    const urlWithParameters = `${apiUrl}/search?${queryString.stringify(parameters)}`;

    fetchUtils.fetchJson(urlWithParameters).then(response => {
        console.log('sigDataProvider', response);
    });
};

const autocompleteSigDataProvider = (type, params) => {
    const { address, city, zipcode } = params.data;

    const apiUrl = 'https://api.maptiler.com/geocoding';
    // const apiUrl = 'https://search.osmnames.org/q';
    const text = `${address ? address : ''} ${city ? city : ''} ${zipcode ? zipcode : ''}`;
    const urlWithParameters = `${apiUrl}/${text}.json?key=U81nFAGbhcKWYfQhC41p`;

    // fetchUtils.fetchJson(urlWithParameters).then(response => {
    //     console.log('autocompleteSigDataProvider', response);
    // });
    fetchUtils.fetchJson(urlWithParameters).then(response => {
        console.log('autocompleteSigDataProvider', response);
    });
};
