import React, {useState} from 'react';
import {Alert, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ForgotPassword = ({navigation}) => {
    
    const [isLoading, setIsLoading] = useState(false);
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
        email: '',
    };
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
    });

    const handleForgotPassword = async (values) => {
        setIsLoading(true);
        try{
            let response = await fetch('http://localhost:5000/users/forgotPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
            response = await response.json();
            setIsLoading(false);
            if(response.error){
                showError(response.error)
            }
            else{
                navigation.navigate('Password Reset Code', {email: values.email})
            }
        }
        catch(err){
            setIsLoading(false);
            console.log(err);
            showError('An error occured. Please Try Again')
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Enter your email</Text>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleForgotPassword}
            >
                {({ values, handleChange, handleSubmit, errors, touched }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            // placeholder="Email"
                            value={values.email}
                            onChangeText={handleChange('email')}
                        />
                        {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        {isLoading ?
                            <ActivityIndicator size='large' color='#007bff' />
                            :
                            <TouchableOpacity
                                style={styles.buttonContainer}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.buttonText}>Continue</Text>
                            </TouchableOpacity>
                        }
                    </>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        marginBottom: 20,
        fontSize: 18,
        alignSelf: 'flex-start',
        marginLeft: 30,
    },
    input: {
        width: 300,
        height: 40,
        borderBottomWidth: 1,
        borderColor: 'gray',
        marginBottom: 10,
        padding: 5,
    },
    errorText: {
        color: 'red',
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

export default ForgotPassword;
