import React, {useState} from 'react';
import '../styles/ScrollToTop.css'

function ScrollToTop(){
    const [visible, setVisible] = useState(false)
  
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300){
      setVisible(true)
    } 
    else if (scrolled <= 300){
      setVisible(false)
    }
  };
    function scrollToTop(){
        window.scrollTo({
            top: 0, 
            behavior: 'smooth'
          });
    }
    window.addEventListener('scroll', toggleVisible);

    return <div className="scroll-container" onClick={scrollToTop}>
        {visible && <img src='scroll-up.png' alt="scroll up"/>}
    </div>
}

export default ScrollToTop