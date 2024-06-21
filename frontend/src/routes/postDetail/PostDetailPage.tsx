import PostContent from "./component/PostContent";
import { useRef, useEffect } from "react";
// import CommentList from "./component/CommentList";
// import InputComment from "./component/InputComment";

export default function PostDetail() {
  // const [opacity, setOpacity] = useState<number>(1);
  const targetRef = useRef(null);  
  const handleScroll = () => {
    console.log("scrolling");
    
    if (window.scrollY > 0) {
      targetRef.current.style.position = "fixed";      
    }
  };

  useEffect(() => {    
    const timer = setInterval(() => {
      window.addEventListener("scroll", handleScroll);
    }, 100);
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // console.log(1 - (window.scrollY / 500));
  return (
    <div>
      <div className="w-full bg-[#000000b5] py-[20%] md:px-[10rem] px-[2rem]  fixed top-0 h-[500px] z-[9]">
        <div>
          <p className={`text-white text-5xl pb-[1rem] opacity-[${1}]`}>제목제목제목</p>
          <p className="text-white">쓴사람</p>
          <p className="text-white">날짜</p>
          <p className="text-white">쓴 사람</p>
        </div>
      </div>
      <div className="bg-white mt-[2rem] md:px-[10rem] px-[2rem] mt-[500px] z-[10] relative">
        <PostContent />
        {/* <InputComment /> */}
        {/* <CommentList /> */}
      </div>
    </div>
  );
}
