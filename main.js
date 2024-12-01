const textElem = document.querySelector(".text");
const speed = document.querySelector(".speed");

/**
 * ==========================================
 * Debug Block
 * ==============================================*/

/*
 * ==========================================
 */

async function getRandomText(url) {
  try {
    const response = await fetch("https://type.fit/api/quotes", {});
    var data = await response.json();
    // return data[0]['q'];
    return data;
  } catch {
    return [
      {
        text: "Hello world",
      },
    ];
  }
}

const MODES = {
  CONTINUOUS: 0,
  ONE_ROUND: 1,
};

class Typing {
  constructor(_textList) {
    this.activeMode = MODES.CONTINUOUS;
    this.textListIdx = 0;
    this.activeCharIndex = 0;
    this.textList = _textList;
    this.startTime;
    this.text = "";
    this.keyData = {}; // {status : value of blockType, modified : boolean}
    this.blockType = [
      "not-typed-yet",
      "correct",
      "wrong",
      "modified",
      "active",
    ];

    this.timerIntervalId;
    this.reset();
  }

  reset() {
    this.startTime = null;
    this.activeCharIndex = 0;
    this.keyData = {};
    this.text = this.textList[this.textListIdx].text;
    this.formatedText = this.text;

    textElem.innerHTML = this.formatedText;

    for (let pos = 0; pos < this.text.length; pos++) {
      this.keyData[pos] = {
        status: 0,
        modified: false,
      };
    }
    this.keyData[this.activeCharIndex].status = 4;
    this.generateFormatedText();
    this.updateUI();
  }

  updateWPM() {
    const span = new Date().getTime() - this.startTime;
    if (span <= 1000) return;
    if (span == 0) return;

    let correctCharCount = 0;
    let inCorrectCharCount = 0;
    for (let charIdx in this.keyData) {
      correctCharCount += this.keyData[charIdx].status === 1;
      inCorrectCharCount += this.keyData[charIdx].status === 2;
    }
    const timeInMinute = span / 60000;
    const totalCharTyped = correctCharCount + inCorrectCharCount;
    const totalWordTyped = totalCharTyped / 5;
    let grossWPM = totalWordTyped / timeInMinute;
    let netWPM = Math.max(0, grossWPM - inCorrectCharCount / 5 / timeInMinute);
    speed.innerText = Math.round(netWPM);
  }

  generateFormatedText() {
    let formatedText = "";
    let block = "";
    for (let pos = 0; pos < this.text.length; pos++) {
      /**
       * checking if the current char and next char are in the same state or not
       * we are collecting all the contigious char that have same state and wrap them inside a span tag with their state class
       */
      if (
        this.keyData[pos + 1] != undefined &&
        this.keyData[pos].status == this.keyData[pos + 1].status &&
        this.keyData[pos].modified == this.keyData[pos + 1].modified
      ) {
        block += this.text[pos];
      } else {
        block += this.text[pos];

        formatedText += `<span class = "${
          this.blockType[this.keyData[pos].status]
        } ${this.keyData[pos].modified ? "modified" : ""}">${block}</span>`;
        block = "";
      }
    }

    this.formatedText = formatedText;
  }

  backSpaceHandler(e) {
    if (e.keyCode != 8 && e.key != "Backspace") return;

    if (this.activeCharIndex == 0) return;
    this.keyData[this.activeCharIndex].status = 0;
    this.activeCharIndex--;

    this.keyData[this.activeCharIndex] = {
      status: 4,
      modified: true,
    };
    this.generateFormatedText();
    this.updateUI();
  }

  handleEndOfTyping() {
    this.textListIdx = (this.textListIdx + 1) % this.textList.length;
    clearInterval(this.timerIntervalId);

    if (this.activeMode === MODES.CONTINUOUS) this.reset();
  }
  generalKeyHandler(key) {
    if (this.activeCharIndex >= this.text.length) {
      return;
    }

    // if user presses the right key
    if (this.text[this.activeCharIndex] == key) {
      this.keyData[this.activeCharIndex].status = 1;
    }

    // if user pressed the wrong key
    else {
      this.keyData[this.activeCharIndex].status = 2;
    }
    this.activeCharIndex++;

    if (this.activeCharIndex == this.text.length) {
      this.handleEndOfTyping();
    } else {
      this.keyData[this.activeCharIndex].status = 4;
    }
  }

  updateUI() {
    textElem.innerHTML = this.formatedText;
  }

  keyPressHandler(e) {
    if (e.key == "Backspace") {
      this.backSpaceHandler(e);
      return;
    }

    if (!this.startTime) {
      this.startTime = new Date().getTime();
      this.timerIntervalId = setInterval(this.updateWPM.bind(this), 1000);
    }
    // console.log(_key);
    this.generalKeyHandler(e.key);
    this.generateFormatedText();
    this.updateUI();
  }
}

const data = [
  {
    text: "Success is not achieved overnight. It requires persistence, hard work, and resilience. Keep moving forward, even when the path seems unclear. Every step you take is a step closer to your goals, and every setback is a lesson in growth.",
  },
  {
    text: "Believe in yourself even when others don't. Your potential is limitless, and the obstacles you face today are simply stepping stones to a brighter tomorrow. Trust the process, stay focused, and remember that your dreams are worth every effort.",
  },
  {
    text: "The greatest accomplishments come not from avoiding challenges, but from facing them head-on. Embrace the difficulties, for they build your character, test your strength, and ultimately lead you to the success you seek.",
  },
  {
    text: "When life gets tough, remember that you are tougher. You have faced challenges before, and you can overcome whatever comes your way. Keep your head high, stay determined, and let each obstacle inspire you to work harder and smarter.",
  },
  {
    text: "Success is not measured by what you achieve, but by the courage to keep going when everything seems impossible. Every challenge you overcome, every doubt you silence, brings you one step closer to becoming the person you were meant to be.",
  },
  {
    text: "The road to success is not a straight path. It's filled with twists, turns, and bumps along the way. But each setback is an opportunity to learn, grow, and come back stronger. Stay patient and persistent, and success will eventually follow.",
  },
  {
    text: "In the face of adversity, the difference between those who succeed and those who fail is often the decision to keep going. Don't let fear or doubt control your journey. Push through, keep moving forward, and trust that success will find you.",
  },
  {
    text: "Your potential is far greater than any temporary setback. Keep pushing forward, even when things don't seem to be going your way. The challenges you face today will prepare you for the success you will achieve tomorrow.",
  },
  {
    text: "The key to success lies in the ability to stay focused when things get tough. Never lose sight of your dreams, and don't let obstacles distract you from your path. Your hard work and persistence will eventually lead you to the victory you deserve.",
  },
  {
    text: "The difference between those who succeed and those who don't is simple: perseverance. Keep your eyes on the prize, no matter how many challenges you face. Your dedication and effort will ultimately pay off in ways you can't yet imagine.",
  },
  {
    text: "Your journey to success will not always be easy, but it will always be worth it. Keep fighting for your dreams, even when the road is tough. The best things in life rarely come easily, but they are always worth the effort.",
  },
  {
    text: "Every great achievement was once considered impossible. Don't let the challenges ahead discourage you. Keep moving forward with passion, determination, and the belief that your dreams are worth fighting for.",
  },
  {
    text: "In the pursuit of greatness, there will always be obstacles. But it is your resilience, your ability to adapt and overcome, that will ultimately determine your success. Embrace the challenges and keep striving forward – the finish line is closer than you think.",
  },
  {
    text: "You are capable of achieving more than you think. The limits you face are only temporary, and every challenge is an opportunity to unlock a new level of growth. Keep pushing yourself, stay focused, and the results will speak for themselves.",
  },
  {
    text: "Don't be afraid to fail. Failure is not the opposite of success; it's a part of it. Every setback teaches you something valuable and brings you closer to your ultimate goal. Embrace failure as a stepping stone to your success.",
  },
  {
    text: "The biggest mistake you can make is not starting. Don't wait for the perfect moment or the right conditions. Start now, take action, and let the momentum carry you. Every step forward brings you closer to the person you're meant to be.",
  },
  {
    text: "Success doesn't come from luck or chance; it comes from relentless effort. Work hard, stay focused, and keep your eyes on the prize. Every hour you invest, every challenge you face, is building a foundation for your success.",
  },
  {
    text: "Greatness isn't achieved by avoiding challenges, but by overcoming them. Life will test your limits, but each time you push through, you'll grow stronger. Keep going, and remember that your hard work and perseverance will lead you to success.",
  },
  {
    text: "No matter how many times you fall, what matters is how many times you get up. Each fall is a lesson, and each lesson brings you closer to your goals. Keep getting up, keep moving forward, and success will eventually follow.",
  },
  {
    text: "Success is a journey, not a destination. It's about embracing every step, learning from every setback, and staying committed to your dreams. The road may be long, but each effort you put in brings you closer to the success you deserve.",
  },
  {
    text: "Don't let fear hold you back from pursuing your dreams. The only limits that exist are the ones you place on yourself. Break free from self-doubt, take that first step, and trust that the path ahead will reveal itself as you continue moving forward.",
  },
  {
    text: "Your potential is limitless, and every day is a new opportunity to realize it. Don't let challenges discourage you; use them as fuel to push harder, to be better, and to strive for greatness. Your success is within reach if you keep going.",
  },
  {
    text: "The hardest part is often taking the first step, but once you do, the momentum will carry you. Keep moving forward, even when things get tough. You have the strength within you to overcome any obstacle and achieve greatness.",
  },
  {
    text: "Dreams don't work unless you do. Success is not something that happens to you; it's something you create with your hard work, determination, and persistence. Keep pushing forward, and don't stop until you've achieved everything you've set out to accomplish.",
  },
  {
    text: "Obstacles are not roadblocks; they are opportunities in disguise. Every challenge you face is a chance to grow, learn, and improve. Stay focused, keep moving forward, and use every difficulty as a stepping stone towards your success.",
  },
  {
    text: "Never underestimate your ability to overcome obstacles. Your resilience, your determination, and your willpower are stronger than any challenge that comes your way. Keep going, because you have everything it takes to achieve your goals.",
  },
  {
    text: "Success is not about avoiding failure, but learning how to rise after each fall. Every setback is an opportunity to grow stronger, smarter, and more resilient. Keep pushing forward, because your breakthrough is closer than you think.",
  },
];
const shuffleArray = data.sort(() => Math.random() - 0.5);

async function init() {
  const typingInstance = new Typing(shuffleArray);
  const keyboard = new Keyboard();

  keyboard.showKeyBoard();

  document.addEventListener(
    "keydown",
    typingInstance.backSpaceHandler.bind(typingInstance)
  );

  document.addEventListener(
    "keypress",
    typingInstance.keyPressHandler.bind(typingInstance)
  );

  //updating keyboard layout
  document.addEventListener("keydown", (e) => {
    keyboard.pressKey(e.key, e);
    if (e.key == "Tab" || e.key == "Alt") e.preventDefault();
  });

  document.addEventListener("keyup", (e) => {
    keyboard.unPressKey(e.key, e);
  });
}

init();
