// src/utils/helpers.js
export const formatResponse = (data) => ({ success: true, data });

export const formatError = (message, code = 400) => ({ success: false, code, message });

export const validateEmail = (email) => {
    const regex = /^[\w-\.]+@[\w-\.]+\.[a-z]{2,7}$/i;
    return regex.test(email);
};

export const calculatePercentage = (score, total) => {
    return ((score / total) * 100).toFixed(2);
};

export const generateRandomString = (length = 8) => {
    return Math.random().toString(36).substring(2, 2 + length);
};