function AISection(){


const intelligence=[

{
icon:"🔮",
title:"Demand Prediction",
desc:"AI analyses sales patterns and predicts future product demand."
},


{
icon:"⚡",
title:"Smart Replenishment",
desc:"Automatically recommends when and how much stock to reorder."
},


{
icon:"📈",
title:"Business Forecasting",
desc:"Understand trends, revenue opportunities and operational risks."
},


{
icon:"🤖",
title:"Decision Intelligence",
desc:"Turn business data into actionable recommendations."
}

];



return(

<section className="ai-section">


<div className="ai-header">


<div className="ai-badge">

🤖 APOTHIKA Intelligence Layer

</div>



<h2>

Your Business.
<br/>

<span className="gradient-text">

Powered by Intelligence.

</span>

</h2>



<p>

Future-ready AI systems that predict demand,
optimise operations and help businesses make
smarter decisions.

</p>


</div>





<div className="ai-grid">


{

intelligence.map((item)=>(


<div

className="ai-card-box"

key={item.title}

>


<div className="ai-icon">

{item.icon}

</div>



<h3>

{item.title}

</h3>



<p>

{item.desc}

</p>


</div>


))

}


</div>



</section>

);


}


export default AISection;