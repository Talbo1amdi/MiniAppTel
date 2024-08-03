import { useEffect, useState } from 'react';
import './index.css';
import Arrow from './icons/Arrow';
import { bear, coin, highVoltage, notcoin, rocket, trophy } from './images';

const App = () => {
  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseInt(savedPoints, 10) : 0;
  });
  const [energy, setEnergy] = useState(() => {
    const savedEnergy = localStorage.getItem('energy');
    return savedEnergy ? parseInt(savedEnergy, 10) : 5000;
  });
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number, pointsAdded: number }[]>([]);
  const [activePopup, setActivePopup] = useState<string | null>(null);

  const pointsToAdd = 100;
  const energyToReduce = 100;

  useEffect(() => {
    localStorage.setItem('points', points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem('energy', energy.toString());
  }, [energy]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (energy - energyToReduce < 0) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints(points + pointsToAdd);
    setEnergy(energy - energyToReduce < 0 ? 0 : energy - energyToReduce);
    setClicks([...clicks, { id: Date.now(), x, y, pointsAdded: pointsToAdd }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const handlePopup = (popup: string) => {
    setActivePopup(popup);
  };

  // useEffect hook to restore energy over time
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 1, 6500));
    }, 100); // Restore 10 energy points every second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const Popup = ({ title, content, onClose }: { title: string, content: string, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white text-black p-4 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-lg font-bold">X</button>
        </div>
        <p>{content}</p>
      </div>
    </div>
  );


  return (
    <div className="bg-gradient-main min-h-screen px-4 flex flex-col items-center text-white font-medium">
      <div className="absolute inset-0 h-1/2 bg-gradient-overlay z-0"></div>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="radial-gradient-overlay"></div>
      </div>
      <div className="w-full z-10 min-h-screen flex flex-col items-center text-white">
        <div className="fixed top-0 left-0 w-full px-4 pt-8 z-10 flex flex-col items-center text-white">
          <div className="w-full cursor-pointer">
            <div className="bg-[#1f1f1f] text-center py-2 rounded-xl">
              <a href="https://t.me/pme_metavers" className="text-lg">
                Join Telegram Channel <Arrow size={18} className="ml-0 mb-1 inline-block" />
              </a>
            </div>
          </div>
          <div className="mt-12 text-5xl font-bold flex items-center">
            <img src={coin} width={44} height={44} />
            <span className="ml-2">{points.toLocaleString()}</span>
          </div>
          <div className="text-base mt-2 flex items-center">
            <img src={trophy} width={24} height={24} />
            <span className="ml-1">Gold <Arrow size={18} className="ml-0 mb-1 inline-block" /></span>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 w-full px-4 pb-4 z-10">
          <div className="w-full flex justify-between gap-2">
            <div className="w-1/3 flex items-center justify-start max-w-32">
              <div className="flex items-center justify-center">
                <img src={highVoltage} width={44} height={44} alt="High Voltage" />
                <div className="ml-2 text-left">
                  <span className="text-white text-2xl font-bold block">{energy}</span>
                  <span className="text-white text-large opacity-75">/ 6500</span>
                </div>
              </div>
            </div>
            <div className="flex-grow flex items-center max-w-60 text-sm">
              <div className="w-full bg-[#fad258] py-4 rounded-2xl flex justify-around">
                <button className="flex flex-col items-center gap-1" onClick={() => handlePopup('Frens')}>
                  <img src={bear} width={24} height={24} alt="High Voltage" />
                  <span>Frens</span>
                </button>
                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1" onClick={() => handlePopup('Earn')}>
                  <img src={coin} width={24} height={24} alt="High Voltage" />
                  <span>Earn</span>
                </button>
                <div className="h-[48px] w-[2px] bg-[#fddb6d]"></div>
                <button className="flex flex-col items-center gap-1" onClick={() => handlePopup('Boosts')}>
                  <img src={rocket} width={24} height={24} alt="High Voltage" />
                  <span>Boosts</span>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full bg-[#f9c035] rounded-full mt-4">
            <div className="bg-gradient-to-r from-[#f3c45a] to-[#fffad0] h-4 rounded-full" style={{ width: `${(energy / 6500) * 100}%` }}></div>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="relative mt-4" onClick={handleClick}>
            <img src={notcoin} width={256} height={256} alt="notcoin" />
            {clicks.map((click) => (
              <div
                key={click.id}
                className="absolute text-5xl font-bold opacity-0"
                style={{
                  top: `${click.y - 42}px`,
                  left: `${click.x - 28}px`,
                  animation: `float 1s ease-out`
                }}
                onAnimationEnd={() => handleAnimationEnd(click.id)}
              >
                {click.pointsAdded}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Pop-up rendering */}
      {activePopup === 'Frens' && (
        <Popup 
          title="Frens" 
          content="Wait for Frens content."
          onClose={() => setActivePopup(null)}
        />
      )}
      {activePopup === 'Earn' && (
        <Popup 
          title="Earn" 
          content="Wait for Earn content."
          onClose={() => setActivePopup(null)}
        />
      )}
      {activePopup === 'Boosts' && (
        <Popup 
        title="Earn" 
        content="Wait for Boost content."
        onClose={() => setActivePopup(null)}
      />
      )}
    </div>
  );
};

export default App;
