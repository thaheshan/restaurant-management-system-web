import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './WaitingTime.scss';

interface Step {
  id: number;
  label: string;
}

const steps: Step[] = [
  { id: 1, label: 'Order placed' },
  { id: 2, label: 'Start prep' },
  { id: 3, label: 'In-progress' },
  { id: 4, label: 'Served' },
];

const WaitingTime: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [minutes, setMinutes] = useState(15);
  const [seconds, setSeconds] = useState(0);

  // Simulate countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev === 0) {
          if (minutes === 0) {
            clearInterval(timer);
            return 0;
          }
          setMinutes((m) => m - 1);
          return 59;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes]);

  // Simulate step progression
  useEffect(() => {
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 4) {
          clearInterval(stepTimer);
          return 4;
        }
        return prev + 1;
      });
    }, 8000);

    return () => clearInterval(stepTimer);
  }, []);

  const handleProceedToBill = () => {
    navigate('/bill');
  };

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="waiting-page">
      <Header />

      <div className="waiting-page__content">
        <div className="waiting-page__timer-section">
          <p className="waiting-page__timer-label">Estimated waiting time</p>
          <div className="waiting-page__timer">
            <span className="waiting-page__time-value">{pad(minutes)}</span>
            <span className="waiting-page__time-unit">Min</span>
            <span className="waiting-page__time-separator">:</span>
            <span className="waiting-page__time-value">{pad(seconds)}</span>
            <span className="waiting-page__time-unit">Sec</span>
          </div>
        </div>

        <div className="waiting-page__tracker">
          <div className="waiting-page__steps">
            {steps.map((step, index) => (
              <div key={step.id} className="waiting-step">
                <div className="waiting-step__top">
                  {index > 0 && (
                    <div
                      className={`waiting-step__line ${
                        currentStep > step.id - 1
                          ? 'waiting-step__line--active'
                          : ''
                      }`}
                    />
                  )}
                  <div
                    className={`waiting-step__circle ${
                      currentStep >= step.id
                        ? 'waiting-step__circle--active'
                        : ''
                    }`}
                  >
                    {step.id}
                  </div>
                </div>
                <span
                  className={`waiting-step__label ${
                    currentStep >= step.id
                      ? 'waiting-step__label--active'
                      : ''
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="waiting-page__illustration">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&h=400&fit=crop"
            alt="Food being prepared"
            className="waiting-page__illustration-img"
          />
        </div>

        <button
          className="waiting-page__proceed-btn"
          onClick={handleProceedToBill}
          id="waiting-proceed-btn"
        >
          Proceed to Bill
        </button>
      </div>
    </div>
  );
};

export default WaitingTime;
