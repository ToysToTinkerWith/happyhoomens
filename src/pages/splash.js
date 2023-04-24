import { useEffect } from 'react';

export default function SplashScreen() {
  useEffect(() => {
    setTimeout(() => {
      document.querySelector('.splash-screen').style.display = 'none';
    }, 6000);
  }, []);

  const pulseAnimation = {
    '@keyframes pulse': {
      '0%': {
        transform: 'scale(0.8)',
        opacity: 0.5,
      },
      '100%': {
        transform: 'scale(1)',
        opacity: 1,
      },
    },
    animationName: 'pulse',
    animationDuration: '4s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 1,
  };

  return (
    <div className="splash-screen" style={{ 
      backgroundColor: "#1c1c1c",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <div style={{
        width: "200px",
        height: "200px",
        border: "10px solid #fff",
        borderRadius: "50%",
        backgroundColor: "#1c1c1c",
        backgroundImage: "url('images/Treats.svg')",
        backgroundSize: "103%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        ...pulseAnimation,
      }}></div>
    </div>
  );
}
