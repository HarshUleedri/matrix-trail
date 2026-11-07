// import { useEffect, useRef, useState } from "react";

// export default function MatrixTrail() {
//   const characters = [
//     ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
//     ..."abcdefghijklmnopqrstuvwxyz",
//     ..."0123456789",
//     ..."!@#$%^&*()-_=+[]{}|;:'\",.<>?/`~\\",
//   ];

//   const [boxCount, setBoxCount] = useState<number>(0);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const cantainer = containerRef.current;
//     if (!cantainer) return;
//     const observer = new ResizeObserver(([entry]) => {
//       const width = entry.contentRect.width;
//       setBoxCount(Math.floor(width / 2));
//     });
//     observer.observe(cantainer);

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div ref={containerRef} className="h-screen w-full flex flex-col ">
//       {Array.from({ length: boxCount }).map((_, idx) => (
//         <div key={idx} className=" size-[10px] leading-0 text-neutral-200 ">
//           k
//         </div>
//       ))}
//     </div>
//   );
// }

// // import { useEffect, useRef, useState } from "react";

// // function App() {
// //   const containerRef = useRef<HTMLDivElement>(null);
// //   const [boxCount, setBoxCount] = useState(0);

// //   useEffect(() => {
// //     const container = containerRef.current;
// //     if (!container) return;

// //     const observer = new ResizeObserver(([entry]) => {
// //       const width = entry.contentRect.width;
// //       setBoxCount(Math.floor(width / 20));
// //     });

// //     observer.observe(container);

// //     return () => observer.disconnect();
// //   }, []);

// //   return (
// //     <div ref={containerRef} className="w-full">
// //       <div className="w-[2px] h-[2px] bg-amber-500" />
// //       <div className="flex flex-wrap">
// //         {Array.from({ length: boxCount }, (_, i) => (
// //           <div key={i} className="w-[2px] h-[2px] bg-amber-500" />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // export default App;

import { useEffect, useRef, useState } from "react";

interface GridBoxProps {
  mouse: { x: number; y: number };
  valueRadius: number;
  color: "sky" | "pink" | "purple";
}

interface ControlerType {
  setColor: (data: "sky" | "pink" | "purple") => void;
  setValueRadius: (data: number) => void;
  valueRadius: number;
}

function Controler({ setColor, setValueRadius, valueRadius }: ControlerType) {
  return (
    <div className="border inset-shadow-2xs shadow-white bg-neutral-900 flex flex-col gap-4 border-neutral-700 rounded-xl p-4 ">
      <div>
        <p className="font-mono mb-2 text-neutral-500 leading-4">radius</p>
        <input
          min={20}
          max={100}
          value={valueRadius}
          onChange={(e) => setValueRadius(+e.target.value)}
          type="range"
        />
      </div>
      <div>
        <p className="font-mono leading-4 mb-2 text-neutral-500">Color</p>
        <div className="flex gap-4  items-center">
          <span
            onClick={() => setColor("sky")}
            className="size-5 rounded-full bg-sky-500"
          ></span>
          <span
            onClick={() => setColor("pink")}
            className="size-5 rounded-full bg-pink-500"
          ></span>

          <span
            onClick={() => setColor("purple")}
            className="size-5 rounded-full bg-purple-500"
          ></span>
        </div>
      </div>
    </div>
  );
}

const characters = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  ..."abcdefghijklmnopqrstuvwxyz",
  ..."0123456789",
  ..."!@#$%^&*()-_=+[]{}|;:'\",.<>?/`~\\",
  ..."                                                                          ",
];
// const randomNumber = () => Math.floor(Math.random() * 175);
const randomNumber = () => Math.floor(Math.random() * characters.length);
function GridBox({ mouse, color, valueRadius }: GridBoxProps) {
  const [character, setCharacter] = useState(randomNumber);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const radius = valueRadius;

  // 1. Get the box position
  const rect = boxRef.current?.getBoundingClientRect();

  let isActive = false;

  if (rect) {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = Math.hypot(mouse.x - centerX, mouse.y - centerY);

    isActive = distance < radius;
  }
  const handleMouseEnter = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setCharacter(randomNumber());
    }, 200);
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setCharacter(randomNumber());
      }, 200);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive]);

  return (
    <div
      ref={boxRef}
      // onMouseOver={() => (isActive = false)}
      onMouseMove={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`text-[10px] transition-all duration-100   ease-in-out text-neutral-800 ${isActive && `text-${color}-500`} `}
    >
      {characters[character]}
    </div>
  );
}

export default function MatrixTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState<"sky" | "pink" | "purple">("sky");
  const [valueRadius, setValueRadius] = useState(50);

  const [mouse, setMouse] = useState({
    x: -1000,
    y: -1000,
  });

  const [dimensions, setDimensions] = useState({
    columns: 0,
    rows: 0,
    boxSize: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;

      const boxSize = 13;

      const columns = Math.ceil(width / boxSize);
      const rows = Math.ceil(height / boxSize);

      setDimensions({ columns, rows, boxSize });
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => {
        setMouse({
          x: e.clientX,
          y: e.clientY,
        });
      }}
      onMouseLeave={() => {
        setMouse({ x: -1000, y: -1000 });
      }}
      className="w-full h-screen bg-neutral-950 overflow-hidden"
    >
      <div className="fixed top-20 right-20 ">
        <Controler
          setColor={setColor}
          setValueRadius={setValueRadius}
          valueRadius={valueRadius}
        />
      </div>
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${dimensions.columns}, ${dimensions.boxSize}px)`,
          gridAutoRows: `${dimensions.boxSize}px`,
        }}
      >
        {Array.from(
          { length: dimensions.columns * dimensions.rows },
          (_, i) => {
            return (
              // <div className=" text-[10px] leading-2 overflow-hidden text-neutral-600   text- font-medium  hover:text-sky-500">
              //   {characters[randomNumber()]}
              // </div>
              <GridBox
                color={color}
                valueRadius={valueRadius}
                key={i}
                mouse={mouse}
              />
            );
          },
        )}
      </div>
    </div>
  );
}
