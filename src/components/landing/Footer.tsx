import { Link } from "react-router-dom";


function Footer(){


return(

<>


<section className="cta-section">


<div className="cta-box">


<h2>

Ready to transform your business?

</h2>



<p>

Join APOTHIKA and manage your entire business
ecosystem from one intelligent ERP platform.

</p>




<div className="cta-buttons">


<Link

to="/register"

className="primary-btn"

>

Start Free

</Link>




<Link

to="/login"

className="secondary-btn"

>

Login

</Link>


</div>



</div>


</section>





<footer className="footer">



<div className="footer-brand">


<h2>

APOTHIKA

</h2>



<p>

Intelligent Business Operating System

</p>


</div>




<div className="footer-links">


<span>
ERP Platform
</span>


<span>
AI Intelligence
</span>


<span>
Inventory
</span>


<span>
Manufacturing
</span>


<span>
Operations
</span>


</div>




<p className="copyright">

© {new Date().getFullYear()} APOTHIKA. All rights reserved.

</p>



</footer>


</>

);


}


export default Footer;