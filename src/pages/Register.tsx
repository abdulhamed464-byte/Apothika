import { useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/Auth/AuthService";
import { OnboardingService } from "../services/Auth/Onboarding/OnboardingService";


const industries = [
  {
    id: "a21d2941-66cd-4afd-b2b7-eca3b6f7a589",
    name: "Pharmacy",
  },
  {
    id: "a606eade-9908-4f0d-8efe-8f971ae42223",
    name: "Restaurant",
  },
  {
    id: "fb0d75c6-591b-4c19-8261-35f4e881f2f9",
    name: "Warehouse",
  },
  {
    id: "6a5c67f0-4c23-42dd-9ed8-e2cc28bec0ff",
    name: "Retail",
  },
  {
    id: "c5a2f4e1-040c-45b7-88b7-9f99ccb964ea",
    name: "Manufacturing",
  },
  {
    id: "9bfb389b-0860-46db-b190-1c4aea246628",
    name: "Hospital",
  },
];


function Register() {

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    country: "",
    industry: "",
    currency: "",
    password: "",
    confirmPassword: "",
  });


  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setError("");
    setMessage("");


    if (
      !formData.businessName ||
      !formData.ownerName ||
      !formData.email ||
      !formData.phone ||
      !formData.country ||
      !formData.industry ||
      !formData.currency ||
      !formData.password ||
      !formData.confirmPassword
    ) {

      setError("Please fill in all fields.");
      return;

    }


    if (formData.password !== formData.confirmPassword) {

      setError("Passwords do not match.");
      return;

    }


    setLoading(true);


    try {

      const response = await AuthService.register({

        businessName: formData.businessName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        industry: formData.industry,
        currency: formData.currency,
        password: formData.password,

      });


      if (!response.success || !response.user) {

        setError(response.message);
        return;

      }


      await OnboardingService.createWorkspace(
        response.user.id,
        {
          businessName: formData.businessName,
          country: formData.country,
          currency: formData.currency,
          phone: formData.phone,
          email: formData.email,
          industryId: formData.industry,
        }
      );


      setMessage(
        "Registration successful. Please verify your email."
      );


      setFormData({

        businessName: "",
        ownerName: "",
        email: "",
        phone: "",
        country: "",
        industry: "",
        currency: "",
        password: "",
        confirmPassword: "",

      });


    } catch (error) {

      console.error(error);

      setError(
        "Registration completed but workspace creation failed."
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen login-page">

      <div className="glow glow-left"></div>
      <div className="glow glow-right"></div>


      <div className="glass-card register-card">

        <h1 className="company-name register-title">
          Register Business
        </h1>

        <div className="underline"></div>


        <form
          className="register-form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            name="businessName"
            placeholder="Business Name"
            className="form-input"
            value={formData.businessName}
            onChange={handleChange}
          />


          <input
            type="text"
            name="ownerName"
            placeholder="Owner Name"
            className="form-input"
            value={formData.ownerName}
            onChange={handleChange}
          />


          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
          />


          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className="form-input"
            value={formData.phone}
            onChange={handleChange}
          />


          <select
            name="country"
            className="form-input"
            value={formData.country}
            onChange={handleChange}
          >

            <option value="">
              Select Country
            </option>

            <option value="India">
              India
            </option>

            <option value="UAE">
              UAE
            </option>

          </select>


          <select
            name="industry"
            className="form-input"
            value={formData.industry}
            onChange={handleChange}
          >

            <option value="">
              Select Industry
            </option>


            {industries.map((industry) => (

              <option
                key={industry.id}
                value={industry.id}
              >
                {industry.name}
              </option>

            ))}


          </select>


          <select
            name="currency"
            className="form-input"
            value={formData.currency}
            onChange={handleChange}
          >

            <option value="">
              Select Currency
            </option>

            <option value="INR">
              INR
            </option>

            <option value="AED">
              AED
            </option>

            <option value="USD">
              USD
            </option>

          </select>


          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
          />


          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="form-input"
            value={formData.confirmPassword}
            onChange={handleChange}
          />


          {error && (
            <p style={{color:"#ff6b6b", textAlign:"center"}}>
              {error}
            </p>
          )}


          {message && (
            <p style={{color:"#51cf66", textAlign:"center"}}>
              {message}
            </p>
          )}


          <button
            type="submit"
            className="btn btn-primary register-button"
            disabled={loading}
          >

            {loading
              ? "Creating Business..."
              : "Create Business"}

          </button>


          <p className="login-link">
            Already have an account?{" "}
            <Link to="/">
              Login
            </Link>
          </p>


        </form>

      </div>

    </div>

  );

}


export default Register;