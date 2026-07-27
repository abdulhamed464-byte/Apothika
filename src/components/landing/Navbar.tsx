import { Link } from "react-router-dom";
import Logo from "../brand/Logo";


function Navbar(){


return(

<nav className="navbar">


<Logo />



<div className="nav-links">


<a href="#industries">
Industries
</a>


<a href="#features">
Features
</a>


<a href="#ai">
AI Intelligence
</a>


<a href="#logistics">
Logistics
</a>


</div>



<div className="nav-actions">


<Link
to="/login"
className="nav-login"
>
Login
</Link>



<Link
to="/register"
className="nav-start"
>
Start Free
</Link>


</div>


</nav>

);

}


export default Navbar;