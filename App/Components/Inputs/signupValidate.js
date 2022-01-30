import * as Yup from 'yup';

export const Validate = Yup.object().shape({
  email: Yup.string()
    .email('Not a valid email !')
    .required('Email is required !'),
  fullname: Yup.string()
    .min(3, 'Must be at least 3 character long !')
    .required('Fullname is required !'),
  phone: Yup.number()
    .min(10, 'Phone number must be 10 digit !')
    .required('Phone number is required !'),
  password: Yup.string()
    .min(5, 'Choose a strong password !')
    .required('Password is required !'),
  cpassword: Yup.string()
    .required('Confirm password is required !')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});
