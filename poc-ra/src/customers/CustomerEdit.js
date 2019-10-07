import React from 'react';
import {
    Edit,
    TextInput,
    BooleanInput,
    DateInput,
    TabbedForm,
    FormTab,
    ReferenceManyField,
    TextField,
    EditButton,
    Datagrid,
    DateField,
    NumberField,
    AutocompleteInput,
    ReferenceInput,
    FormDataConsumer,
    ReferenceField,
    REDUX_FORM_NAME,
    Query,
    SelectInput,
    Loading,
} from 'react-admin';
import { change } from 'redux-form';
import { AvatarField } from './AvatarField';

import AutocompleteAddress from './AutocompleteAddress';

const CustomLastNameField = ({ last_name, first_name }) => (
    <div>{`Computed name: ${first_name} ${last_name}`}</div>
);

const payload = {
    pagination: { page: 1, perPage: 20 },
    sort: { field: 'last_name', order: 'ASC' },
};
const GetNames = props => (
    // console.log('GetNames props', props) ||
    <Query type="GET_LIST" resource="customers_last_name" payload={payload}>
        {({ data, loading, error }) => {
            if (loading) {
                return <Loading />;
            }
            if (error) {
                return <p>ERROR</p>;
            }
            console.log('data', data);
            return React.cloneElement(props.children, {
                choices: data, //.map(({ last_name }) => ({ id: last_name, name: last_name })),
                ...props,
            });
        }}
    </Query>
);

const QueryUserProfile = props => (
    <Query type="GET_ONE" resource="customers" payload={{ id: props.record.id }}>
        {({ data, loading, error }) => {
            if (loading) {
                return <Loading />;
            }
            if (error) {
                return <p>ERROR</p>;
            }
            return (
                <div>
                    Loaded customer: id: {data.id} {data.first_name} {data.last_name}
                </div>
            );
        }}
    </Query>
);

const MyInput = props => console.log('props', props) || <SelectInput {...props} />;

export const CustomerEdit = props => (
    <Edit title={<AvatarField source="id" />} {...props}>
        <TabbedForm>
            <FormTab label="Identity">
                <TextInput source="first_name" />
                <FormDataConsumer>
                    {({ formData, dispatch, ...rest }) => (
                        <GetNames>
                            <MyInput
                                source="last_name"
                                label="Last name"
                                onChange={value => {
                                    // console.log('MyInput value', JSON.stringify(value));
                                    const letters = Object.values(value)
                                        .filter(x => typeof x === 'string')
                                        .join('');
                                    // console.log('letters ', letters);
                                    // console.log('last_name ', formData.last_name);

                                    dispatch(
                                        change(
                                            REDUX_FORM_NAME,
                                            'email',
                                            `${formData.first_name}.${letters}@hotmail.com`,
                                        ),
                                    );
                                }}
                                {...rest}
                            />
                        </GetNames>
                    )}
                </FormDataConsumer>

                {/*<FormDataConsumer>*/}
                {/*    {({ formData, dispatch, ...rest }) => (*/}
                {/*        <>*/}
                {/*            <ReferenceInput*/}
                {/*                label="Last name"*/}
                {/*                source="last_name"*/}
                {/*                reference="customers"*/}
                {/*                filterToQuery={text => ({ last_name_like: `^${text}` })}*/}
                {/*                // format={s => s.toUpperCase()}*/}
                {/*                // onChange={value => {*/}
                {/*                // console.log('ReferenceInput value', JSON.stringify(value));*/}
                {/*                // dispatch(change(REDUX_FORM_NAME, 'email', 'hello'));*/}
                {/*                // }}*/}
                {/*                {...rest}*/}
                {/*            >*/}
                {/*                <SelectInput optionText="last_name" optionValue="last_name" />*/}
                {/*            </ReferenceInput>*/}
                {/*        </>*/}
                {/*    )}*/}
                {/*</FormDataConsumer>*/}
                <TextInput source="email" />
                <DateInput source="birthday" />

                <FormDataConsumer>
                    {({ formData, ...rest }) => {
                        const { first_name, last_name } = formData;
                        return (
                            <CustomLastNameField last_name={last_name} first_name={first_name} />
                        );
                    }}
                </FormDataConsumer>

                <QueryUserProfile />
            </FormTab>
            <FormTab label="Address">
                <AutocompleteAddress />
                {/*    <TextInput source="address" />*/}
                {/*<TextInput source="zipcode" />*/}
                <TextInput source="city" />
            </FormTab>
            <FormTab label="Orders">
                <ReferenceManyField addLabel={false} reference="commands" source="customer_id">
                    <Datagrid>
                        <DateField source="date" />
                        <TextField source="reference" />
                        <NumberField label="Nb items" source="basket.length" />
                        <NumberField source="total" />
                        <TextField source="status" />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </FormTab>
            <FormTab label="Reviews"></FormTab>
            <FormTab label="Stats">
                <TextInput source="groups" />
                <BooleanInput source="has_newsletter" />
                <DateInput source="first_seen" />
                <TextInput source="latest_purchase" />
                <DateInput source="last_seen" />
            </FormTab>
        </TabbedForm>
    </Edit>
);
