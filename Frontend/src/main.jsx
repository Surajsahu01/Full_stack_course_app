import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
const stripePromise = loadStripe("pk_test_51QuJhTDCbfz6mJUxODKhJNgZBHcwuv4wwhcyrdOxWmpfKu9RVSMjYxdOZkR0jzaxZLdoXyeQV9uqbtk5ow6pzy8e00Iai3KMou");

createRoot(document.getElementById('root')).render(

    <Elements stripe={stripePromise}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
      </Elements>
     
)
