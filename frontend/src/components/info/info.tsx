import React, { useState, useEffect } from "react";
import "./Info.css";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

export default function Info() {
  const [show, setShow] = useState(false);
  const [mainShow, setMainShow] = useState(true);
  const [show2,setShow2] = useState(false);
  const [step, setStep] = useState(0);
  const navigate=useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "1. 홈에 들어간다",
      image: "https://pd-portfolio-jeho.s3.ap-northeast-2.amazonaws.com/s3.png"
    },
    {
      title: "2. 로그인을 한다",
      image: "https://pd-portfolio-jeho.s3.ap-northeast-2.amazonaws.com/s3+2.png"
    },
    {
      title: "3. write 작성",
      image: "https://pd-portfolio-jeho.s3.ap-northeast-2.amazonaws.com/s3+3.png"
    },
    {
      title: "4. 툴 이용법",
      image: "https://pd-portfolio-jeho.s3.ap-northeast-2.amazonaws.com/%EC%A0%84%EC%B2%B4%EC%A0%81+%ED%88%B4+%EC%82%AC%EC%9A%A9.mp4",
      description: "에디터에 키보드 /버튼을 누르거나 왼쪽에 +버튼을 누를시 나옵니다"
    },
    {
      title: "5. 기본 제공 기능",
      image: "https://pd-portfolio-jeho.s3.ap-northeast-2.amazonaws.com/%EC%95%A0%EB%8B%88%ED%94%8C%EB%9F%AC%EC%8A%A4.mp4",
      description: "이미지 복붙하는 기능입니다."
    },
    {
      title: "6. 주가 차트 기능",
      image: "https://pd-portfolio-jeho.s3.ap-northeast-2.amazonaws.com/%EC%A3%BC%EA%B0%80+%EC%B0%A8%ED%8A%B8.mp4"
    },
    {
      title: "7. 애널리스트 툴",
      image: "https://pd-portfolio-jeho.s3.ap-northeast-2.amazonaws.com/%EC%95%A0%EB%84%90%EB%A6%AC%EC%8A%A4%ED%8A%B8+11.mp4"
    },
    {
      title: "8. 재무재표 툴",
      image: "https://pd-portfolio-jeho.s3.ap-northeast-2.amazonaws.com/%EC%9E%AC%EB%AC%B4%EC%9E%AC%ED%91%9C.mp4"
    },
    {
      title: "9. 공시 툴",
      image: "https://pd-portfolio-jeho.s3.ap-northeast-2.amazonaws.com/%EA%B3%B5%EC%8B%9C+11.mp4"
    },
    {
      title: "10. 다양한 기능",
      description: "이외에도, 팔로우 팔로워 마이페이지등, 다양한 기능이 마련되어있으니, 한번 확인해보세요!"
    }
  ];

  useEffect(() => {
    if (show) {
      const timers = [
        setTimeout(() => setStep(1), 2000), // 첫 번째 세 줄 텍스트
        setTimeout(() => setStep(2), 6000), // 텍스트 사라짐
        setTimeout(() => setStep(3), 7000), // 이미지 나타남
        setTimeout(() => setStep(4), 10000), // 이미지 사라짐
        setTimeout(() => setStep(5), 11000),
        setTimeout(() => setStep(6), 16000),
        setTimeout(() => setStep(7), 19000),
        setTimeout(() => setStep(8), 23000),
        setTimeout(() => setStep(9), 28000),
        setTimeout(() => setStep(10), 31000)
      ];

      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [show]);

  useEffect(()=>{
    if(show){
        const typingSound = new Audio('https://pd-portfolio-jeho.s3.ap-northeast-2.amazonaws.com/%5B%EB%AC%B4%EB%A3%8C+%ED%9A%A8%EA%B3%BC%EC%9D%8C+%EC%86%8C%EC%8A%A4%5D%ED%83%80%EC%9E%90%EA%B8%B0+%EC%86%8C%EB%A6%AC+%ED%9A%A8%EA%B3%BC%EC%9D%8C+Typewriter+Sound.mp3');
      typingSound.loop = true;
      typingSound.play();

      return () => typingSound.pause();
    }
  },[show])

  useEffect(() => {
    if (step === 10) {
      setShow(false);
      setShow2(true);
    }
  }, [step]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } 
  };
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } 
  };

  const renderMedia = (step) => {
    if (step.image) {
      if (step.image.endsWith(".mp4")) {
        return (
          <video key={step.image} controls className="my-4 max-w-full max-h-full">
            <source src={step.image} type="video/mp4" />
          </video>
        );
      } else {
        return <img src={step.image} alt={step.title} className="my-4 max-w-full max-h-full" />;
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      {mainShow && (
        <>
          <div className="flex items-center mb-12">
            <span className="text-8xl font-bold text-white">T</span>
            <span className="text-8xl font-bold text-white rest">yper</span>
          </div>
          <div className="flex flex-col items-center info-content">
            <span className="text-4xl text-white font-bold">주식투자자들을 위한 투자일지</span>
            <button
              onClick={() => {
                setMainShow(false);
                setShow(true);
              }}
              className="mt-4 px-4 py-2 text-black bg-white rounded button-content"
            >
              사용방법
            </button>
          </div>
        </>
      )}
      {show && (
        <div className="relative bg-white w-[800px] h-[550px] flex items-center justify-center p-6 fade-in">
          {step === 1 && (
            <>
              <TypingText text="평소, 주식 스터디를 진행하면서 각자 리포트 쓸동안 불편한 점 을 발견하였습니다." />
              
            </>
          )}
          {step === 3 && (
            <img
              className=" w-[300px] h-auto "
              src="https://github.com/lemonticsoul/web_advanced/assets/127959482/f71dad61-293c-4f2f-9665-7549c74b6cec"
              alt="Example"
            />
          )}
          {step === 5 && (
            <>
              <TypingText text="주식 리포트를 쓸때 귀찮게, 리포트나 다트를 들어가서 캡처하고 복붙하고..."
        
              
                />
            </>
          )}
          {step === 6 && (
            <>
              <TypingText text="
               글을 집중할 수도 모자라 쓸데없는 시간을 낭비했습니다."
              
                />
            </>
          )}
          {step === 7 && (
            <>
              <TypingText text="그래서,이 문제를 위해 저희가 준비했습니다."></TypingText>
              
              
                
            </>
          )}
          {step === 8 && (
            <>
              <TypingText text="그것은, 리포트를 쓸때 공시,재무재표를 기업이름만 검색하면 
              리포트에 자동으로 작성되는 그런 툴.."></TypingText>
              
              
                
            </>
          )}
          {step === 9 && (
            <>
              <TypingText text="리포트를 열심히 쓰는 당신께 자동화 툴 타이퍼를 선물합니다."></TypingText>
            
            </>
          )}
          

        </div>

        )}
        {show2 &&(
                <div className="relative bg-black w-full h-screen flex flex-col items-center justify-center p-6 fade-in">
                    
                <Card className="w-[800px] h-[650px] flex flex-col items-center justify-center p-6">
                    <div className="text-xl font-bold">{steps[currentStep].title}</div>

                  {renderMedia(steps[currentStep])}
                  {steps[currentStep].description && <div className="text-lg text-center mt-4">{steps[currentStep].description}</div>}
                </Card>
                <div className="fixed bottom-4 flex space-x-4">
                  <Button onClick={prevStep} className=" bg-black  border-none mt-4">이전</Button>
                  
                  <Button onClick={() => { navigate("/") }} className=" bg-black border-none mt-4">홈으로</Button>
                  <Button onClick={nextStep} className="bg-black border-none mt-4">다음</Button>
                </div>
              </div>
            )
        }
    </div>
  );
}

function TypingText({ text }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setContent(text.slice(0, index));
      index++;
      if (index > text.length) {
        clearInterval(typingInterval);
      }
    }, 20);

    return () => clearInterval(typingInterval);
  }, [text]);

  return (
    <span className="typing-text font-bold text-lg text-center mb-4">
      {content}
    </span>
  );
}



