import PostContent from "./component/PostContent"
import CommentList from "./component/CommentList";
import InputComment from "./component/InputComment";
// type Props = {}

export default function PostDetail() {
  return (
    <div className="mt-[7rem] mx-[2rem] md:mx-[10rem]">
      <PostContent />
      <InputComment />
      <CommentList />
    </div>
  )
}