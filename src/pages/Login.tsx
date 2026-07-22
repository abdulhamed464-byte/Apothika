import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthService from "../services/Auth/AuthService";


function Login() {

  const navigate = useNavigate();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);



  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {

    e.preventDefault();

    setError("");

    setLoading(true);


    const response = await AuthService.login({
      email,
      password,
    });


    if (!response.success) {

      setError(response.message);

      setLoading(false);

      return;

    }


    navigate("/dashboard");


    setLoading(false);

  }



  return (

    <div className="min-h-screen login-page">


      <div className="glow glow-left"></div>

      <div className="glow glow-right"></div>



      <div className="glass-card">


        <div className="logo-box">

          <div className="logo-inner">
            A
          </div>

        </div>



        <h1 className="company-name">
          APOTHIKA
        </h1>


        <div className="underline"></div>



        <p className="tagline">
          Manage Inventory. Simplify Billing. Grow Your Business.
        </p>



        <form
          onSubmit={handleLogin}
          className="register-form"
        >


          <input
            type="email"
            placeholder="Email Address"
            className="form-input"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />



          <input
            type="password"
            placeholder="Password"
            className="form-input"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />



          {error && (

            <p
              style={{
                color:"#ff6b6b",
                textAlign:"center"
              }}
            >
              {error}
            </p>

          )}



          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"
            }

          </button>



          <p className="login-link">

            New business?{" "}

            <Link to="/register">
              Create Workspace
            </Link>

          </p>



        </form>


      </div>


    </div>

  );

}


export default Login;