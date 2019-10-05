import React from 'react';
import { fetchUtils, Admin, Resource } from 'react-admin';

import './App.css';

import { routerDataProvider } from './dataProvider/routerDataProvider';
import products from './products';
import reviews from './reviews';
import invoices from './invoices';
import categories from './categories';
import commands from './commands';
import customers from './customers';
import { Dashboard } from './Dashboard';

const App = () => (
    <div className="App">
        <Admin title="adminTitle" dashboard={Dashboard} dataProvider={routerDataProvider}>
            <Resource options={{ label: 'Orders' }} name={'commands'} {...commands} />
            <Resource name={'invoices'} {...invoices} />
            <Resource options={{ label: 'Posters' }} name={'products'} {...products} />
            <Resource name={'categories'} {...categories} />
            <Resource name={'customers'} {...customers} />
            <Resource name={'reviews'} {...reviews} />
        </Admin>
    </div>
);

export default App;
