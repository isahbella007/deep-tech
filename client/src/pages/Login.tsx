import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/layout';
import { login } from '../store/authSlice';
import ImageComponent from '../assets/illustration_login.png';
import { userLogin } from '../api/auth';
import { useState } from 'react';

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues: LoginFormValues = {
    username: '',
    password: '',
  };

  const[errorMessage, setErrorMessage] = useState()

  const handleSubmit = async(values: LoginFormValues) => {
    try{
      const result = await userLogin(values.username, values.password)
      // console.log('we have logged in', result)
      dispatch(login(result.data.user));
      navigate('/');
    }catch(error:any){ 
      setErrorMessage(error.response.data.message)
    }
   
  };

  return (
    <Layout>
<div className="flex min-h-screen bg-gray-100">
    {/* Left column - Image */}
    <div className="w-1/2 bg-cover bg-center flex items-center justify-center" style={{ minHeight: '100vh' }}>
      <img 
          src={ImageComponent} 
          alt="Login Illustration" 
          className="max-w-full max-h-full object-contain"
      />
    </div>
    {/* Right column - Form */}
    <div className="w-1/2 flex items-center justify-center">
          <div className="max-w-md w-full px-6">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4 max-w-md">
            <div>
              <Field
                name="username"
                type="text"
                placeholder="Username"
                className="w-full px-3 py-2 border rounded-md"
              />
              <ErrorMessage name="username" component="div" className="text-red-500" />
            </div>
            <div>
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border rounded-md"
              />
              <ErrorMessage name="password" component="div" className="text-red-500" />
            </div>
            {errorMessage && (
                    <div className="text-red-500 mt-2">{errorMessage}</div>
                  )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </Form>
        )}
      </Formik>
      </div>
      </div>
      </div>
    </Layout>
  );
};

export default Login;