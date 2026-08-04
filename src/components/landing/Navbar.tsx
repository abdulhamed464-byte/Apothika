import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "../brand/Logo";


function Navbar(){

const [menuOpen,setMenuOpen] = useState(false);


return(

<nav className="navbar">


<Logo />



<div 
className={`nav-links ${menuOpen ? "active" : ""}`}
>


<a 
href="#industries"
onClick={()=>setMenuOpen(false)}
>
Industries
</a>



<a 
href="#features"
onClick={()=>setMenuOpen(false)}
>
Features
</a>



<a 
href="#ai"
onClick={()=>setMenuOpen(false)}
>
AI Intelligence
</a>



<a 
href="#logistics"
onClick={()=>setMenuOpen(false)}
>
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





<button

className="mobile-menu"

onClick={()=>setMenuOpen(!menuOpen)}

>

☰

</button>




</nav>

);

}


export default Navbar;