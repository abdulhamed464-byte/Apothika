import { useEffect } from "react";
import { AuthSession } from "../services/auth/AuthSession";


function TestAuth(){

useEffect(()=>{

async function check(){

const user =
await AuthSession.getCurrentUser();


console.log(
"USER FROM APP:",
user
);


}


check();


},[]);



return (

<h1>
Checking Auth...
</h1>

);


}


export default TestAuth;