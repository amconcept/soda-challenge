import { cssVars } from "./cssVars";

/**
 * One SVG lockup (viewBox 300 110 1330 870). Path data matches
 * design/assets/SODA_logo_source.svg; timings match design/SPEC.md.
 */
export default function HeroLockup() {
  return (
    <svg
      className="hero-lockup"
      viewBox="300 110 1330 870"
      aria-labelledby="hero-title"
      role="img"
    >
      <title id="hero-title">SOD+A CHALLENGE</title>
      <g className="strokes">
        {/* S — 4 arcs, 0.85s each, 0.06s stagger from t=0.15 */}
        <g
          className="float-box float-a"
          style={cssVars({ "--float-dur": "6.4s", "--float-delay": "5.60s" })}
        >
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "0.15s" })}
            d="M540.5,385.93c23.26,16.21,38.5,43.16,38.5,73.59,0,49.43-40.22,89.65-89.65,89.65-36.31,0-67.65-21.7-81.73-52.81"
          />
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "0.21s" })}
            d="M542.5,213.3c-13.4-14.01-32.27-22.74-53.15-22.74-40.58,0-73.59,33.01-73.59,73.59s33.01,73.59,73.59,73.59h0c67.26,0,121.78,54.52,121.78,121.78s-54.52,121.78-121.78,121.78c-62.45,0-113.92-47-120.96-107.56"
          />
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "0.27s" })}
            d="M577.86,249.82c-6.88-42.65-43.95-75.32-88.51-75.32-49.43,0-89.65,40.22-89.65,89.65s40.22,89.65,89.65,89.65"
          />
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "0.33s" })}
            d="M589.08,194.23c-22.03-31.37-58.48-51.87-99.73-51.87-67.26,0-121.78,54.52-121.78,121.78s54.52,121.78,121.78,121.78h0c40.58,0,73.59,33.01,73.59,73.59s-33.01,73.59-73.59,73.59-73.59-33.01-73.59-73.59"
          />
        </g>

        {/* O — circle + 3 arcs from t=0.75 */}
        <g
          className="float-box float-b"
          style={cssVars({ "--float-dur": "7.6s", "--float-delay": "5.77s" })}
        >
          <circle
            data-w="main"
            pathLength="1"
            cx="743.66"
            cy="459.52"
            r="121.78"
            className="stroke-draw"
            style={cssVars({ "--delay": "0.75s" })}
          />
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "0.81s" })}
            d="M817.98,509.61c-16.13,23.85-43.42,39.56-74.32,39.56-43.25,0-79.45-30.79-87.83-71.61"
          />
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "0.87s" })}
            d="M661.07,424.66c13.63-32.17,45.52-54.79,82.6-54.79,49.43,0,89.65,40.22,89.65,89.65,0,3.94-.26,7.82-.75,11.63"
          />
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "0.93s" })}
            d="M743.66,533.1c-40.58,0-73.59-33.01-73.59-73.59s33.01-73.59,73.59-73.59,73.59,33.01,73.59,73.59-33.01,73.59-73.59,73.59Z"
          />
        </g>

        {/* D — 8 strokes from t=1.35 */}
        <g
          className="float-box float-c"
          style={cssVars({ "--float-dur": "6.9s", "--float-delay": "5.95s" })}
        >
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "1.35s" })}
            d="M1120.08,171.11v288.41"
          />
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "1.41s" })}
            d="M1120.08,459.52c0,67.26-54.52,121.78-121.78,121.78s-121.78-54.52-121.78-121.78,54.52-121.78,121.78-121.78c16.81,0,32.83,3.41,47.4,9.57"
          />
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "1.47s" })}
            d="M1104.06,315.31v144.2l-.08-.44"
          />
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "1.53s" })}
            d="M1060.01,373.73c-17.38-12.53-38.7-19.93-61.71-19.93-58.29,0-105.72,47.42-105.72,105.72s47.42,105.72,105.72,105.72c28.51,0,54.41-11.34,73.45-29.75"
          />
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "1.59s" })}
            d="M1071.75,535.49c19.89-19.23,32.27-46.18,32.27-75.97"
          />
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "1.65s" })}
            d="M946.29,511.53c13.32,13.32,31.72,21.58,52.01,21.58,40.58,0,73.59-33.01,73.59-73.59"
          />
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "1.71s" })}
            d="M998.3,385.93c-40.58,0-73.59,33.01-73.59,73.59,0,20.29,8.25,38.68,21.58,52.01"
          />
          <line
            data-w="main"
            pathLength="1"
            x1="1071.75"
            y1="229.37"
            x2="1072.03"
            y2="458.55"
            className="stroke-draw"
            style={cssVars({ "--delay": "1.77s" })}
          />
        </g>

        {/* + — stroke-width 7, 0.7s from t=1.95 */}
        <g
          className="float-box float-d"
          style={cssVars({ "--float-dur": "5.8s", "--float-delay": "6.10s" })}
        >
          <path
            pathLength="1"
            fill="none"
            strokeWidth="7"
            className="stroke-draw"
            style={cssVars({ "--d": "0.7s", "--delay": "1.95s" })}
            d="M1200.96,445.04h-15.02v-15.02c0-4.05-3.28-7.33-7.33-7.33h-14.3c-4.05,0-7.33,3.28-7.33,7.33v15.02h-15.02c-4.05,0-7.33,3.28-7.33,7.33v14.3c0,4.05,3.28,7.33,7.33,7.33h15.02v15.02c0,4.05,3.28,7.33,7.33,7.33h14.3c4.05,0,7.33-3.28,7.33-7.33v-15.02h15.02c4.05,0,7.33-3.28,7.33-7.33v-14.3c0-4.05-3.28-7.33-7.33-7.33Z"
          />
        </g>

        {/* A — 3 arcs from t=2.25 */}
        <g
          className="float-box float-a"
          style={cssVars({ "--float-dur": "7.1s", "--float-delay": "6.20s" })}
        >
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "2.25s" })}
            d="M1440.52,618.49l-.94-154.28c0-52.02-42.32-94.35-94.34-94.35s-94.34,42.32-94.34,94.35c0,32.51,16.53,61.24,41.63,78.21"
          />
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "2.31s" })}
            d="M1418.13,595.3l-.47-129.56c0-40.58-33.01-73.59-73.59-73.59s-73.59,33.01-73.59,73.59,33.01,73.59,73.59,73.59c15.32,0,29.56-4.71,41.36-12.75"
          />
          <path
            data-w="main"
            pathLength="1"
            className="stroke-draw"
            style={cssVars({ "--delay": "2.37s" })}
            d="M1396.87,575.51c-15.97,7.7-33.88,12.01-52.8,12.01-67.26,0-121.78-54.52-121.78-121.78s54.52-121.78,121.78-121.78,121.78,54.52,121.78,121.78l.66,35.6"
          />
        </g>

        {/* Separator dots */}
        <g fill="currentColor" strokeWidth="2" fillOpacity={0}>
          <circle
            pathLength="1"
            cx="614.55"
            cy="560.03"
            r="15.87"
            className="dot float-c"
            style={cssVars({
              "--delay": "2.9s",
              "--fill-delay": "3.2s",
              "--float-dur": "5.4s",
              "--float-delay": "6.29s",
            })}
          />
          <circle
            pathLength="1"
            cx="865.45"
            cy="560.03"
            r="15.87"
            className="dot float-b"
            style={cssVars({
              "--delay": "2.98s",
              "--fill-delay": "3.28s",
              "--float-dur": "6.2s",
              "--float-delay": "6.31s",
            })}
          />
          <circle
            pathLength="1"
            cx="1515.24"
            cy="560.03"
            r="15.87"
            className="dot float-d"
            style={cssVars({
              "--delay": "3.06s",
              "--fill-delay": "3.36s",
              "--float-dur": "5.9s",
              "--float-delay": "6.34s",
            })}
          />
        </g>

        {/* Press-fit mark — hidden by default via [data-show-mark=false] */}
        <g data-crate="1" strokeWidth="4" className="hover-3d">
          <g className="origin-bottom seat">
            <g data-piece="base" className="origin-bottom fit-base">
              <polygon
                pathLength="1"
                className="stroke-draw"
                style={cssVars({ "--d": "0.7s", "--delay": "3.15s" })}
                points="1562.85 922.23 1573.63 819.2 1515 813.07 1509.39 866.76 1495.52 865.31 1501.14 811.62 1442.51 805.48 1431.73 908.51 1562.85 922.23"
              />
              <polyline
                pathLength="1"
                className="stroke-draw"
                style={cssVars({ "--d": "0.5s", "--delay": "3.35s" })}
                points="1515 813.07 1508.28 818.61 1502.92 866.46"
              />
              <polyline
                pathLength="1"
                className="stroke-draw"
                style={cssVars({ "--d": "0.5s", "--delay": "3.4s" })}
                points="1441.98 805.07 1435.33 809.91 1425.11 910.98 1431.73 908.51"
              />
              <line
                pathLength="1"
                x1="1555.47"
                y1="924.97"
                x2="1562.09"
                y2="922.5"
                className="stroke-draw"
                style={cssVars({ "--d": "0.5s", "--delay": "3.45s" })}
              />
              <line
                pathLength="1"
                x1="1555.47"
                y1="924.97"
                x2="1425.11"
                y2="910.98"
                className="stroke-draw"
                style={cssVars({ "--d": "0.5s", "--delay": "3.5s" })}
              />
            </g>
          </g>
          <g data-piece="tab" className="origin-bottom fit-tab">
            <line
              pathLength="1"
              x1="1505.01"
              y1="798.88"
              x2="1499.34"
              y2="755.41"
              className="stroke-draw"
              style={cssVars({ "--d": "0.5s", "--delay": "3.55s" })}
            />
            <line
              pathLength="1"
              x1="1494.14"
              y1="795.56"
              x2="1488.47"
              y2="752.09"
              className="stroke-draw"
              style={cssVars({ "--d": "0.5s", "--delay": "3.6s" })}
            />
            <line
              pathLength="1"
              x1="1494.2"
              y1="795.34"
              x2="1464.84"
              y2="784.82"
              className="stroke-draw"
              style={cssVars({ "--d": "0.5s", "--delay": "3.65s" })}
            />
            <polyline
              pathLength="1"
              className="stroke-draw"
              style={cssVars({ "--d": "0.6s", "--delay": "3.7s" })}
              points="1465.29 785.17 1451.77 681.43 1524.27 704.21 1537.79 807.95 1505.12 798.5"
            />
            <line
              pathLength="1"
              x1="1494.2"
              y1="795.34"
              x2="1504.06"
              y2="791.59"
              className="stroke-draw"
              style={cssVars({ "--d": "0.5s", "--delay": "3.75s" })}
            />
            <polyline
              pathLength="1"
              className="stroke-draw"
              style={cssVars({ "--d": "0.5s", "--delay": "3.8s" })}
              points="1538.37 808.1 1550.59 803.59 1537.11 700.12"
            />
            <line
              pathLength="1"
              x1="1524"
              y1="704"
              x2="1537.11"
              y2="700.12"
              className="stroke-draw"
              style={cssVars({ "--d": "0.5s", "--delay": "3.85s" })}
            />
            <polyline
              pathLength="1"
              className="stroke-draw"
              style={cssVars({ "--d": "0.5s", "--delay": "3.9s" })}
              points="1452.34 681.39 1465.45 677.51 1537.01 700.21"
            />
            <line
              pathLength="1"
              x1="1499.34"
              y1="755.41"
              x2="1488.47"
              y2="752.09"
              className="stroke-draw"
              style={cssVars({ "--d": "0.5s", "--delay": "3.95s" })}
            />
          </g>
        </g>

        {/* CHALLENGE wordmark — 9 glyphs, 0.6s draw + 0.45s fill, 0.07s stagger from t=3.50 */}
        <g fill="currentColor" strokeWidth="1.6" fillOpacity={0}>
          <path
            pathLength="1"
            className="glyph float-a"
            style={cssVars({
              "--delay": "3.5s",
              "--fill-delay": "3.95s",
              "--float-dur": "6.6s",
              "--float-delay": "6.57s",
            })}
            d="M376.43,706.76c0-39.64,31.37-69.47,69.47-69.47,19.44,0,35.6,7.7,47.53,20.02,1.35,1.35.96,2.69,0,3.85l-15.4,16.36c-1.16,1.35-2.69,1.35-4.04.38-7.51-6.54-16.74-10.78-27.91-10.78-22.13,0-38.87,16.74-38.87,39.64s16.74,39.45,38.87,39.45c11.16,0,20.4-4.23,27.91-10.78,1.35-.96,2.89-.96,4.04.38l15.4,16.36c.96,1.15,1.35,2.5,0,3.85-11.93,12.32-28.1,20.01-47.53,20.01-38.1,0-69.47-29.64-69.47-69.28Z"
          />
          <path
            pathLength="1"
            className="glyph float-c"
            style={cssVars({
              "--delay": "3.57s",
              "--fill-delay": "4.02s",
              "--float-dur": "7.3s",
              "--float-delay": "6.59s",
            })}
            d="M514.8,770.66v-128.94c0-1.73,1.16-2.89,2.89-2.89h24.63c1.73,0,2.89,1.15,2.89,2.89v52.35h46.19v-52.35c0-1.73,1.16-2.89,2.89-2.89h24.63c1.73,0,3.08,1.15,3.08,2.89v128.94c0,1.73-1.35,2.89-3.08,2.89h-24.63c-1.73,0-2.89-1.16-2.89-2.89v-49.65h-46.19v49.65c0,1.73-1.16,2.89-2.89,2.89h-24.63c-1.73,0-2.89-1.16-2.89-2.89Z"
          />
          <path
            pathLength="1"
            className="glyph float-b"
            style={cssVars({
              "--delay": "3.64s",
              "--fill-delay": "4.09s",
              "--float-dur": "6.1s",
              "--float-delay": "6.62s",
            })}
            d="M639.51,770.27l44.65-129.13c.58-1.54,2.12-2.31,3.66-2.31h26.17c1.54,0,3.08.77,3.66,2.31l44.65,129.13c.77,1.93-.19,3.27-2.31,3.27h-25.79c-1.54,0-2.69-.58-3.27-2.31l-5.77-18.09h-48.5l-5.77,18.09c-.58,1.73-1.73,2.31-3.27,2.31h-25.6c-2.12,0-3.27-1.35-2.5-3.27ZM716.48,726.2l-15.59-48.69-15.59,48.69h31.18Z"
          />
          <path
            pathLength="1"
            className="glyph float-d"
            style={cssVars({
              "--delay": "3.71s",
              "--fill-delay": "4.16s",
              "--float-dur": "6.8s",
              "--float-delay": "6.65s",
            })}
            d="M780,770.66v-128.94c0-1.73,1.16-2.89,2.89-2.89h24.63c1.73,0,2.89,1.15,2.89,2.89v104.88h39.26c1.73,0,2.89,1.15,2.89,2.89v21.17c0,1.73-1.16,2.89-2.89,2.89h-66.78c-1.73,0-2.89-1.16-2.89-2.89Z"
          />
          <path
            pathLength="1"
            className="glyph float-a"
            style={cssVars({
              "--delay": "3.78s",
              "--fill-delay": "4.23s",
              "--float-dur": "5.7s",
              "--float-delay": "6.68s",
            })}
            d="M872.18,770.66v-128.94c0-1.73,1.16-2.89,2.89-2.89h24.63c1.73,0,2.89,1.15,2.89,2.89v104.88h39.26c1.73,0,2.89,1.15,2.89,2.89v21.17c0,1.73-1.16,2.89-2.89,2.89h-66.78c-1.73,0-2.89-1.16-2.89-2.89Z"
          />
          <path
            pathLength="1"
            className="glyph float-c"
            style={cssVars({
              "--delay": "3.85s",
              "--fill-delay": "4.3s",
              "--float-dur": "7.7s",
              "--float-delay": "6.71s",
            })}
            d="M964.36,770.66v-128.94c0-1.73,1.16-2.89,2.89-2.89h69.47c1.73,0,2.89,1.15,2.89,2.89v21.17c0,1.73-1.16,2.89-2.89,2.89h-41.95v26.37h39.45c1.73,0,2.89,1.15,2.89,2.89v21.17c0,1.73-1.15,2.89-2.89,2.89h-39.45v27.52h41.76c1.73,0,3.08,1.15,3.08,2.89v21.17c0,1.73-1.35,2.89-3.08,2.89h-69.28c-1.73,0-2.89-1.16-2.89-2.89Z"
          />
          <path
            pathLength="1"
            className="glyph float-b"
            style={cssVars({
              "--delay": "3.92s",
              "--fill-delay": "4.37s",
              "--float-dur": "6.4s",
              "--float-delay": "6.73s",
            })}
            d="M1137.95,771.62l-44.65-83.33v82.37c0,1.73-1.16,2.89-2.89,2.89h-24.63c-1.73,0-2.89-1.16-2.89-2.89v-128.94c0-1.73,1.16-2.89,2.89-2.89h28.67c1.54,0,2.69.58,3.46,1.92l44.65,83.33v-82.37c0-1.73,1.16-2.89,2.89-2.89h24.63c1.73,0,2.89,1.15,2.89,2.89v128.94c0,1.73-1.16,2.89-2.89,2.89h-28.67c-1.54,0-2.69-.58-3.46-1.92Z"
          />
          <path
            pathLength="1"
            className="glyph float-d"
            style={cssVars({
              "--delay": "3.99s",
              "--fill-delay": "4.44s",
              "--float-dur": "7s",
              "--float-delay": "6.76s",
            })}
            d="M1194.54,706.76c0-39.64,31.18-69.47,69.28-69.47,19.63,0,35.6,7.31,47.15,19.25,1.54,1.73,1.54,3.46-.19,5.39l-14.24,15.2c-1.54,1.73-3.08,1.73-4.62.58-7.31-6.35-16.55-10.59-27.91-10.59-21.94,0-38.68,16.74-38.68,39.64s16.74,39.45,40.22,39.45c19.44,0,30.6-10.97,31.37-23.67h-31.75c-1.73,0-2.89-1.35-2.89-3.08v-20.98c0-1.73,1.16-2.89,2.89-2.89h58.31c1.73,0,2.89,1.16,2.89,2.89v13.86c0,35.03-23.29,63.7-61.78,63.7s-70.05-29.64-70.05-69.28Z"
          />
          <path
            pathLength="1"
            className="glyph float-a"
            style={cssVars({
              "--delay": "4.06s",
              "--fill-delay": "4.51s",
              "--float-dur": "6.9s",
              "--float-delay": "6.79s",
            })}
            d="M1346,770.66v-128.94c0-1.73,1.16-2.89,2.89-2.89h69.47c1.73,0,2.89,1.15,2.89,2.89v21.17c0,1.73-1.16,2.89-2.89,2.89h-41.95v26.37h39.45c1.73,0,2.89,1.15,2.89,2.89v21.17c0,1.73-1.16,2.89-2.89,2.89h-39.45v27.52h41.76c1.73,0,3.08,1.15,3.08,2.89v21.17c0,1.73-1.35,2.89-3.08,2.89h-69.28c-1.73,0-2.89-1.16-2.89-2.89Z"
          />
        </g>

        {/* CAD construction layer — dashed radii, dash-dot axes, 29px centre marks */}
        <g
          data-schematic="1"
          strokeWidth="1.3"
          strokeLinecap="butt"
          style={{ opacity: 0.5 }}
        >
          <circle
            pathLength="1"
            cx="489.35"
            cy="264.15"
            r="145"
            fill="none"
            strokeDasharray="9 7"
            className="fade-in"
            style={cssVars({ "--delay": "0.25s" })}
          />
          <circle
            pathLength="1"
            cx="489.35"
            cy="459.52"
            r="145"
            fill="none"
            strokeDasharray="9 7"
            className="fade-in"
            style={cssVars({ "--delay": "0.4s" })}
          />
          <circle
            pathLength="1"
            cx="743.66"
            cy="459.52"
            r="145"
            fill="none"
            strokeDasharray="9 7"
            className="fade-in"
            style={cssVars({ "--delay": "0.85s" })}
          />
          <circle
            pathLength="1"
            cx="998.30"
            cy="459.52"
            r="145"
            fill="none"
            strokeDasharray="9 7"
            className="fade-in"
            style={cssVars({ "--delay": "1.45s" })}
          />
          <circle
            pathLength="1"
            cx="1344.50"
            cy="465.70"
            r="145"
            fill="none"
            strokeDasharray="9 7"
            className="fade-in"
            style={cssVars({ "--delay": "2.35s" })}
          />
          <line
            x1="330"
            y1="459.52"
            x2="1500"
            y2="459.52"
            strokeDasharray="26 8 6 8"
            className="fade-in"
            style={cssVars({ "--d": "0.9s", "--delay": "0.15s" })}
          />
          <line
            x1="489.35"
            y1="96"
            x2="489.35"
            y2="640"
            strokeDasharray="26 8 6 8"
            className="fade-in"
            style={cssVars({ "--d": "0.9s", "--delay": "0.45s" })}
          />
          <line
            x1="1344.5"
            y1="290"
            x2="1344.5"
            y2="660"
            strokeDasharray="26 8 6 8"
            className="fade-in"
            style={cssVars({ "--d": "0.9s", "--delay": "2.4s" })}
          />
          <line
            x1="998.30"
            y1="140"
            x2="998.30"
            y2="640"
            strokeDasharray="26 8 6 8"
            className="fade-in"
            style={cssVars({ "--d": "0.9s", "--delay": "1.5s" })}
          />
          <g className="fade-in" style={cssVars({ "--d": "0.6s", "--delay": "1.0s" })}>
            <line pathLength="1" x1="475" y1="264.15" x2="504" y2="264.15" />
            <line pathLength="1" x1="489.35" y1="249.8" x2="489.35" y2="278.5" />
            <line pathLength="1" x1="984" y1="459.52" x2="1013" y2="459.52" />
            <line pathLength="1" x1="998.3" y1="445.2" x2="998.3" y2="473.9" />
            <line pathLength="1" x1="1330" y1="465.7" x2="1359" y2="465.7" />
            <line pathLength="1" x1="1344.5" y1="451.4" x2="1344.5" y2="480" />
          </g>
          <line
            pathLength="1"
            x1="727"
            y1="459.52"
            x2="760"
            y2="459.52"
            className="stroke-draw"
            style={cssVars({ "--d": "0.3s", "--ease": "ease-out", "--delay": "0.95s" })}
          />
          <line
            pathLength="1"
            x1="743.66"
            y1="443"
            x2="743.66"
            y2="476"
            className="stroke-draw"
            style={cssVars({ "--d": "0.3s", "--ease": "ease-out", "--delay": "1.0s" })}
          />
        </g>
      </g>
    </svg>
  );
}
