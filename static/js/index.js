let attempts = 0;
let index = 0;
let timer;

function appStart() {
  const displayGameover = () => {
    // alert("게임이 종료됐습니다.");
    const div = document.createElement("div");
    div.innerText = "게임이 종료됐습니다.";
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:40vh; left:43vw; background-color:white; width:200px; height:100px; font-weight:bold; border:2px solid rgba(0,0,0,0.1);";
    document.body.appendChild(div);
  };

  const nextLine = () => {
    attempts += 1;
    index = 0;
    if (attempts === 6) return gameover();
  };

  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
  };

  const handleEnterKey = async () => {
    let 맞은_개수 = 0;

    // 서버에서 정답을 받아오는 코드
    const 응답 = await fetch("/answer");
    const 정답 = await 응답.json();

    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-column[data-index='${attempts}${i}']`
      );
      const 입력한_글자 = block.innerText;
      const 정답_글자 = 정답[i];
      if (입력한_글자 === 정답_글자) {
        맞은_개수 += 1;
        block.style.background = "#6AAA64";
      } else if (정답.includes(입력한_글자)) block.style.background = "#C9B458";
      else block.style.background = "#787C7E";

      block.style.color = "white";
    }

    if (맞은_개수 === 5) gameover();
    else nextLine();
  };

  /* 애니메이션 구현 */
  // const handleEnterKey = () => {
  //   let 맞은_개수 = 0;
  //   for (let i = 0; i < 5; i++) {
  //     const block = document.querySelector(
  //       `.board-column[data-index='${attempts}${i}']`
  //     );
  //     const 입력한_글자 = block.innerText;
  //     const 정답_글자 = 정답[i];
  //     if (입력한_글자 === 정답_글자) {
  //       맞은_개수 += 1;
  //       block.style.background = "#6AAA64";
  //     } else if (정답.includes(입력한_글자)) block.style.background = "#C9B458";
  //     else block.style.background = "#787C7E";

  //     block.style.color = "white";
  //   }

  //   if (맞은_개수 === 5) {
  //     block.querySelectorAll(".board-column").forEach((letter) => {
  //       letter.classList.add("correct");
  //       setTimeout(() => {
  //         letter.classList.remove("correct");
  //       }, 1000); // 1초 후 애니메이션 클래스 제거
  //     });
  //     gameover();
  //   } else nextLine();
  // };
  /* 애니메이션 구현 */

  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-column[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  const handleKeydown = (event) => {
    const key = event.key.toUpperCase();
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-column[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") handleBackspace();
    else if (index === 5) {
      if (event.key === "Enter") handleEnterKey();
      else return;
    } else if (65 <= keyCode && keyCode <= 90) {
      thisBlock.innerText = key;
      index += 1;
    }
  };

  const startTimer = () => {
    const startTime = new Date();

    function setTime() {
      const presentTime = new Date();
      const leftTime = new Date(presentTime - startTime);
      const minute = leftTime.getMinutes().toString().padStart(2, "0");
      const second = leftTime.getSeconds().toString().padStart(2, "0");
      const timeDiv = document.querySelector("#timer");
      timeDiv.innerText = `${minute}:${second}`;
    }

    timer = setInterval(setTime, 1000);
  };

  // /* 키보드 이미지 클릭 구현 시작*/
  // // DOM 요소 가져오기
  // const keys = document.querySelectorAll(".keyboard-block");
  // const output = document.querySelector(
  //   `.board-column[data-index='${attempts}${index}']`
  // );

  // // 키보드 이미지 클릭 이벤트 리스너 등록
  // keys.forEach((key) => {
  //   key.addEventListener("click", handleKeyClick);
  // });

  // // 키보드 이미지 클릭 처리 함수
  // function handleKeyClick(event) {
  //   const clickedLetter = event.currentTarget.getAttribute("data-key");

  //   if (clickedLetter === "Backspace") handleBackspace();
  //   else if (index === 5) {
  //     if (clickedLetter === "Enter") handleEnterKey();
  //     else return;
  //   } else {
  //     output.innerText = clickedLetter;
  //     index += 1;
  //   }
  // }
  // /* 키보드 이미지 클릭 구현 끝*/

  startTimer();
  window.addEventListener("keydown", handleKeydown);
}

appStart();
