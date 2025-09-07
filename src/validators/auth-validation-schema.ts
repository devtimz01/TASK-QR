import * as yup from 'yup'

const signupValidation =yup.object({
    fullName: yup.string().lowercase().trim().required(),
    email: yup.string().lowercase().trim().email().required(),
    companyName: yup.string().lowercase().trim().required(),
    password: yup.string().max(6).trim().required(),
    username: yup.string().lowercase().trim().required()
});


const authValidationSchema={
    signupValidation
};
export default authValidationSchema;
