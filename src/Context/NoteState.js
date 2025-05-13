import Notecontext from "./NoteContext"; 
import { useState } from "react";  
const Notestate=(props)=>{  
    const s1={ 
        "name":"harry", 
        "class":"5b"
    } 
    const [state,setState]=useState(s1); 
    const update=()=>{ 
        setTimeout(() => {
            setState({ 
                "name":"Larry", 
                "class":"10b"
            })
        }, 1000);
    }
   return(
    <Notecontext.Provider value={{state,update}}> 
        {props.children}
    </Notecontext.Provider>
   ) 
}

export default Notestate;