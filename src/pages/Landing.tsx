import Hero from "../components/landing/Hero";
import Industries from "../components/landing/Industries";
import Features from "../components/landing/Features";
import AISection from "../components/landing/AISection";
import LogisticsSection from "../components/landing/LogisticsSection";
import Footer from "../components/landing/Footer";

import "../styles/landing.css";


function Landing(){

return (

<div className="landing-page">

<Hero />

<Industries />

<Features />

<AISection />

<LogisticsSection />

<Footer />

</div>

);

}


export default Landing;