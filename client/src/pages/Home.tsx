import Layout from "../components/layout"
import ProductList from "./ProductList"
import { useSelector, RootStateOrAny } from 'react-redux';

const Home = () => { 
    const {isAuthenticated, user} = useSelector((state: RootStateOrAny) => state.auth)
    // console.log(user)
    return(
        <Layout>
            <h1 className="text-3xl font-bold mb-6">{isAuthenticated ? `Welcome, ${user.username}` : 'Welcome to my shop'} </h1>
            <ProductList />

        </Layout>
    )
}

export default Home