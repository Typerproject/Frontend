import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
import { useEffect, useState } from "react";
import postAPI, { IPostSlider } from "../../../api/postDetailAPI";

const postService = new postAPI(import.meta.env.VITE_SERVER_POST_API_URI);

const PostSlider: React.FC = () => {
  const [posts, setPosts] = useState<IPostSlider[]>([]);

  useEffect(() => {
    postService
      .getPostListForSlide()
      .then((data) => {
        console.log("슬라이드 데이터 체크", data);
        setPosts(data);
      })
      .catch((err) => {
        console.error("슬라이드 데이터 체크 에러", err);
      });
  }, []);

  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: true,
  };

  return (
    <div className="h-[550px]">
      <Slider {...settings}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div>
              <div
                style={{
                  position: "relative",
                  textAlign: "center",
                  color: "white",
                }}
              >
                {/* <img
                  //   src="http://k.kakaocdn.net/dn/bT6Scv/btsHv4GfUAT/iepkzWZ9XUc54zPETMzg70/img_640x640.jpg"
                  src={post.preview.img}
                  alt="post"
                  style={{
                    width: "100%",
                    height: "550px",
                    objectFit: "cover",
                    filter: "blur(3px)",
                  }}
                /> */}
                <div
                  style={{
                    backgroundImage: `url(${post.preview.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "550px",
                    filter: "blur(5px)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // 배경색 검정, 투명도 50%
                    padding: "10px",
                    borderRadius: "5px",
                    height: "90%",
                    width: "500px",
                  }}
                >
                  {post.title}
                </div>
                {/* <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    width: "250px",
                    height: "280px",
                  }}
                >
                  {post.title}
                </div> */}
              </div>
            </div>
          ))
        ) : (
          <div>no content</div>
        )}
      </Slider>
    </div>
  );
};

export default PostSlider;
