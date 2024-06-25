export default function Footbar() {
  const gotoGit = () => {
    window.open("https://github.com/Typerproject", "_blank");
  };
  return (
    <div className="h-56 w-full bg-black">
      <div className="grid grid-rows-5 h-full">
        <div className="row-span-4 ">
          {/*footer contents*/}
          <div className="flex justify-center mt-[1rem] text-white">
            <div className="grid grid-cols-5 w-3/4 phone:flex phone:flex-col phone:gap-[0.3rem] phone:mt-[0.7rem]">
              {/*logo & intro */}
              <div className="col-span-4 flex flex-col">
                <div>
                  <p className="text-[16px]">
                    <span className="text-[28px]">T</span>yper
                  </p>
                </div>
                <div className="text-sm mt-[0.2rem]">
                  주식 투자자들을 위한 주식 일지 에디터
                </div>
              </div>
              {/*소개 및 github*/}
              <div className="row-span-2 col-span-1 mt-[0.2rem] flex flex-col phone:flex-row phone:gap-[1rem] phone:items-end gap-[0.5rem]">
                <div className="row-span-2 col-span-2 mt-[0.5rem] flex flex-col text-white">
                  <div>공식 깃허브</div>
                  <div
                    className="text-sm mt-[0.5rem] cursor-pointer"
                    onClick={gotoGit}
                  >
                    Typer's github
                  </div>
                </div>

                <div className="mt-[0.5rem]">
                  <div className="mt-[0.5rem] text-sm">팀원</div>
                  <div className="mt-[0.2rem] text-xs">
                    Julie Judy Jody Yapyap Brian
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row-span-1 px-24 phone:px-8">
          <hr
            style={{ color: "white" }}
            className="border-x-2 phone:border-x-0"
          ></hr>
          <div className="flex flex-row-reverse mt-[0.5rem] text-xs text-white end">
            프로 디지털 아카데미 4기
          </div>
        </div>
      </div>
    </div>
  );
}
