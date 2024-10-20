import Layout from "../components/layout";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ImageComponent from '../assets/character_2.png';
import { useEffect, useState } from "react";
import { useSelector, RootStateOrAny } from 'react-redux';
import { deleteUser, getUser, updateUser } from "../api/user";
import { userLogout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

interface FormValues {
  username: string;
  password: string;
  isAdmin: boolean;
}

const UserSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  isAdmin: Yup.boolean()
});

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootStateOrAny) => state.auth);
  
  console.log('Profile -> isAuthenticated', isAuthenticated)
  console.log('Profile -> user', user)
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [initialValues, setInitialValues] = useState<FormValues>({
    username: '',
    password: '',
    isAdmin: false
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && user._id) {
      fetchUser(user?._id);
    }
  }, [isAuthenticated, user]);

  const fetchUser = async (userId: any) => {
    try {
      console.log('The user id is ', userId)
      
      const userData = await getUser(user?._id);
      setInitialValues({
        username: userData.username,
        password: '',
        isAdmin: userData.isAdmin
      });
    
    } catch (error: any) {
      console.error('Failed to fetch user data:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to fetch user data');
    }
  };

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    if (!user?._id) return;
    setIsUpdating(true);
    try {
      await updateUser(user?._id, {
        username: values.username,
        ...(values.password && { password: values.password }),
        isAdmin: values.isAdmin
      });
      await fetchUser(user?._id);
      // Show success message to user
    } catch (error: any) {
      console.error('Failed to update user:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!user?._id) return;
    setIsDeleting(true);
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        console.log('Profile -> Delete', user?._id)
        await deleteUser(user?._id);
        Cookies.remove('sessionId');
        Cookies.remove('visitorCartId');
        await userLogout();
        navigate('/login');
      } catch (error: any) {
        console.error('Failed to delete user:', error);
        setErrorMessage(error.response?.data?.message || 'Failed to delete user');
      } finally {
        setIsDeleting(false);
      }
    } else {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-1/2 bg-cover bg-center flex items-center justify-center" style={{ minHeight: '100vh' }}>
          <img 
            src={ImageComponent} 
            alt="Login Illustration" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <div className="max-w-md w-full px-6">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>
            <Formik
              initialValues={initialValues}
              validationSchema={UserSchema}
              onSubmit={handleSubmit}
              enableReinitialize
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
                  <div>
                    <label className="flex items-center">
                      <Field type="checkbox" name="isAdmin" className="mr-2" />
                      Is Admin
                    </label>
                  </div>

                  {errorMessage && (
                    <div className="text-red-500 mt-2">{errorMessage}</div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || isUpdating}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      {isUpdating ? 'Updating Profile...' : 'Update Profile'}
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting || isDeleting}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                      onClick={handleDelete}
                    >
                      {isDeleting ? 'Deleting Profile...' : 'Delete Profile'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile