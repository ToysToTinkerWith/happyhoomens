import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [displaySplashScreen, setDisplaySplashScreen] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setDisplaySplashScreen(false);
    }, 6000);
  }, []);

  return (
    <div style={{ 
      backgroundColor: "#1c1c1c",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      display: displaySplashScreen ? "flex" : "none"
    }}>
      <div style={{
        width: "200px",
        height: "200px",
        backgroundColor: "#1c1c1c",
        backgroundImage: "url('images/Treats.svg')",
        backgroundSize: "103%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        animationName: "pulse",
        animationDuration: "4s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: 1
      }}></div>
    </div>
  );
}