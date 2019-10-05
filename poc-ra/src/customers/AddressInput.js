import React from 'react';
import { TextInput } from 'react-admin';

export const AddressInput = () => (
    <div>
        <TextInput source="address" />
        <TextInput source="zipcode" />
        <TextInput source="city" />
    </div>
);
