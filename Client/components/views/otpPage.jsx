import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRoute } from "@react-navigation/native";

const OTPPage = ({navigation}) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [issuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState(60);
    let route = useRoute();
    const otpInputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ];
    useEffect(() => {
        const timer = setInterval(() => {
            if (count > 0) {
                setCount(count - 1);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [count]);

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

    const handleOtpChange = (index, value) => {
        if (value.match(/[^0-9]/)) {
            // Ensure only numeric input
            return;
        }

        otp[index] = value;
        setOtp([...otp]);

        // Automatically focus on the next input field
        if (index < 5 && value !== '') {
            otpInputRefs[index + 1].current.focus();
        }
    };
    
    const combineOTP = () => {
        const combinedOTP = otp.join('');
        return combinedOTP; // Convert to an integer
    };
    // Check if all OTP digits are filled
    const isOtpComplete = otp.join('').length === 6;

    // Function to handle sending OTP
    const verifyOTP = async () => {
        const OTP = combineOTP();
        try {
            let response = await fetch('http://localhost:5000/users/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: route.params.userData.email,
                    OTP,
                }),
                credentials: 'include'
            })
            response = await response.json();
            if(response.error){
                showError(response.error)
            }
            else{
                setIsSuccess(true);
            }
        }
        catch (err) {
            console.log(err);
            showError('An error occured. Please try again');
        }

    };

    let requestOTP = async() =>{
        setIsLoading(true);
        setCount(0);
        try {
            let response = await fetch('http://localhost:5000/users/validateEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(route.params.userData),
                credentials: 'include'
            })
            response = await response.json();
            setIsLoading(false);
            if (response.error) {
                showError(response.error);
            }
            else {
                setOtp(['', '', '', '', '', '']);
                setCount(60);
            }
        }
        catch (err) {
            setIsLoading(false);
            console.log('Error: ', err);
            showError('An error occured. Please try again')
        }
    }

    return (
        isLoading ? 
        (
            <View style = {styles.loader}>
                <ActivityIndicator size='large' color= '#007bff'/>
            </View>
        )
        :
        (
            <View style={styles.container}>
                <Text style={styles.heading}>Enter OTP</Text>
                <Text style={styles.instructions}>Please enter the 6-digit code sent to your Email</Text>
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            style={[styles.otpBox, index < 5 ? { marginRight: 10 } : {}]}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(index, value)}
                            keyboardType="numeric"
                            maxLength={1}
                            ref={otpInputRefs[index]}
                            onFocus={() => {
                                otpInputRefs[index].current.setNativeProps({ style: { borderColor: 'blue' } });
                            }}
                        />
                    ))}
                </View>
                {issuccess ? 
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.successText}> Verification successfull. Click here to Login</Text>
                    </TouchableOpacity>
                    :
                    <View style = {styles.buttonContainer}>
                        <Text style = {styles.expireText}> Expires In: {count} seconds</Text>
                        <TouchableOpacity
                            style={[styles.sendButton, isOtpComplete ? {} : { backgroundColor: '#D3D3D3' }]
                            }
                            disabled={!isOtpComplete}
                            onPress={verifyOTP} // Add the onPress function
                        >
                            <Text style={styles.sendButtonText}>Verify</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={requestOTP}
                        >
                            <Text style={styles.resendText}>Resend OTP</Text>
                        </TouchableOpacity>
                   
                    </View>
                }
            </View>
        )
    );
};

const styles = StyleSheet.create({
    buttonContainer:{
        width: '100%',
    },
    loader: {
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'gray', 
    },
    instructions: {
        fontSize: 18,
        marginBottom: 20,
        color: 'gray', 
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    otpBox: {
        width: 30,
        height: 50,
        borderColor: 'gray',
        borderBottomWidth: 2,
        textAlign: 'center',
        fontSize: 28,
        color: 'black', 
    },
    sendButton: {
        backgroundColor: '#007bff',
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 20,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 20,
    },
    resendText: {
        fontSize: 16,
        textAlign: 'center',
        color: 'gray', // Vibrant blue color
        textDecorationLine: 'underline',
        marginTop: 20,
        fontSize: 20
    },
    expireText:{
        textAlign: 'center',
        marginTop: 20,
        fontSize: 20
    },
    successText:{
        textAlign: 'center',
        marginTop: 30,
        fontSize: 22,
        color: '#007bff',
        fontWeight: 'bold',
    }
});

export default OTPPage;
