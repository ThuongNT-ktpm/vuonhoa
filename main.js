// ---- HÀM LẤY THAM SỐ TỪ URL ----
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);

  // Kiểm tra nếu có tham số c (encoded content)
  const encodedContent = urlParams.get("c");
  if (encodedContent) {
    try {
      // Giải mã base64 đã được URL-safe
      const base64 = encodedContent.replace(/-/g, "+").replace(/_/g, "/");
      const decodedString = decodeURIComponent(escape(atob(base64)));
      const content = JSON.parse(decodedString);

      // Kiểm tra và trả về giá trị tương ứng
      if (name === "title" && content.title) return content.title;
      if (name === "message" && content.message) return content.message;
      if (name === "image" && content.image) return content.image;
      if (name === "music" && content.music) return content.music;
    } catch (e) {
      console.error("Lỗi khi giải mã Base64:", e);
    }
  }

  // Kiểm tra tham số thông thường trong URL (không mã hóa)
  const regularParam = urlParams.get(name);
  if (regularParam) {
    return regularParam;
  }

  // Trả về giá trị mặc định nếu không có trong URL
  if (name === "title") return "Happy Women's Day! 🌸";
  if (name === "message")
    return "Gửi đến người phụ nữ tuyệt vời nhất! Nhân ngày 8/3, xin gửi lời chúc yêu thương. Cảm ơn vì luôn là người tuyệt vời nhất. Phụ nữ là để yêu thương. Chúc luôn xinh đẹp, hạnh phúc và bình an. Mong rằng mỗi ngày đều tràn ngập niềm vui! Yêu thương mãi mãi! 💐";
  if (name === "image") return "images/love.jpeg";
  if (name === "music")
    return "https://cdn.shopify.com/s/files/1/0757/9700/4572/files/tiktok-music-1772120742469-sm5buq.mp3?v=1772120746";

  return null;
}

onload = () => {
  document.body.classList.remove("container");

  // Initialize content from URL params
  initializeContent();

  // Add sparkle effect when card appears
  setTimeout(() => {
    createSparkles();
  }, 6000);

  // Auto play music with user interaction
  playMusic();

  // Show preview button if isPreview=true
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("isPreview") === "true") {
    document.getElementById("previewBtn").style.display = "block";
  }
};

// Initialize content from URL parameters
function initializeContent() {
  const title = getUrlParameter("title");
  const message = getUrlParameter("message");
  const image = getUrlParameter("image");
  const music = getUrlParameter("music");

  // Update card text
  const cardText = document.querySelector(".valentine-container .card .text");
  cardText.innerHTML = title;

  // Update modal title
  document.querySelector(".modal-title").innerHTML = title;

  // Update modal message (typewriter)
  const typewriterEl = document.querySelector(".typewriter-text");
  typewriterEl.dataset.fullText = message;
  typewriterEl.textContent = "";

  // Update image
  document.querySelector(".polaroid-image img").src = image;

  // Update music
  document.getElementById("bgMusic").src = music;
}

// Music control
let isPlaying = false;
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");

function playMusic() {
  // Try to play music
  const playPromise = bgMusic.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isPlaying = true;
        musicToggle.classList.add("playing");
        musicIcon.classList.add("playing");
        musicIcon.classList.remove("muted");
      })
      .catch(() => {
        // Autoplay was prevented, need user interaction
        isPlaying = false;
        musicToggle.classList.remove("playing");
        musicIcon.classList.remove("playing");
        musicIcon.classList.add("muted");

        // Play on first user interaction (click, touch, scroll, keydown)
        function playOnInteraction() {
          if (isPlaying) return;
          bgMusic
            .play()
            .then(() => {
              isPlaying = true;
              musicToggle.classList.add("playing");
              musicIcon.classList.add("playing");
              musicIcon.classList.remove("muted");
            })
            .catch(() => {});
          ["click", "touchstart", "scroll", "keydown"].forEach((evt) => {
            document.removeEventListener(evt, playOnInteraction);
          });
        }
        ["click", "touchstart", "scroll", "keydown"].forEach((evt) => {
          document.addEventListener(evt, playOnInteraction, { once: true });
        });
      });
  }
}

function toggleMusic() {
  if (isPlaying) {
    bgMusic.pause();
    isPlaying = false;
    musicToggle.classList.remove("playing");
    musicIcon.classList.remove("playing");
    musicIcon.classList.add("muted");
  } else {
    bgMusic.play();
    isPlaying = true;
    musicToggle.classList.add("playing");
    musicIcon.classList.add("playing");
    musicIcon.classList.remove("muted");
  }
}

// Create sparkle particles around the card
function createSparkles() {
  const sparkleCount = 20;
  const container = document.querySelector(".valentine-container");

  for (let i = 0; i < sparkleCount; i++) {
    setTimeout(() => {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #ffd700;
                border-radius: 50%;
                box-shadow: 0 0 10px #ffd700;
                pointer-events: none;
                left: 50%;
                top: 50%;
                animation: sparkle-burst 1s ease-out forwards;
                --angle: ${(360 / sparkleCount) * i}deg;
            `;
      container.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 1000);
    }, i * 30);
  }
}

// Typewriter effect
let typewriterTimer = null;

function startTypewriter() {
  const el = document.querySelector(".typewriter-text");
  if (!el) return;
  const fullText = el.dataset.fullText || "";
  el.textContent = "";
  el.classList.remove("done");
  let i = 0;
  const charsPerTick = 2;

  if (typewriterTimer) cancelAnimationFrame(typewriterTimer);

  let lastTime = 0;
  function tick(timestamp) {
    if (timestamp - lastTime < 50) {
      typewriterTimer = requestAnimationFrame(tick);
      return;
    }
    lastTime = timestamp;

    if (i < fullText.length) {
      const end = Math.min(i + charsPerTick, fullText.length);
      el.textContent += fullText.substring(i, end);
      i = end;
      typewriterTimer = requestAnimationFrame(tick);
    } else {
      typewriterTimer = null;
      el.classList.add("done");
    }
  }
  typewriterTimer = requestAnimationFrame(tick);
}

// Modal functions
function openModal() {
  const modal = document.getElementById("wishModal");
  if (modal.classList.contains("show")) return;
  modal.classList.add("show");
  document.body.classList.add("modal-open");
  document.body.style.overflow = "hidden";
  startTypewriter();
}

function closeModal() {
  const modal = document.getElementById("wishModal");
  modal.classList.remove("show");
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "auto";
  if (typewriterTimer) {
    cancelAnimationFrame(typewriterTimer);
    typewriterTimer = null;
  }
}

// Valentine card - support both click and touch for mobile
(function () {
  const valentineContainer = document.querySelector(".valentine-container");
  if (valentineContainer) {
    valentineContainer.addEventListener("touchend", function (e) {
      e.preventDefault();
      openModal();
    });
    valentineContainer.addEventListener("click", function (e) {
      openModal();
    });
  }

  // Close modal when clicking/touching outside
  const modal = document.getElementById("wishModal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
    modal.addEventListener("touchend", function (e) {
      if (e.target === modal) closeModal();
    });
  }
})();

// Add sparkle animation to CSS dynamically
const style = document.createElement("style");
style.textContent = `
    @keyframes sparkle-burst {
        0% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateX(150px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
