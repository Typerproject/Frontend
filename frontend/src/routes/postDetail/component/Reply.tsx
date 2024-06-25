// type Props = {};

export default function Reply({ reply }) {
  const parsingDate = (): string => {
    const date = new Date(reply.createdAt);

    const formattedTime = date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return formattedTime;
  };

  return (
    <div className="flex gap-[1rem] my-[36px] pl-[32px] w-full">
      <div
        style={{
          backgroundImage: `url(${reply.writerId.profile})`,
        }}
        className="w-[32px] h-[32px] rounded-full bg-cover bg-center cursor-pointer"
      ></div>
      <div style={{ width: "calc(100% - 32px)" }}>
        <div className="mb-[1rem]">
          <p className="text-sm">{reply.writerId.nickname}</p>
          <p className="text-xs text-gray-500">{parsingDate()}</p>
        </div>

        <p className="mb-[1rem]">{reply.text}</p>
      </div>
    </div>
  );
}
