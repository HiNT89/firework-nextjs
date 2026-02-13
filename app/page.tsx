"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Input, Radio, Button } from "antd";
import {
  GiftOutlined,
  HeartFilled,
  StarFilled,
  SmileFilled,
} from "@ant-design/icons";
import { useFireworkEngine } from "@/hooks/useFireworkEngine";
import { useFireworkStore } from "@/stores/useFireworkStore";
import { apiUserService } from "@/api/apiUserService";

// Danh sách câu chúc Tết theo giới tính
const WISHES_MALE = [


  "🧧 Chúc anh năm 2026 sức khoẻ dồi dào 💪, tiền vào như nước 💸, mọi việc hanh thông 🚀.",

  "🎉 Năm mới chúc anh sự nghiệp thăng tiến 📈, dự án thuận lợi ✅, cuộc sống nhiều niềm vui 😄.",

  "🍀 Chúc anh 2026 làm đâu thắng đó 🔥, gặp nhiều may mắn ✨ và luôn giữ phong độ 😎.",

  "💼 Năm mới mong anh công việc suôn sẻ 📊, thu nhập tăng đều 💰 và tinh thần luôn vững vàng 🧠.",

  "🚀 Chúc anh một năm bứt phá mạnh mẽ ⚡, mục tiêu nào cũng hoàn thành 🎯.",

  "😄 Năm 2026 chúc anh cười nhiều hơn 😂, stress ít lại 🧘 và thành công nhiều hơn 🏆."
  ,
  "🍻 Chúc anh năm mới nhiều cơ hội mới 🌟, nhiều mối quan hệ tốt 🤝 và nhiều trải nghiệm đáng nhớ 📸.",

  "🔥 Chúc anh bản lĩnh hơn 💪, tự tin hơn 😎 và luôn làm chủ cuộc chơi 🎮.",

  "💰 Năm mới chúc anh ví tiền luôn đầy 📈, sức khoẻ luôn tốt ❤️ và tinh thần luôn tích cực ☀️.",

  "🌟 Chúc anh năm 2026 trưởng thành hơn 🧠, thành công hơn 🏆 và hạnh phúc hơn mỗi ngày 😊.",
];

const WISHES_FEMALE = [
  "🌸 Chúc chị năm 2026 luôn xinh đẹp ✨, vui vẻ 😊 và gặp nhiều điều may mắn 🍀.",

  "💖 Năm mới chúc chị hạnh phúc trọn vẹn 🥰, công việc suôn sẻ 📊 và tài chính dư dả 💰.",

  "🎀 Chúc chị luôn toả sáng 🌟, tự tin 😌 và đạt được mọi mục tiêu 🎯.",

  "🌷 Năm 2026 mong chị luôn được yêu thương 💕, bảo vệ 🤍 và sống thật vui vẻ 😄.",

  "✨ Chúc chị một năm nhẹ nhàng 🕊️, bình yên 🌿 nhưng vẫn đầy thành tựu 🏆.",

  "💼 Năm mới chúc chị sự nghiệp thăng tiến 📈, tinh thần tích cực ☀️ và nhiều cơ hội mới 🚪.",

  "😊 Chúc chị cười thật nhiều 😄, stress thật ít 🧘 và luôn giữ năng lượng tích cực 🔋.",

  "🌺 Năm 2026 mong chị luôn mạnh mẽ 💪, độc lập 🌟 và tự hào về chính mình 💖.",

  "🎉 Chúc chị mỗi ngày đều là một niềm vui 🎈, mỗi tháng đều có thành tựu 🏆.",

  "🍀 Năm mới chúc chị bình an ❤️, rực rỡ ✨ và hạnh phúc dài lâu 🥰.",
];

const SPACIAL_WISHES = [
  "🌿 Chúc em năm mới thật bình an, nhẹ lòng hơn sau những áp lực đã trải qua và luôn tìm thấy những khoảnh khắc khiến mình mỉm cười 🙂",
  "✨ Mong rằng năm mới sẽ mang đến cho em nhiều niềm vui giản dị, những điều tử tế và những người thật lòng ở bên cạnh 🤍",
  "🌸 Chúc em luôn mạnh mẽ, vững vàng và cũng đủ dịu dàng với chính mình trong mọi giai đoạn của cuộc sống 💫",
  "🚀 Hy vọng năm mới mở ra cho em thật nhiều cơ hội mới, trải nghiệm đẹp và những kỷ niệm khiến em tự hào khi nhìn lại 🌈",
  "🧧 Chúc em một năm mới thật hạnh phúc — dù ở đâu, làm gì, vẫn luôn cảm thấy được yêu thương và trân trọng 💖"
];

// ==================== TIMING CONFIG ====================
// Có thể tùy chỉnh thời gian ở đây
const TIMING_CONFIG = {
  // Thời gian box xuất hiện (ms)
  boxAppearDelay: 30000, // 30 seconds

  // Animation lời chúc
  wishDuration: 15, // Thời gian mỗi lời chúc bay lên (seconds) - tăng lên để chậm hơn
  wishDelayBetween: 2, // Delay giữa các lời chúc (seconds)

  // Animation lì xì
  luckyMoneyDuration: 3, // Thời gian lì xì bay lên (seconds)

  // Firework effects cycle (trong 30-45s đầu)
  fireworkCycleEnabled: true, // Bật/tắt cycle pháo hoa
  fireworkCycleStart: 0, // Bắt đầu cycle sau (ms)
  fireworkCycleEnd: 45000, // Kết thúc cycle sau (ms) - 45 seconds
  fireworkChangeInterval: 3000, // Đổi effect mỗi (ms) - 3 seconds

  // Thời gian hiển thị HeartName sau khi nhập tên (ms)
  heartNameDuration: 20000, // 20 seconds (15-20s range)
};

// Danh sách các loại pháo hoa để cycle
const FIREWORK_EFFECTS = [
  "Random",
  "Crackle",
  "Crossette",
  "Crysanthemum",
  "Falling Leaves",
  "Floral",
  "Ghost",
  "Heart",
  "Horse Tail",
  "Palm",
  "Ring",
  "Strobe",
  "Willow",
] as const;
// ========================================================

type Gender = "male" | "female";

interface WishCardProps {
  wish: string;
  index: number;
  onAnimationComplete: () => void;
  totalWishes: number;
}

// Component hiển thị câu chúc với icon hiệu ứng (thay bóng bay)
const WishCard: React.FC<WishCardProps> = ({
  wish,
  index,
  onAnimationComplete,
  totalWishes,
}) => {
  const icons = [HeartFilled, StarFilled, SmileFilled, GiftOutlined];
  const IconComponent = icons[index % icons.length];
  const colors = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6b9d"];
  const [screenHeight, setScreenHeight] = useState(0);

  useEffect(() => {
    setScreenHeight(window.innerHeight);
  }, []);

  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{
        left: `${15 + (index * 70) / totalWishes}%`,
        bottom: -150,
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
      initial={{ y: 0, opacity: 0, scale: 0.5 }}
      animate={{
        y: screenHeight > 0 ? -(screenHeight + 200) : -1000,
        opacity: [0, 1, 1, 1, 0],
        scale: [0.5, 1, 1, 1, 0.8],
        rotate: [0, -3, 3, -3, 0],
      }}
      transition={{
        duration: TIMING_CONFIG.wishDuration,
        delay: index * TIMING_CONFIG.wishDelayBetween,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier for smoother animation
      }}
      onAnimationComplete={() => {
        if (index === totalWishes - 1) {
          onAnimationComplete();
        }
      }}
    >
      {/* Icon với hiệu ứng pulse */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <IconComponent
          style={{
            fontSize: 48,
            color: colors[index % colors.length],
            filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))",
          }}
        />
      </motion.div>

      {/* Dây nối */}
      <motion.div
        className="w-0.5 h-12"
        style={{
          background: `linear-gradient(to bottom, ${colors[index % colors.length]}, transparent)`,
        }}
        animate={{ scaleY: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Card câu chúc */}
      <motion.div
        className="px-4 py-3 rounded-xl shadow-2xl max-w-xs text-center backdrop-blur-sm"
        style={{
          background: `linear-gradient(135deg, ${colors[index % colors.length]}dd, ${colors[(index + 1) % colors.length]}aa)`,
          border: "2px solid rgba(255,255,255,0.3)",
        }}
        whileHover={{ scale: 1.05 }}
      >
        <p className="text-white font-bold text-sm md:text-base drop-shadow-lg">
          {wish}
        </p>
      </motion.div>
    </motion.div>
  );
};

// Component Lì xì
const LuckyMoney: React.FC<{ handleOnClick: () => void }> = ({
  handleOnClick,
}) => {
  const [screenHeight, setScreenHeight] = useState(0);

  useEffect(() => {
    setScreenHeight(window.innerHeight);
  }, []);

  return (
    <motion.div
      className="fixed flex flex-col items-center cursor-pointer z-50"
      style={{
        left: "50%",
        bottom: -200,
        x: "-50%",
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: screenHeight > 0 ? -(screenHeight / 2 + 100) : -500,
        opacity: 1,
      }}
      transition={{
        duration: TIMING_CONFIG.luckyMoneyDuration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleOnClick}
    >
      {/* Lì xì envelope */}
      <motion.div
        className="relative"
        animate={{
          y: [0, -10, 0],
          rotate: [-3, 3, -3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Bao lì xì */}
        <div className="relative w-32 h-44 md:w-40 md:h-56">
          {/* Phần thân bao lì xì */}
          <div
            className="absolute inset-0 rounded-lg shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #ff4d4d, #cc0000)",
              border: "3px solid #ffd700",
            }}
          >
            {/* Hoa văn trang trí */}
            <div className="absolute inset-2 border-2 border-yellow-400/30 rounded-md" />

            {/* Chữ Phúc */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #ffd700, #ffaa00)",
                  boxShadow: "0 0 20px rgba(255,215,0,0.5)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255,215,0,0.5)",
                    "0 0 40px rgba(255,215,0,0.8)",
                    "0 0 20px rgba(255,215,0,0.5)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-red-600 font-bold text-2xl md:text-3xl"></span>
              </motion.div>
            </div>

            {/* Nắp bao lì xì */}
            <div
              className="absolute top-0 left-0 right-0 h-12 md:h-14 rounded-t-lg"
              style={{
                background: "linear-gradient(135deg, #ff6666, #dd0000)",
                borderBottom: "2px solid #ffd700",
              }}
            >
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-linear-to-br from-yellow-400 to-yellow-600 border-2 border-yellow-300" />
            </div>
          </div>
        </div>

        {/* Sparkles xung quanh */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-yellow-400"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${-10 + Math.random() * 120}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>

      {/* Text Click me */}
      <motion.div
        className="mt-4 px-6 py-2 rounded-full font-bold text-lg md:text-xl"
        style={{
          background: "linear-gradient(135deg, #ffd700, #ffaa00)",
          color: "#cc0000",
          boxShadow: "0 4px 20px rgba(255,215,0,0.5)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 4px 20px rgba(255,215,0,0.5)",
            "0 4px 30px rgba(255,215,0,0.8)",
            "0 4px 20px rgba(255,215,0,0.5)",
          ],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        🧧 Click Me! 🧧
      </motion.div>
    </motion.div>
  );
};

const HappyNewYear = () => {
  const [step, setStep] = useState<number>(0);
  const [userName, setUserName] = useState<string>("");
  const [gender, setGender] = useState<Gender>("male");
  const [showLuckyMoney, setShowLuckyMoney] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [stopCycle, setStopCycle] = useState(false);

  // Firework refs
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const trailsCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { handlePointerDown } = useFireworkEngine(
    mainCanvasRef,
    trailsCanvasRef,
    containerRef,
  );

  const togglePause = useFireworkStore((state) => state.togglePause);
  const updateConfig = useFireworkStore((state) => state.updateConfig);
  // Kiểm tra tên đặc biệt để hiển thị HeartName "LOVE"
  const isSpecialUser = useMemo(() => {
    return userName.toLowerCase().includes("love");
  }, [userName]);
  // Get random wishes based on gender
  const wishes = useMemo(() => {
    if (isSpecialUser) {
      return SPACIAL_WISHES;
    }
    const wishList = gender === "male" ? WISHES_MALE : WISHES_FEMALE;
    const name = userName.trim().toUpperCase();
    // Lấy 3-4 câu chúc ngẫu nhiên
    return wishList
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
      .map((w) =>
        w.replace("anh", name || "bạn").replace("chị", name || "bạn"),
      );
  }, [gender, userName, isSpecialUser]);

  // Lì xì link - có thể customize
  const luckyMoneyLink = "https://onelink.zalopay.vn/zalopay-tarot?from_source=zalopay-tarot&onelink=true&os=iOS&trace_id=624dc9ea-4ee3-45b0-ade8-97ad76c2b721&url_id=zalopay-tarot&utm_campaign=tarot&utm_content=post&utm_medium=fb&utm_source=zalopay-tarot&zlp_platform=ZPA";

  // Initialize fireworks
  useEffect(() => {
    togglePause(false);
  }, [togglePause]);

  // Cycle through all firework effects in 30-45s
  useEffect(() => {
    if (!TIMING_CONFIG.fireworkCycleEnabled || stopCycle) return;

    let effectIndex = 0;
    const startTime = Date.now();

    const cycleInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      // Chỉ cycle trong khoảng thời gian cho phép
      if (
        elapsed >= TIMING_CONFIG.fireworkCycleStart &&
        elapsed < TIMING_CONFIG.fireworkCycleEnd
      ) {
        const effect = FIREWORK_EFFECTS[effectIndex % FIREWORK_EFFECTS.length];
        updateConfig({ shell: effect });
        effectIndex++;
      }

      // Dừng cycle sau khi hết thời gian
      if (elapsed >= TIMING_CONFIG.fireworkCycleEnd) {
        clearInterval(cycleInterval);
        // Quay về Random sau khi cycle xong
        updateConfig({ shell: "Random" });
      }
    }, TIMING_CONFIG.fireworkChangeInterval);

    return () => clearInterval(cycleInterval);
  }, [updateConfig, stopCycle]);

  // Show box after configured delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBox(true);
    }, TIMING_CONFIG.boxAppearDelay);
    return () => clearTimeout(timer);
  }, []);

  // Handle form submit
  const handleSubmit = () => {
    if (userName.trim()) {
      // Dừng cycle pháo hoa
      setStopCycle(true);

      // Đổi firework thành HeartName với tên user (chưa bật Finale Mode)
      updateConfig({
        shell: "HeartName",
        customText: isSpecialUser ? "LOVE" : userName.toUpperCase(),
        finale: false, // Chưa bật Finale Mode
      });
      setStep(1);

      // Sau 15-20s, chuyển sang Random + bật Finale Mode
      setTimeout(() => {
        updateConfig({
          shell: "Random",
          finale: true, // Bật Finale Mode cho pháo hoa hoành tráng
        });
      }, TIMING_CONFIG.heartNameDuration);
    }
  };

  // Khi wishes bay lên hết thì hiện lì xì
  const handleWishesComplete = () => {
    setShowLuckyMoney(true);
  };

  // Handle click on Lucky Money
  const handleLuckyMoneyClick = async () => {
    try {
      // Có thể thêm hiệu ứng hoặc logic khi click vào lì xì
      window.open(luckyMoneyLink, "_blank");
      apiUserService.createUser(userName, gender).catch((err) => {
        console.error("Error creating user:", err);
      });
    } catch (error) { }
  };
  return (
    <main className="bg-black h-screen w-screen text-white relative overflow-hidden">
      {/* Firework Canvas Background */}
      <div
        ref={containerRef}
        className="canvas-container absolute inset-0 w-full h-full"
        style={{ backgroundColor: "#000" }}
      >
        <canvas
          id="trails-canvas"
          ref={trailsCanvasRef}
          className="absolute inset-0"
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        />
        <canvas
          id="main-canvas"
          ref={mainCanvasRef}
          className="absolute inset-0 pointer-events-none"
        />
      </div>

      {/* Step 0: Box nhập tên rơi xuống (sau 30s) */}
      <AnimatePresence>
        {step === 0 && showBox && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pointer-events-auto mx-4"
              initial={{ y: -window.innerHeight, rotate: -10 }}
              animate={{
                y: 0,
                rotate: 0,
              }}
              exit={{
                y: window.innerHeight,
                opacity: 0,
                scale: 0.5,
              }}
              transition={{
                type: "spring",
                damping: 15,
                stiffness: 100,
                duration: 1.5,
              }}
            >
              <div
                className="p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full backdrop-blur-md relative"
                style={{
                  //   background:
                  //     "linear-gradient(135deg, rgba(220,38,38,0.6), rgba(185,28,28,0.5))",
                  background: "transparent",
                  border: "3px solid #ffd700",
                  boxShadow: "0 0 40px rgba(255,215,0,0.3)",
                }}
              >
                {/* Header */}
                <motion.div
                  className="text-center mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                >
                  <motion.h1
                    className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2"
                    animate={{
                      textShadow: [
                        "0 0 10px #ffd700",
                        "0 0 30px #ffd700",
                        "0 0 10px #ffd700",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎊 Chúc Mừng Năm Mới 🎊
                  </motion.h1>
                  <p className="text-yellow-200 text-sm md:text-base">
                    Nhập tên để nhận lời chúc đặc biệt!
                  </p>
                </motion.div>

                {/* Form */}
                <motion.div
                  className="space-y-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  {/* Input tên */}
                  <div>
                    <label className="block text-yellow-200 mb-2 font-medium">
                      Tên của bạn:
                    </label>
                    <Input
                      size="large"
                      placeholder="Nhập tên của bạn..."
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="bg-white/90! border-yellow-400! text-gray-800!"
                      style={{ borderWidth: 2 }}
                      onPressEnter={handleSubmit}
                    />
                  </div>

                  {/* Radio giới tính */}
                  <div>
                    <label className="block text-yellow-200 mb-2 font-medium">
                      Giới tính:
                    </label>
                    <Radio.Group
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="flex gap-4"
                    >
                      <Radio
                        value="male"
                        className="text-white! [&_.ant-radio-inner]:border-yellow-400! [&_.ant-radio-checked_.ant-radio-inner]:bg-yellow-400! [&_.ant-radio-checked_.ant-radio-inner]:border-yellow-400!"
                      >
                        <span className="text-white">Nam 👨</span>
                      </Radio>
                      <Radio
                        value="female"
                        className="text-white! [&_.ant-radio-inner]:border-yellow-400! [&_.ant-radio-checked_.ant-radio-inner]:bg-yellow-400! [&_.ant-radio-checked_.ant-radio-inner]:border-yellow-400!"
                      >
                        <span className="text-white">Nữ 👩</span>
                      </Radio>
                    </Radio.Group>
                  </div>

                  {/* Submit button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="primary"
                      size="large"
                      block
                      onClick={handleSubmit}
                      disabled={!userName.trim()}
                      className="h-12! text-lg! font-bold! rounded-xl!"
                      style={{
                        background: userName.trim()
                          ? "linear-gradient(135deg, #ffd700, #ffaa00)"
                          : undefined,
                        border: "none",
                        color: userName.trim() ? "#cc0000" : undefined,
                      }}
                    >
                      🎆 Nhận Lời Chúc 🎆
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Decorations */}
                <div className="absolute -top-4 -left-4 text-4xl">🧧</div>
                <div className="absolute -top-4 -right-4 text-4xl">🎉</div>
                <div className="absolute -bottom-4 -left-4 text-4xl">🎊</div>
                <div className="absolute -bottom-4 -right-4 text-4xl">🏮</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 1: Hiển thị câu chúc bay lên */}
      <AnimatePresence>
        {step === 1 && (
          <motion.div
            className="fixed inset-0 z-30 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Greeting header */}
            <motion.div
              className="absolute top-8 left-0 right-0 text-center z-40"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.h2
                className="text-2xl md:text-4xl font-bold text-yellow-400 drop-shadow-lg"
                animate={{
                  textShadow: [
                    "0 0 10px #ffd700, 0 0 20px #ff6b6b",
                    "0 0 20px #ffd700, 0 0 40px #ff6b6b",
                    "0 0 10px #ffd700, 0 0 20px #ff6b6b",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨ Gửi {userName.toUpperCase()} ✨
              </motion.h2>
            </motion.div>

            {/* Wishes floating up */}
            {wishes.map((wish, index) => (
              <WishCard
                key={index}
                wish={wish}
                index={index}
                totalWishes={wishes.length}
                onAnimationComplete={handleWishesComplete}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2: Lì xì bay lên */}
      <AnimatePresence>
        {showLuckyMoney && <LuckyMoney handleOnClick={handleLuckyMoneyClick} />}
      </AnimatePresence>
    </main>
  );
};

export default HappyNewYear;
