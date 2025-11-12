import { useState } from "react"
import '../style/FQAitem.css'

type QAitem = {
    question: String,
    answer: String
}

export function QA({question,answer}: QAitem){
    const[clicked,setClicked] = useState(false)
    const[symbol,setSymbol] = useState('+')

    
    function handleClick(){
        handleSymbol()
        setClicked(!clicked)
    }
    
    
    function handleSymbol(){
       setSymbol(prev => (prev === '+' ? '-' : '+'));
        
    }


    return(
        <div>
          {!clicked ? 
          <><div className="question">
             <h2 className="q">{question}</h2>
             <p onClick={handleClick} className="symbol">{symbol}</p>
           </div></>
          :  
          <>
             <div className="answer">
                <div className="QaSymbol">
                   <h1 className="q">{question}</h1>
                   <p className="symbol" onClick={handleClick}>{symbol}</p>
                </div>
                <h3 className="a">{answer}</h3>
                
             </div>
             </> 
              }
        </div>
    )
}