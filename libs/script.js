const isLog=true;

function log(text)
{
  if (isLog)
    console.log(text);
}


String.prototype.toMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var minutes = Math.floor(sec_num / 60);
  var seconds = sec_num - minutes * 60;

  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return minutes + ':' + seconds;
}


Vue.component('timer', {
  props: ['time'],
  data() {
    return {
      timer: null,
      remainingTime: this.time,
      isPaused: false
    };
  },
  computed: {
    remainingTimeMMSS() {
      return (this.remainingTime + "").toMMSS()
    }
  },
  watch: {
    time(newTime) {
      this.resetTimer(newTime);
    }
  },
  methods: {
    startTimer() {
      if (this.timer) return;
      this.timer = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
        } else {
          clearInterval(this.timer);
          this.timer = null;
          this.$emit('timeout');
        }
      }, 1000);
    },
    pauseTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
        this.isPaused = true;
      }
    },
    resumeTimer() {
      if (this.isPaused) {
        this.startTimer();
        this.isPaused = false;
      }
    },
    resetTimer(newTime) {
      clearInterval(this.timer);
      this.timer = null;
      this.remainingTime = newTime;
      this.isPaused = false;
      // this.startTimer();
    }

  },
  mounted() {
    //this.startTimer();
  },
  template: `
      <div>
        <span>{{ remainingTimeMMSS }}</span>
        <!--
        <button class="btn btn-primary btn-lg" @click="startTimer">Start</button>
        <button class="btn btn-primary btn-lg" @click="pauseTimer">Pause</button>
        <button class="btn btn-primary btn-lg" @click="resumeTimer">Resume</button>
        <button class="btn btn-primary btn-lg" @click="resetTimer(time)">Restart</button>
        -->
      </div>
    `
});

let data = null;

new Vue({
  el: '#app',
  data: {
    isSpeak:true,
    score: 0,
    gameOn: false,
    isNext: true,
    timerTime: 180,
    addTimerTime: 30,
    country: "Начните игру",
    capital: "",
    square:"",
    countries: [],
    isCapitalShow: false,    
    continents: ['Африка', 'Азия', 'Австралия и Океания', 'Европа', 'Северная Америка', 'Южная Америка'],
    selectedContinents: ['Европа']
  },
  methods: {
    handleTimeout(timerName) {
      switch (timerName) {
        case 'mainTimer':
          //document.getElementById('startGame').disabled = true
          //document.getElementById('nextQuestion').disabled = true
          this.stopGame();

          break;
        case 'addTimer':
          this.nextQuestion();
          break;
      }
    },
    startGame() {
      //data={countries};
      this.countries = allCountries.filter(country => this.selectedContinents.includes(country.Континент));
      this.gameOn=true;
      this.score=0;
      document.getElementById("startGame").disabled=true;
      //data = JSON.parse(JSON.stringify(countries));
      //document.getElementById("nextQuestion").disabled = false;
      //document.getElementById("addScore").disabled = false;
      //document.getElementById("removeScore").disabled = false;
      this.isCapitalShow = true;
      this.nextQuestion();
      //console.log(countries);
      this.$refs.mainTimer.startTimer();


    },
    stopGame(showGameOver=true) {
      this.$refs.addTimer.pauseTimer();
      this.$refs.mainTimer.pauseTimer();
      this.isCapitalShow = false;
      this.gameOn=false;
      if (showGameOver) 
       alert('Game over!');
      
      //document.getElementById("nextQuestion").disabled = true;
      //document.getElementById("addScore").disabled = true;
      //document.getElementById("removeScore").disabled = true;

    },
    pauseGame() {

    },
    restartGame() {
      if (confirm("Перезапустить?"))
        window.location.reload();
    },
    nextQuestion() {
      if (this.countries.length > 0) {
        randomCountry = getRandomElementAndRemove(this.countries);
        this.country = randomCountry["Страна"];
        this.capital = "Показать";//randomCountry["Столица"];  
        this.square="";
        if (this.isSpeak)
          speak(this.country);
        this.$refs.addTimer.resetTimer(parseInt(document.getElementById("addTimer").value));
        this.$refs.addTimer.startTimer();
      }
      else
      {
        this.stopGame(false);
       alert("Вопросы закончились. Перезапустите игру");
      }

    },
    showCapital() {
      this.capital = randomCountry["Столица"];
      this.square=randomCountry["Площадь"]
      if (this.isSpeak)
        speak(this.capital);
    },
    addScore(score) {
      this.score += score;
      if (this.isNext) this.nextQuestion();
    }
  }
});

function getRandomElementAndRemove(array) {
  if (array.length === 0) {
    return null; // Если массив пуст, возвращаем null
  }

  // Выбираем случайный индекс из массива
  const randomIndex = Math.floor(Math.random() * array.length);

  // Запоминаем случайный элемент
  const randomElement = array[randomIndex];

  // Удаляем элемент из массива
  array.splice(randomIndex, 1);

  return randomElement;
}


let isHintVisible = false;

function toggleHint() {
  const hintContent = document.querySelector('.hint-content');
  const hintToggle = document.querySelector('.hint-toggle');

  if (isHintVisible) {
    hintContent.style.display = 'none';
    hintToggle.textContent = 'Настройки';
    isHintVisible = false;
  } else {
    hintContent.style.display = 'block';
    hintToggle.textContent = 'Спрятать';
    isHintVisible = true;
  }
}
