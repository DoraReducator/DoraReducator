window.onload = function () {
  var countdownBtn = document.getElementById('countdown-btn');
  var timerDisplay = document.getElementById('timer-display');
  var selectTime = document.getElementById('select-time');

  var countdownInterval; // 儲存倒數計時器的間隔 ID
  var countdownTime = 30 * 60; // 預設倒數時間（秒）

  // 設定選擇時間長短的下拉式選單
  selectTime.addEventListener('change', function () {
    countdownTime = parseInt(selectTime.value) * 60;
  });

  // 開始倒數計時
  countdownBtn.addEventListener('click', function () {
    clearInterval(countdownInterval); // 先清除之前的計時器

    // 更新倒數計時器的顯示畫面
    timerDisplay.innerHTML = formatTime(countdownTime);
    countdownTime = parseInt(selectTime.value) * 60;
    aud_countdown.pause();

    // 開始倒數計時
    countdownInterval = setInterval(function () {
      countdownTime--;

      // 更新倒數計時器的顯示畫面
      timerDisplay.innerHTML = formatTime(countdownTime);

      // 檢查是否倒數結束
      if (countdownTime <= 0) {
        clearInterval(countdownInterval);
        timerDisplay.innerHTML = "倒數結束！";
        playAud_countdown();
      }
    }, 1000); // 每秒更新一次
  });

  var aud_countdown = document.getElementById("CountDownAudio");
  function playAud_countdown() {
    aud_countdown.play();
  }
  function pauseAud_countdown() {
    aud_countdown.pause();
  }

  // 格式化時間（秒數轉換為HH:MM:SS格式）
  function formatTime(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds % 3600) / 60);
    var secs = seconds % 60;

    return (
      ("0" + hours).slice(-2) +
      ":" +
      ("0" + minutes).slice(-2) +
      ":" +
      ("0" + secs).slice(-2)
    );
  }
};