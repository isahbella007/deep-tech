import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/layout';
import ImageComponent from '../assets/illustration_register.png';
import { userRegister } from '../api/auth';
import { useState } from 'react';


interface RegisterFormValues {
  username: string;
  password: string;
  isAdmin: boolean;
}

const RegisterSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  isAdmin: Yup.boolean()
});

const Register = () => {
  const [errorMessage, setErrorMessage] = useState()
  const navigate = useNavigate();

  const initialValues: RegisterFormValues = {
    username: '',
    password: '',
    isAdmin: false
  };

  const handleSubmit = async(values: RegisterFormValues) => {
    try{ 
      await userRegister(values.username, values.password, values.isAdmin) 
      // console.log('The response is', response)
      // In here, include like a state loader or maybe dispatch the global state loader so that it shows everytime
      navigate('/login');
    }catch(error:any){ 
      // console.log('Something went wrong n',error)
      setErrorMessage(error.response.data.message)
    }
    
   
  };

    return (
      <Layout>
        <div className="flex min-h-screen bg-gray-100">
          {/* Left column - Image (hidden on mobile) */}
          <div className="hidden md:flex md:w-1/2 bg-cover bg-center items-center justify-center" style={{ minHeight: '100vh' }}>
            <img 
              src={ImageComponent} 
              alt="Registration Illustration" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          {/* Right column - Form */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-0">
            <div className="max-w-md w-full px-6">
              <h1 className="text-3xl font-bold mb-6">Register</h1>
              <Formik
                initialValues={initialValues}
                validationSchema={RegisterSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
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
                    <div>
                      <label className="flex items-center">
                        <Field type="checkbox" name="isAdmin" className="mr-2" />
                        Is Admin
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
  
                    {errorMessage && (
                      <div className="text-red-500 mt-2">{errorMessage}</div>
                    )}
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </Layout>
    );
};

export default Register;