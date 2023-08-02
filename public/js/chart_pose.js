const URL = "https://teachablemachine.withgoogle.com/models/z0vR-GgVw/";

        let right = 1, lean_forward = 1, too_upright = 1, tilt = 1, camel = 1;
        var prediction_copy = [right, lean_forward, too_upright, tilt, camel];

        function createPieChart(prediction_copy) {
            var ctx = document.getElementById('PieChart').getContext('2d');

            if (window.myPieChart) {
                // If a chart already exists, destroy it to create a new one with updated data
                window.myPieChart.destroy();
            }
            window.myPieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['姿勢正確', '頭部前傾', '腰桿過挺', '頭部傾斜', '駝背'], // Replace with your own labels
                    datasets: [
                        {
                            data: prediction_copy, // Replace with your own data
                            backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(123,50,112)', 'rgb(46,50,12)'], // Replace with your own colors
                        },
                    ],
                },
                options: {
                    // Add any additional options you want for the pie chart
                    responsive: true, // The chart will resize automatically to fit its container
                    maintainAspectRatio: false, // Allow the chart to have different aspect ratio
                    width: 8000,
                    height: 8000,
                    animation: {
                        duration: 0, // Set the animation duration to 0 to disable animation
                    },
                    plugins: {
                        datalabels: {
                            formatter: (value, ctx) => {
                                let sum = 0;
                                let dataArr = ctx.chart.data.datasets[0].data;
                                dataArr.map((data) => {
                                    sum += data;
                                });
                                let percentage = ((value * 100) / sum).toFixed(2) + '%';
                                return percentage;
                            },
                            color: '#fff', // Set the color of the datalabels
                        },
                    },
                },
            });
        }

        function updateChart() {
            // Generate random values for the pie chart slices (you can replace this with your own data source)
            prediction_copy = [right, lean_forward, too_upright, tilt, camel];
            createPieChart(prediction_copy);
        }

        document.getElementById('button_chart').addEventListener('click', function () {
            clearInterval(intervalID);// Clear the interval
            right = 1, lean_forward = 1, too_upright = 1, tilt = 1, camel = 1;// Reset the chart with initial data
            prediction_copy = [right, lean_forward, too_upright, tilt, camel];
            createPieChart(prediction_copy);
            intervalID = setInterval(updateChart, 10);// Set a new interval to update the chart every second (1000 milliseconds)
        });
        // Initial chart creation with random data
        createPieChart(prediction_copy);

        // Set the initial interval to update the chart every second (1000 milliseconds)
        var intervalID = setInterval(updateChart, 10);

        /*
        物件辨識
        const URL2 = ""
        */
        let model, webcam, ctx, labelContainer, maxPredictions;

        // Audio 設定
        var aud = document.getElementById("wakeUpAudio");
        function playAud() {
            aud.play();
        }
        function pauseAud() {
            aud.pause();
        }
        /*
        Audio2 設定
        var aud2 = document.getElementById("died");
        function play2() {
            aud2.play();
        }
        function end() {
            aud2.pause();
        }
        */
        async function init() {
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";
            /*
            物件辨識
            const modelURL2 = URL2 + " ";
            const metadataURL2 = URL2 + " "
            */
            model = await tmPose.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();
            /*
            物件辨識
            model2 = await tmPose.load(modelURL2, metadataURL2);
            maxPredictions2 = model2.getTotalClasses();
            */

            const size = 200;
            const flip = true;
            webcam = new tmPose.Webcam(size, size, flip);
            await webcam.setup();
            await webcam.play();
            window.requestAnimationFrame(loop);
            var chartContainer = document.querySelector('.chart');
            chartContainer.style.display = 'block';

            const canvas = document.getElementById("canvas");
            canvas.width = size; canvas.height = size;
            ctx = canvas.getContext("2d");
            labelContainer = document.getElementById("label-container");
            for (let i = 0; i < maxPredictions; i++) {
                labelContainer.appendChild(document.createElement("div"));
            }
        }

        async function loop(timestamp) {
            webcam.update();
            await predict();
            window.requestAnimationFrame(loop);
        }

        async function predict() {
            const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
            const prediction = await model.predict(posenetOutput);
            /*
            物件辨識
            const objectDetectionPrediction = await model2.predict(webcam.canvas);
            */
            /*
            if (prediction2[0].className !== "prediction[0]" || prediction2[0].className !== "prediction[1]") {
                play2();
            } else {
                end();
            }
            */
            for (let i = 0; i < maxPredictions; i++) {
                const classPrediction =
                    prediction[i].className + ": " + prediction[i].probability.toFixed(2);
                labelContainer.childNodes[i].innerHTML = classPrediction;

                if (prediction[0].probability.toFixed(2) >= 0.5) {
                    pauseAud();
                    right++;
                    document.getElementById("result").innerHTML = "姿勢正確";
                    document.getElementById("suggestion").innerHTML =
                        "<b>1. 臀部與膝蓋的位置擺放</b><br>髖關節與膝關節的角度是保持正確坐姿的重點，膝蓋彎曲的角度最好保持90度。<br>" +
                        "<b>2. 身體坐正上半身挺直</b><br>讓上半身與坐骨保持一直線，您可以調整臀部擺放的位置，同時上半身挺直，來達成骨盆的正確受力位置。<br>" +
                        "<b>3. 下背部與脊椎</b><br>人體的脊椎不是一直線，而是有弧度的，在正確坐姿下，下背部應該會呈現自然往前彎曲的弧度，您可以將一隻手伸向下背部，應該會有可讓手穿過去的空隙。<br>" +
                        "<b>4. 深呼吸幫助挺直身體</b><br>橫膈膜是呼吸時的重要構造，當您吸氣時，橫膈膜會進行垂直運動來配合胸腔的擴大，也能幫助您直起身子，避免駝背。";
                }
                if (prediction[1].probability.toFixed(2) >= 0.5) {
                    playAud();
                    lean_forward++;
                    document.getElementById("result").innerHTML = "頭部前傾";
                    document.getElementById("suggestion").innerHTML =
                        "<b>介紹:</b><br>最被廣為介紹的錯誤姿勢了。俗稱「烏龜頸」，是指下頸椎往前彎曲、上頸椎往上伸直，像是烏龜伸出頭來的姿勢。<br>" +
                        "<b>缺點:</b><br>如果將頭往前伸並保持前傾的姿勢，整顆頭的重量會落在頸椎更前面的位置，使肩頸附近的肌肉負擔增加，容易產生胸鎖乳突肌、枕骨下肌等痛點和疼痛的傳遞。下巴下方的肌肉會產生一股把下巴往後、往下拉的力量，可能會造成或惡化咬合不正等關節問題。<br>" +
                        "<b>建議:</b><br>使用螢幕時稍微後傾，讓視線呈現向下約20度左右，降低眼睛的壓力；站立時需要把背打直、下巴稍微下壓，讓耳朵、肩膀與骨盆呈現一直線。要快速矯正<br>";
                } else if (prediction[2].probability.toFixed(2) >= 0.5) {
                    playAud();
                    too_upright++;
                    document.getElementById("result").innerHTML = "腰桿過挺";
                    document.getElementById("suggestion").innerHTML =
                        "<b>介紹:</b><br>正常胸椎該有的微彎曲角度消失，腰桿過度前凸，髂腰肌緊繃。是坐姿過度矯正常見的錯誤觀念。<br>" +
                        "<b>缺點:</b><br>變成過度挺腰可能導致，腹肌、臀部的肌肉不容易被使用到，反而會過度使用大腿的肌肉，這便是導致下半身肥胖以及臀部下垂的原因。對於在意身體曲線的女性來說是很大的困擾。另外，若放任過度挺腰不處理的話，上半身的體重將由腰部、髖關節承受，導致腰痛以及椎間盤突出的可能性提高。<br>" +
                        "<b>建議:</b><br>坐著時使用靠墊，時常意識背部要靠在靠墊上，幫助骨盆回到理想的角度，除此之外也可以改善睡姿，改成不容易造成背部負擔的側躺姿勢，並適時地的翻身。<br>";
                } else if (prediction[3].probability.toFixed(2) >= 0.5) {
                    playAud();
                    tilt++;
                    document.getElementById("result").innerHTML = "頭部傾斜";
                    document.getElementById("suggestion").innerHTML =
                        "<b>介紹:</b><br>頭部傾斜與身體形成不正常角度，通常是坐姿習慣或是斜視問題產生。<br>" +
                        "<b>缺點:</b><br>若長期維持頭部傾斜的情況使用電腦，則可能造成頸部肌肉永久緊繃，可能導致長期頸部疼痛或頭痛，或是頭只能轉向一邊，稱為後天斜頸，兒童的話則可能導致面部骨骼發育異常，稱為面部不對稱。<br>" +
                        "<b>建議:</b><br>利用熱敷按摩、注射低濃度葡萄糖水或針灸來放鬆肌肉，也可以藉由復健來使身經根病變消腫。若長時間使用電腦，可考慮使用外接鍵盤和滑鼠，避免手腕長時間在桌面上放置造成不適。確保每天有足夠的睡眠時間，並進行一些運動來維持身體的健康。<br>";
                } else if (prediction[4].probability.toFixed(2) >= 0.5) {
                    playAud();
                    camel++;
                    document.getElementById("result").innerHTML = "姿勢駝背";
                    document.getElementById("suggestion").innerHTML =
                        "<b>介紹:</b><br>駝背的錯誤坐姿，會使脊椎、特別是胸椎的彎曲角度上升，讓胸部的肌肉處在不平衡的狀況，胸椎的活動度也會因為長時間的靜止不動而下降。<br>" +
                        "<b>缺點:</b><br>前側的胸大肌、胸小肌產生激痛點，造成如胸部、手臂的轉移痛；胸小肌緊繃會壓迫從腋下附近穿過的神經而導致手麻。而位於身體後方、背部的肌肉，會因為整個胸椎過度彎曲的姿勢被拉得更長，因此處在不好施力的位置。以駝背的坐姿使身體的重量壓在臀大肌上，產生在屁股上方的疼痛。<br>" +
                        "<b>建議:</b><br>坐姿注意骨盆位置必須擺正，引領上半身軀幹坐正，也可以訓練核心肌群，如腹式呼吸、登山者式，等加強維持力。<br>";
                } else {
                    pauseAud();
                }
                drawPose(pose);
            }
            document.querySelector('.pose-description').style.display = 'none';
            document.querySelector('button').style.display = 'none';
            document.getElementById("button_chart").style.display = 'block';
        }
        function drawPose(pose) {
            if (webcam.canvas) {
                ctx.drawImage(webcam.canvas, 0, 0);
                if (pose) {
                    const minPartConfidence = 0.5;
                    tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
                    tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
                }
            }
        }