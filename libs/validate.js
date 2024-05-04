// Validate ว่าเป็นจำนวนเต็มหรือไม่
const validateInteger = (value) => {
    return /^\d+$/.test(value);
};

// Validate ว่าเป็นสตริงหรือไม่
const validateString = (value) => {
    return typeof value === 'string';
};

// Validate ว่าเป็นตัวเลขหรือไม่
const validateNumber = (value) => {
    return /^-?\d*\.?\d+$/.test(value);
};

// Validate ว่าเป็นออบเจ็กต์หรือไม่
const validateObject = (value) => {
    return typeof value === 'object' && value !== null;
};

// Validate ว่าเป็นอาร์เรย์หรือไม่
const validateArray = (value) => {
    return Array.isArray(value);
};

// Validate ว่าเป็น boolean หรือไม่
const validateBoolean = (value) => {
    return typeof value === 'boolean';
};

module.exports = { validateArray, validateBoolean, validateNumber, validateObject, validateString, validateInteger }