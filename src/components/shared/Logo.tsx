import logo from "../../assets/logo/apothika-logo.svg";


interface Props{

size?:number;

}


function Logo({

size=160

}:Props){


return (

<img

src={logo}

width={size}

alt="APOTHIKA"

/>

);

}


export default Logo;