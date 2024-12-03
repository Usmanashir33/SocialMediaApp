import { createContext, useEffect, useState } from "react";
export const uiContext = createContext();

const UiContextProvider = ({children}) => {
    const [showLogOut,setShowLogOut] = useState('hidden');
   
    const hideAllDD = () => {
          const dropChilderen = document.querySelectorAll('.dropdown');
          if (dropChilderen){
              dropChilderen.forEach((dropchild) => {
                  dropchild.classList.add("hidden")
              });
          }
        };
    const showCardDD = (e,containerId) => {
        const dotContainer = document.querySelector(`#${containerId}`);
        hideAllDD();
        dotContainer.classList.remove("hidden");
        e.stopPropagation();
    }
    document.addEventListener('click',() => {
          hideAllDD();
          setShowLogOut('hidden');
    })
    
    const stopChildLinks = () => {
        document.querySelectorAll('.child-link').forEach((child) => {
          child.addEventListener("click",(event) => {
            // console.log(event.target);
            console.log('child link clicked');
            event.stopPropagation();
          })
        })
      }
    useEffect(() => {
        stopChildLinks()
    })

    const themes = {
        "light" : {
            "bgColor" : "#fffdfd",
            "bgColor2" : "#f2fcfe",

            "iconColor" : "#3ca4cc",
            "iconColor2" : "#3ca4cc",
            "color" : "#000506",
            "color2" : "#4d3f5a",
        },
        "dark" : {
            "bgColor" : "#1d1e1d",
            "bgColor2" : "#090001",

            "iconColor" : "#4af5c9",
            "iconColor2" : "#6ab866",
            "color" : "#e9e7e8",
            "color2" : "#fffdfd",
        },
        "blank" : {
            "bgColor":"",
            "bgColor2":"",
            "iconColor":"",
            "color":"",
        },
    }
     const [theme,setTheme]= useState(() => 
        localStorage.getItem("currentTheme")? JSON.parse(localStorage.getItem("currentTheme")) : themes['light']
    )
    const chooseTheme = (choice) => {
        let choosed = themes[choice]
        setTheme(choosed)
        if (choosed) {
            localStorage.setItem("currentTheme",JSON.stringify(choosed))
        }
    }
    return ( 
    <uiContext.Provider value={{
        showCardDD,showLogOut,setShowLogOut,hideAllDD,
        theme,chooseTheme
    }}>
        {children}
    </uiContext.Provider> 
    );
}
 
export default UiContextProvider;