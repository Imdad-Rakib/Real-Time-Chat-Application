import {Alert, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux'; 
import { setUser } from '../../store/slices/userSlice.mjs';
import { setSocket } from '../../store/slices/socketSlice.mjs';
// import { io } from 'socket.io-client';
import { socketConfiguration } from '../../Socket/index.mjs';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
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

export default function Login({navigation}) {

    const dispatch = useDispatch();
    // const currentChat = useSelector((state) => state.currentChat);

    const handleLogin = async (values) => {
        try {
            let response = await fetch('http://localhost:5000/',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values),
                    credentials: 'include'
                })

            response = await response.json();
            if (response.error) {
                showError(response.error)
            }
            else{
                dispatch(setUser(response));
                socketConfiguration(response.email, dispatch);
                navigation.navigate('Home');
                // const socket = io('http://localhost:5000')
                // socket.on('connect', () => {
                //     dispatch(setSocket(socket));
                //     socket.emit('client-info', response.email);
                //     navigation.navigate('Chats');
                // });
            }
        }
        catch (err) {
            console.log('Error: ', err);
            showError('An error occured. Please try again.')
        }
    };
    return (
        <View style={styles.container}>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.form}>
                        <Text style={styles.heading}>Log into your account</Text>
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                            />
                            {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        </View>
                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                secureTextEntry
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                            />
                            {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Forgot Password')} style={styles.passResetLink}>
                            <Text style={styles.passResetText}>Forgot your password?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.LoginButton} onPress={handleSubmit}>
                            <Text style={styles.LoginButtonText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Sign Up')} style={styles.signUpLink}>
                            <Text style={styles.signUpText}>Don't have an account? SignUp</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 16,
    },
    // form: {
    //     backgroundColor: 'white',
    //     borderRadius: 10,
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.25,
    //     shadowRadius: 3.84,
    //     elevation: 5,
    //     padding: 16,
    // },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        // color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
        marginLeft: 3,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderBottomWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    errorText: {
        color: 'red',
    },
    LoginButton: {
        marginTop: 20,
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 10,
    },
    LoginButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    passResetLink: {
        marginLeft: 10,
        textAlign: 'center',
    },
    passResetText: {
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    signUpText: {
        textAlign: 'center',
        fontSize: 15,
        color: 'gray', // Vibrant blue color
        textDecorationLine: 'underline',
        marginTop: 20,
    },
});
