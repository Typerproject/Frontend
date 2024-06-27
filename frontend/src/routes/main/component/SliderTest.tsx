import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
import { useEffect, useState } from "react";
import postAPI, { IPostSlider } from "../../../api/postDetailAPI";
import { useNavigate } from "react-router-dom";

const postService = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

const StyledSlider = styled(Slider)`
  .slick-prev,
  .slick-next {
    width: 50px;
    height: 50px;
    z-index: 1;

    &:before {
      font-size: 80px;
    }
  }

  @media (max-width: 470px) {
    .slick-track,
    .slick-list {
      height: 400px;
    }

    .slick-prev:before,
    .slick-next:before {
      display: none;
    }

    height: 400px;
  }
`;

const SliderTest: React.FC = () => {
  const [posts, setPosts] = useState<IPostSlider[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    postService
      .getPostListForSlide()
      .then((data) => {
        console.log("슬라이드 데이터 체크", data);
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("슬라이드 데이터 체크 에러", err);
        setLoading(false);
      });
  }, []);

  const settings = {
    className: "slider variable-width",
    dots: true,
    infinite: true,
    centerMode: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  function NextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          marginRight: "60px",
          opacity: 0.35,
        }}
        onClick={onClick}
      />
    );
  }

  function PrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          marginLeft: "30px",
          opacity: 0.35,
        }}
        onClick={onClick}
      />
    );
  }

  if (loading) {
    return (
      <>
        <div className="w-[100%] h-[400px] flex flex-row gap-[20px]">
          <div className="w-[20%] flex flex-col gap-[20px]">
            <div className="bg-gray-200 h-[50%] rounded-md" />
            <div className="bg-gray-200 h-[50%] rounded-md" />
          </div>
          <div className="bg-gray-200 w-[60%] rounded-md" />
          <div className="bg-gray-200 w-[20%] rounded-md" />
        </div>
      </>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mt-8 mx-4 text-center">게시글이 하나도 없습니다!</div>
    );
  }

  return (
    <div className="">
      <style>
        {`
        @font-face {
            font-family: 'KCC-eunyoung';
            src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/KCC-eunyoung-Regular.woff') format('woff');
            font-weight: normal;
            font-style: normal;
        }
        `}
      </style>
      <StyledSlider {...settings}>
        {posts[0] && (
          <div>
            <div
              style={{
                width: 400,
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${posts[0].preview.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.3s ease, filter 0.3s ease",
                filter: "brightness(1)",
              }}
              className="h-[400px] cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(70%)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
              onClick={() => navigate(`/post/${posts[0]._id}`)}
            >
              <div className="flex flex-col items-center justify-center gap-12 h-full text-white text-center">
                <p
                  style={{
                    fontSize: `${posts[0].title.length < 10 ? `40px` : `27px`}`,
                    color: "white",
                    wordBreak: "break-word",
                    width: "80%",
                  }}
                >
                  {posts[0].title}
                </p>
                <p
                  style={{
                    fontSize: "24px",
                    fontFamily: "KCC-eunyoung, sans-serif",
                    wordBreak: "break-word",
                    color: "white",
                  }}
                >
                  by {posts[0].writer.nickname}
                </p>
              </div>
            </div>
          </div>
        )}
        {posts[1] && (
          <div>
            <div
              style={{
                width: 400,
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${posts[1].preview.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.3s ease, filter 0.3s ease",
                filter: "brightness(1)",
              }}
              className="h-[400px] cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(70%)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
              onClick={() => navigate(`/post/${posts[1]._id}`)}
            >
              <div className="flex flex-col items-center justify-center gap-12 h-full text-white text-center">
                <p
                  style={{
                    fontSize: `${posts[1].title.length < 10 ? `40px` : `27px`}`,
                    color: "white",
                    wordBreak: "break-word",
                    width: "80%",
                  }}
                >
                  {posts[1].title}
                </p>
                <p
                  style={{
                    fontSize: "24px",
                    fontFamily: "KCC-eunyoung, sans-serif",
                    wordBreak: "break-word",
                    color: "white",
                  }}
                >
                  by {posts[1].writer.nickname}
                </p>
              </div>
            </div>
          </div>
        )}
        {posts[2] && posts[3] && (
          <div>
            <div
              style={{
                width: 200,
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${posts[2].preview.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.3s ease, filter 0.3s ease",
                filter: "brightness(1)",
              }}
              className="h-[200px] cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(70%)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
              onClick={() => navigate(`/post/${posts[2]._id}`)}
            >
              <div className="flex flex-col items-center justify-center gap-12 h-full text-white text-center">
                <p
                  style={{
                    fontSize: "21px",
                    color: "white",
                    wordBreak: "break-word",
                    width: "80%",
                    lineHeight: "1.2", // 줄 간격 조절
                    margin: "0", // 기본 마진 제거
                    padding: "0", // 기본 패딩 제거
                  }}
                >
                  {posts[2].title.length > 13
                    ? `${posts[2].title.substring(0, 13)}...`
                    : posts[2].title}
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    fontFamily: "KCC-eunyoung, sans-serif",
                    wordBreak: "break-word",
                    color: "white",
                  }}
                >
                  by {posts[2].writer.nickname}
                </p>
              </div>
            </div>
            <div
              style={{
                width: 200,
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${posts[3].preview.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.3s ease, filter 0.3s ease",
                filter: "brightness(1)",
              }}
              className="h-[200px] cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(70%)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
              onClick={() => navigate(`/post/${posts[3]._id}`)}
            >
              <div className="flex flex-col items-center justify-center gap-12 h-full text-white text-center">
                <p
                  style={{
                    fontSize: "21px",
                    color: "white",
                    wordBreak: "break-word",
                    width: "80%",
                    lineHeight: "1.2", // 줄 간격 조절
                    margin: "0", // 기본 마진 제거
                    padding: "0", // 기본 패딩 제거
                  }}
                >
                  {posts[3].title.length > 13
                    ? `${posts[3].title.substring(0, 13)}...`
                    : posts[3].title}
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    fontFamily: "KCC-eunyoung, sans-serif",
                    wordBreak: "break-word",
                    color: "white",
                  }}
                >
                  by {posts[3].writer.nickname}
                </p>
              </div>
            </div>
          </div>
        )}
        {posts[4] && posts[5] && (
          <div>
            <div>
              <div
                style={{
                  width: 400,
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${posts[4].preview.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transition: "transform 0.3s ease, filter 0.3s ease",
                  filter: "brightness(1)",
                }}
                className="h-[200px] cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "brightness(70%)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "brightness(1)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={() => navigate(`/post/${posts[4]._id}`)}
              >
                <div className="flex flex-col items-center justify-center gap-12 h-full text-white text-center">
                  <p
                    style={{
                      fontSize: "25px",
                      color: "white",
                      wordBreak: "break-word",
                      width: "80%",
                      lineHeight: "1.2", // 줄 간격 조절
                      margin: "0", // 기본 마진 제거
                      padding: "0", // 기본 패딩 제거
                    }}
                  >
                    {posts[4].title.length > 13
                      ? `${posts[4].title.substring(0, 13)}...`
                      : posts[4].title}
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "KCC-eunyoung, sans-serif",
                      wordBreak: "break-word",
                      color: "white",
                    }}
                  >
                    by {posts[4].writer.nickname}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div
                style={{
                  width: 400,
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${posts[5].preview.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transition: "transform 0.3s ease, filter 0.3s ease",
                  filter: "brightness(1)",
                }}
                className="h-[200px] cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "brightness(70%)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "brightness(1)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={() => navigate(`/post/${posts[5]._id}`)}
              >
                <div className="flex flex-col items-center justify-center gap-12 h-full text-white text-center">
                  <p
                    style={{
                      fontSize: "25px",
                      color: "white",
                      wordBreak: "break-word",
                      width: "80%",
                      lineHeight: "1.2", // 줄 간격 조절
                      margin: "0", // 기본 마진 제거
                      padding: "0", // 기본 패딩 제거
                    }}
                  >
                    {posts[5].title.length > 13
                      ? `${posts[5].title.substring(0, 13)}...`
                      : posts[5].title}
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      fontFamily: "KCC-eunyoung, sans-serif",
                      wordBreak: "break-word",
                      color: "white",
                    }}
                  >
                    by {posts[5].writer.nickname}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {posts[6] && (
          <div>
            <div
              style={{
                width: 300,
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${posts[6].preview.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.3s ease, filter 0.3s ease",
                filter: "brightness(1)",
              }}
              className="h-[400px] cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(70%)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
              onClick={() => navigate(`/post/${posts[6]._id}`)}
            >
              <div className="flex flex-col items-center justify-center gap-12 h-full text-white text-center">
                <p
                  style={{
                    fontSize: `${posts[6].title.length < 10 ? `40px` : `27px`}`,
                    color: "white",
                    wordBreak: "break-word",
                    width: "80%",
                  }}
                >
                  {posts[6].title}
                </p>
                <p
                  style={{
                    fontSize: "24px",
                    fontFamily: "KCC-eunyoung, sans-serif",
                    wordBreak: "break-word",
                    color: "white",
                  }}
                >
                  by {posts[6].writer.nickname}
                </p>
              </div>
            </div>
          </div>
        )}
        {posts[7] && (
          <div>
            <div
              style={{
                width: 400,
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${posts[7].preview.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.3s ease, filter 0.3s ease",
                filter: "brightness(1)",
              }}
              className="h-[400px] cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(70%)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
              onClick={() => navigate(`/post/${posts[7]._id}`)}
            >
              <div className="flex flex-col items-center justify-center gap-12 h-full text-white text-center">
                <p
                  style={{
                    fontSize: `${posts[7].title.length < 10 ? `40px` : `27px`}`,
                    color: "white",
                    wordBreak: "break-word",
                    width: "80%",
                  }}
                >
                  {posts[7].title}
                </p>
                <p
                  style={{
                    fontSize: "24px",
                    fontFamily: "KCC-eunyoung, sans-serif",
                    wordBreak: "break-word",
                    color: "white",
                  }}
                >
                  by {posts[7].writer.nickname}
                </p>
              </div>
            </div>
          </div>
        )}
        {posts[8] && posts[9] && (
          <div>
            <div
              style={{
                width: 400,
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${posts[8].preview.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.3s ease, filter 0.3s ease",
                filter: "brightness(1)",
              }}
              className="h-[200px] cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(70%)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
              onClick={() => navigate(`/post/${posts[8]._id}`)}
            >
              <div className="flex flex-col items-center justify-center gap-12 h-full text-white text-center">
                <p
                  style={{
                    fontSize: "28px",
                    color: "white",
                    wordBreak: "break-word",
                    width: "80%",
                    lineHeight: "1.2", // 줄 간격 조절
                    margin: "0", // 기본 마진 제거
                    padding: "0", // 기본 패딩 제거
                  }}
                >
                  {posts[8].title.length > 13
                    ? `${posts[8].title.substring(0, 13)}...`
                    : posts[8].title}
                </p>
                <p
                  style={{
                    fontSize: "17px",
                    fontFamily: "KCC-eunyoung, sans-serif",
                    wordBreak: "break-word",
                    color: "white",
                  }}
                >
                  by {posts[8].writer.nickname}
                </p>
              </div>
            </div>
            <div
              style={{
                width: 400,
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${posts[9].preview.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.3s ease, filter 0.3s ease",
                filter: "brightness(1)",
              }}
              className="h-[200px] cursor-pointer"
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(70%)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
                e.currentTarget.style.transform = "scale(1)";
              }}
              onClick={() => navigate(`/post/${posts[9]._id}`)}
            >
              <div className="flex flex-col items-center justify-center gap-12 h-full text-white text-center">
                <p
                  style={{
                    fontSize: "28px",
                    color: "white",
                    wordBreak: "break-word",
                    width: "80%",
                    lineHeight: "1.2", // 줄 간격 조절
                    margin: "0", // 기본 마진 제거
                    padding: "0", // 기본 패딩 제거
                  }}
                >
                  {posts[9].title.length > 13
                    ? `${posts[9].title.substring(0, 13)}...`
                    : posts[9].title}
                </p>
                <p
                  style={{
                    fontSize: "17px",
                    fontFamily: "KCC-eunyoung, sans-serif",
                    wordBreak: "break-word",
                    color: "white",
                  }}
                >
                  by {posts[9].writer.nickname}
                </p>
              </div>
            </div>
          </div>
        )}
      </StyledSlider>
    </div>
  );
};

export default SliderTest;
