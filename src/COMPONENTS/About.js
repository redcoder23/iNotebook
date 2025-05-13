 import { useContext,React,useEffect} from 'react' 
 import notecontext from '../Context/NoteContext'
const About = () => { 
  const a=useContext(notecontext);   
  useEffect(()=>{   
     a.update()  
     //eslint-disable-next-line
  },[])
  return (
    <div>
       This is about {a.state.name} and he is in class {a.state.class}
    </div>
  )
}

export default About
