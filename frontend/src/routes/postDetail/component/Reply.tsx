
// type Props = {};

export default function Reply() {
  return (
    <div className="flex gap-[1rem] my-[36px] pl-[32px] w-full">
      <div
        style={{
          backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD68cSMsrBiEs6YloK8MVPO1DlJ7LqKt4OxT7ioMJn7xh-1iqPV0FVFjvTA7Cvlv-Y9Yc&usqp=CAU)`,
        }}
        className="w-[32px] h-[32px] rounded-full bg-cover bg-center cursor-pointer"
      ></div>
      <div style={{width: 'calc(100% - 32px)'}}>
        <div className="mb-[1rem]">
          <p className="text-sm">대댓글 단 user</p>
          <p className="text-xs text-gray-500">Jun 13. 2024.</p>
        </div>

        <p className="mb-[1rem]">ㅇㅈㅇㅈ~~</p>
      </div>
    </div>
  );
}
