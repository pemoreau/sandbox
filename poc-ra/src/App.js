import React from 'react';
import { fetchUtils, Admin, Resource } from 'react-admin';

import { Dashboard } from './Dashboard';

import products from './products';
import './App.css';

import { routerDataProvider } from './dataProvider/routerDataProvider
            <Resource options={{ label: 'Orders' }} name={'commands'} {...commands} />
            <Resource name={'invoices'} {...invoices} />
            <Resource options={{ label: 'Posters' }} name={'products'} {...products} />
            <Resource name={'categories'} {...categories} />
            <Resource name={'customers'} {...customers} />
            <Resource name={'reviews'} {...reviews} />
        </Admin>
    </div>
);'
import products from './products';
import './App.css';

import { routerDataProvider } from './dataProvider/routerDataProvider';

import reviews from './reviews';
import invoices from './invoices';
import categories from './categories';
import commands from './commands';
import customers from './customers'import customers from './customers';
;


const App = () => (
    <div className="App">
        <Admin title="adminTitle" dashboard={Dashboard} dataProvider={routerDataProvider}>

    <div className="App">const App = () => (

<Admin title="adminTitle" dashboard={Dashboard} dataProvider={routerDataProvider}>

export default App;
