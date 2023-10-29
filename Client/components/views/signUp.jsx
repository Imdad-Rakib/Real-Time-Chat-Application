import { useState } from 'react';
import { Alert, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required(''),
});

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


export default function SignUp({navigation}) {
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (values, resetForm) => {
        // Handle form submission here
        setIsLoading(true);
        try {
            let response = await fetch('http://localhost:5000/users/validateEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values),
                credentials: 'include'
            })
            response = await response.json();
            setIsLoading(false);
            if (response.error) {
                showError(response.error)
            }
            else{
                resetForm();
                navigation.navigate('Validation', {userData: values});
            }
        }
        catch (err) {
            console.log('Error: ', err);
            setIsLoading(false);
            showError('An error occured. Please try again');
        }
    };

    return(
        <View style={styles.container}>
            <Text style={styles.heading}>Create New Account</Text>
            <Formik
                initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={validationSchema}
                onSubmit={(values, {resetForm}) => {
                    handleSubmit(values, resetForm)  ;
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View>
                        <View style={styles.fieldContainer}>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                                placeholder="Name"
                            />
                            {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                placeholder="Email"
                            />
                            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                placeholder="Password"
                                secureTextEntry
                            />
                            {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>
                        <View style={styles.fieldContainer}>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                value={values.confirmPassword}
                                placeholder="Confirm Password"
                                secureTextEntry
                            />
                            {touched.confirmPassword && errors.confirmPassword && (
                                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                            )}
                        </View>
                        {
                            isLoading ?
                                <View style={styles.loader}>
                                    <ActivityIndicator size='large' color='#007bff' />
                                </View>
                                :
                                <TouchableOpacity style={styles.submitButton} onPress={(values) => handleSubmit(values)}>
                                    <Text style={styles.submitButtonText}>Sign Up</Text>
                                </TouchableOpacity>
                        }
                    </View>
                )}
            </Formik>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.signInLink}>
                <Text style={styles.signInText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
        
    );
};

const styles = StyleSheet.create({
    // loader:{
    //     minHeight: '100%',
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    fieldContainer: {
        marginBottom: 10,
    },
    fieldHeading: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    errorText: {
        color: 'red',
    },
    submitButton: {
        backgroundColor: '#007bff',
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 5,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 20,
    },
    signInText: {
        textAlign: 'center',
        fontSize: 15,
        color: 'gray', // Vibrant blue color
        textDecorationLine: 'underline',
        marginTop: 20,
    },
});

