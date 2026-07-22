import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);


  useEffect(() => {

    checkSession();

  }, []);



  async function checkSession() {

    const {
      data,
    } = await supabase.auth.getSession();


    if (data.session) {

      setAuthenticated(true);

    } else {

      setAuthenticated(false);

    }


    setLoading(false);

  }



  if (loading) {

    return (
      <div>
        Checking authentication...
      </div>
    );

  }



  if (!authenticated) {

    return <Navigate to="/login" replace />;

  }



  return children;

}


export default ProtectedRoute;