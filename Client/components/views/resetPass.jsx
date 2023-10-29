import React, {useState} from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import SignUp from "./signUp";

import * as Yup from 'yup';

const ResetPassword = ({navigation}) => {
    const route = useRoute();
    const showError = (err) => {
        Alert.alert(
            'Error',
            err,
            [
                {
                    text: 'OK',
                },
            ],
            { cancelable: false }
        );
    }

    const initialValues = {
        password: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Password must be confirmed'),
    });

    const handleResetPassword = async (values) => {
        try {
            let response = await fetch('http://localhost:5000/users/updatePassword',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: route.params.email,
                        password: values.password
                    }),
                    credentials: 'include'
                })
            response = await response.json();
            if (response.error) {
                showError(response.error);
            }
            else {
                route.params.email = null;
                console.log('password reset successfully');
                navigation.navigate('Login');
            }

        }
        catch (err) {
            console.log('Error: ', err);
            showError('An error occured. Please try again');
        }

    };
    return route.params.email ? 
        (<View style={styles.container}>
            <Text style={styles.heading}>Reset Your Password</Text>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleResetPassword}
            >
                {({ values, handleChange, handleSubmit, errors, touched }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="New Password"
                            secureTextEntry
                            value={values.password}
                            onChangeText={handleChange('password')}
                        />
                        {touched.password && errors.password && (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        )}
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            secureTextEntry
                            value={values.confirmPassword}
                            onChangeText={handleChange('confirmPassword')}
                        />
                        {touched.confirmPassword && errors.confirmPassword && (
                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        )}
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>
                    </>
                )}
            </Formik>
        </View>)
        :
        <SignUp/>

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: 300,
        height: 40,
        borderBottomWidth: 1,
        borderColor: 'gray',
        marginBottom: 10,
        padding: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 40,
        backgroundColor: 'blue', // Customize button background color
        width: '85%', // Customize the button width as needed
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: 'white', // Customize button text color
        fontSize: 18
    },
});

export default ResetPassword;
