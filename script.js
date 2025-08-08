// ===== SELECTORS =====
const login = document.querySelector("#login");
const yes = document.getElementById("yes");
const no = document.getElementById("no");
const naming = document.querySelector(".naming");
const form = document.querySelector("form");
const verify = document.querySelector("#verify");
const input = document.querySelector("input[type='text']");
const welcome = document.getElementById("Welcome");
const finalMessage = document.getElementById("page");
const container = document.getElementById("image-container");

// ===== ENTRY POINT =====
function init() {
    yes.addEventListener("click", handleYesClick);
    no.addEventListener("click", handleNoClick);
    verify.addEventListener("click", handleVerifyClick);
    hideElement(naming);
    hideElement(welcome);
    hideElement(finalMessage);
}

// ===== HANDLERS =====
function handleYesClick() {
    showElement(naming);
}

function handleNoClick() {
    form.innerHTML = `<h1 style="color: crimson;">🚫 Get lost 😠</h1>`;
}

function handleVerifyClick(e) {
    e.preventDefault();
    const name = input.value.trim().toLowerCase();

    if (name === "") {
        alert("Please enter your name");
        return;
    }

    if (name === "parisha") {
        showParishaMessage();
    } else if (name === "bhagwaan") {
        triggerWelcomeSequence();
    } else {
        form.innerHTML = `<h1 style="color: crimson;">❌ Get lost imposter 😡</h1>`;
    }
}

// ===== PARISHA RESPONSE =====
function showParishaMessage() {
    const oldMsg = document.querySelector(".parisha-msg");
    if (oldMsg) oldMsg.remove();

    const p = document.createElement("p");
    p.textContent = "It's not what Unique calls you, is it? 😏";
    p.classList.add("parisha-msg");
    naming.appendChild(p);

    setTimeout(() => {
        p.remove();
    }, 2000);
}
// ===== TYPEWRITER EFFECT =====
function typewriterEffect(element, words, speed = 150, pause = 1500) {
    let wordIndex = 0;
    let charIndex = 0;
    let typing = true;

    function type() {
        if (typing) {
            if (charIndex < words[wordIndex].length) {
                element.textContent += words[wordIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, speed);
            } else {
                typing = false;
                setTimeout(type, pause);
            }
        } else {
            if (charIndex > 0) {
                element.textContent = element.textContent.slice(0, -1);
                charIndex--;
                setTimeout(type, speed / 2);
            } else {
                typing = true;
                wordIndex = (wordIndex + 1) % words.length;
                setTimeout(type, speed);
            }
        }
    }

    type();
}


// ===== WELCOME SEQUENCE =====
function triggerWelcomeSequence() {
    fadeOut(login, 1000, () => {
        login.style.display = "none";

        showElement(welcome);
        fadeIn(welcome, 1000);

        // Start typewriter on #change element after fadeIn
        const change = document.getElementById('change');
        if(change) {
            typewriterEffect(change, ['bhagwaan', 'parisha']);
        }

        setTimeout(() => {
            fadeOut(welcome, 1000, () => {
                welcome.style.display = "none";

                // Prepare and show images container
                container.style.position = "relative";
                container.style.width = "700px";
                container.style.height = "400px";
                container.style.margin = "2em auto";
                container.style.display = "block";
                createAnimatedImages();
            });
        }, 2000);
    });
}

// ===== IMAGES =====
const images = [
  'assets/i1.png', 
  'assets/i2.png', 
  'assets/i3.png', 
  'assets/i4.png', 
  'assets/i5.png', 
  'assets/i6.png'
];

// ===== CREATE ANIMATED IMAGES (NEW LOGIC) =====
function createAnimatedImages() {
    // Clear container first if needed
    container.innerHTML = '';

    const centerX = container.clientWidth / 2;
    const centerY = container.clientHeight / 2;
    container.style.position = "relative";

    images.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = src;
        img.loading = 'lazy';
        img.style.width = '120px';
        img.style.height = '120px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '15px';
        img.style.position = 'absolute';
        img.style.userSelect = 'none';
        img.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        container.appendChild(img);

        // Position images offscreen depending on index (4 sides)
        switch(i % 4) {
            case 0: // from left
                gsap.set(img, { x: -150, y: centerY - 60 });
                break;
            case 1: // from right
                gsap.set(img, { x: container.clientWidth + 150, y: centerY - 60 });
                break;
            case 2: // from top
                gsap.set(img, { x: centerX - 60, y: -150 });
                break;
            case 3: // from bottom
                gsap.set(img, { x: centerX - 60, y: container.clientHeight + 150 });
                break;
        }
    });

    const imgs = container.querySelectorAll('img');

    // Animate to center
    gsap.to(imgs, {
        duration: 1.5,
        x: centerX - 60,
        y: centerY - 60,
        ease: "power2.out",
        onComplete: () => {
            blastImages(imgs);
        }
    });
}

function blastImages(imgs) {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    imgs.forEach((img, i) => {
        let targetX, targetY;

        // Blast to corners based on index
        switch(i % 4) {
            case 0: // top-left
                targetX = -100;
                targetY = -100;
                break;
            case 1: // top-right
                targetX = containerWidth + 100;
                targetY = -100;
                break;
            case 2: // bottom-left
                targetX = -100;
                targetY = containerHeight + 100;
                break;
            case 3: // bottom-right
                targetX = containerWidth + 100;
                targetY = containerHeight + 100;
                break;
            default:
                targetX = containerWidth / 2;
                targetY = containerHeight / 2;
        }

        gsap.to(img, {
            duration: 1.2,
            x: targetX,
            y: targetY,
            scale: 0.5,
            opacity: 0,
            ease: "power2.in",
            delay: i * 0.15
        });
    });

    // After blast animation finishes, show birthday message
    gsap.delayedCall(2, () => {
        container.style.display = "none";
        showElement(finalMessage);
        fadeIn(finalMessage, 1000);
    });
}

// ===== HELPERS =====
function fadeOut(el, duration = 1000, callback) {
    el.style.transition = `opacity ${duration}ms ease`;
    el.style.opacity = 0;
    if (callback) setTimeout(callback, duration);
}

function fadeIn(el, duration = 1000, callback) {
    el.style.display = "block";
    setTimeout(() => {
        el.style.transition = `opacity ${duration}ms ease`;
        el.style.opacity = 1;
        if (callback) setTimeout(callback, duration);
    }, 50);
}

function showElement(el) {
    el.style.display = "block";
    el.style.opacity = 0;
    fadeIn(el, 1000);
}

function hideElement(el) {
    el.style.display = "none";
    el.style.opacity = 0;
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(Draggable); // you can remove this if you don't need draggable anymore
    init();
});




const next = () => {
  const text = document.querySelector('#text');
  const images = [
    'assets/i1.png', 
    'assets/i2.png', 
    'assets/i3.png', 
    'assets/i4.png', 
    'assets/i5.png', 
    'assets/i6.png'
  ];
  const cont = document.querySelector('.cont');
const audioo=document.getElementById('audioo');
audioo.style.display='none';
  // Slide out the text
  text.style.transform = 'translateX(-200%)';

  setTimeout(() => {
    text.style.display = 'none';

    if (!cont) {
      console.error('Container element with class "cont" not found!');
      return;
    }

    

    // Function to add images one by one with delay
    let index = 0;

    const addImage = () => {
      if (index >= images.length) return;

      const imgg = document.createElement('img');
      imgg.src = images[index];
      imgg.alt = `Image ${index + 1}`;

      // Add styles
      imgg.style.width = '200px';
      imgg.style.height = 'auto';
      imgg.style.borderRadius = '10px';
      imgg.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      imgg.style.display = 'block';
      imgg.style.margin = '20px auto';
      imgg.style.opacity = '0';
      imgg.style.transition = 'opacity 0.5s ease';

      cont.appendChild(imgg);

      // Trigger fade-in effect
      requestAnimationFrame(() => {
        imgg.style.opacity = '1';
        setTimeout(() => {
        imgg.style.opacity = '0';
        const next = document.querySelector('#next');
        next.style.display = 'none';
       
          
    }, 500);

    setTimeout(()=>{
        imgg.style.opacity = '1';
        const listofthings = document.querySelector('.list-of-things');
        listofthings.style.display = 'block';
  
    },5000)
});

index++;
// Schedule next image after 1 second delay
setTimeout(addImage, 1000);
};


    addImage();

  }, 1000);
}


const displaytime=()=>{
    const time = document.querySelector('#time');
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    time.textContent = `${hours}:${minutes}`;
    const noon = document.querySelectorAll  ('#noon');
    if (hours >= 12 && hours < 18) {
        noon.forEach((noon) => {
            noon.textContent = 'Shaam';
        });
    }
    if (hours >= 18 && hours < 24) {
        noon.forEach((noon) => {
            noon.textContent = 'Raat';
        });
    }
    if (hours < 12 || hours >= 18) {
        noon.forEach((noon) => {
            noon.textContent = 'Subha';
        });
    }
}

displaytime()


const playAudio = () => {
    const audio = document.getElementById('birthdayAudio');
    audio.play();
    
}

const stopAudio = () => {
    const audio = document.getElementById('birthdayAudio');
    audio.pause();
}

const audioo = document.getElementById('audioo');
audioo.addEventListener('click', () => {
    if(audioo.classList.contains('play')) {
        playAudio();
        audioo.classList.remove('play');
        audioo.classList.add('pause');
    } else {
        stopAudio();
        audioo.classList.remove('pause');
        audioo.classList.add('play');
    }
});
