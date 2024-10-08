import React, { useState } from 'react';

const PasswordField = ({ label, value, onChange, placeholder, confirm, errors, setErrors }) => {
    const [touched, setTouched] = useState(false);

    const handleChange = (e) => {
        const newValue = e.currentTarget?.value || ""; // Safely access value

        onChange(newValue);
        if (touched) {
            setErrors((prevErrors) => ({ 
                ...prevErrors, 
                [label.toLowerCase().replace(' ', '')]: "" 
            }));

            if (confirm !== null) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    confirmPassword: confirm === newValue ? "" : "Passwords do not match."
                }));
            }
        }
    };

    const handleBlur = () => {
        setTouched(true);
        if (!value) {
            setErrors((prevErrors) => ({ 
                ...prevErrors, 
                [label.toLowerCase().replace(' ', '')]: `${label} is required.` 
            }));
        } else if (confirm !== null && confirm !== value) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmpassword: "Passwords do not match."
            }));
        }
        if (errors[label.toLowerCase().replace(' ', '')] && value && confirm === value) {
            console.log("inside");
        
            const { [label.toLowerCase().replace(' ', '')]: removed, ...newErrors } = errors;
        
            console.log("newErrors");
        
            setErrors(newErrors);
        }
    };

    return (
        <>
            <label className="text-gray-800 text-sm mb-2 block">{label}</label>
            <div className="relative flex items-center">
                <input 
                    value={value} 
                    onChange={handleChange} 
                    type="password" 
                    onBlur={handleBlur}
                    required 
                    className={`w-full text-gray-800 text-sm border ${errors[label.toLowerCase().replace(' ', '')] ? 'border-red-500' : 'border-gray-300'} px-4 py-3 rounded-md outline-Beige`}
                    placeholder={placeholder} 
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4 h-4 absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                    <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                </svg>
            </div>
            {errors[label.toLowerCase().replace(' ', '')] && (
                <p className="text-red-500 text-sm mt-1">{errors[label.toLowerCase().replace(' ', '')]}</p>
            )}
        </>
    );
};

export default PasswordField;
