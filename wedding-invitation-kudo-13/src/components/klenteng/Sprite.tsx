/**
 * Pustaka simbol SVG Gerbang Rembulan — dirender SEKALI di InvitationShell, lalu dipakai lewat
 * <use href="#kl-…">. Port dari undangan-klenteng.html (klenteng, gunung karst, awan xiangyun,
 * bunga mei, ranting, lampion, sudut meander, pemisah).
 */
export function Sprite() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        <linearGradient id="kl-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F3E1AE" />
          <stop offset=".5" stopColor="#C9A24B" />
          <stop offset="1" stopColor="#8E6C25" />
        </linearGradient>
        <linearGradient id="kl-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4A1A12" />
          <stop offset="1" stopColor="#220806" />
        </linearGradient>
        <linearGradient id="kl-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B42222" />
          <stop offset="1" stopColor="#7A1010" />
        </linearGradient>
        <radialGradient id="kl-lantern-glow" cx=".4" cy=".4" r=".7">
          <stop offset="0" stopColor="#FF7A4A" />
          <stop offset=".55" stopColor="#D12A22" />
          <stop offset="1" stopColor="#7A0E0E" />
        </radialGradient>

        {/* Klenteng */}
        <symbol id="kl-temple" viewBox="0 0 400 240">
          <path d="M30 212 H370 V224 H30Z" fill="#7A6450" />
          <path d="M16 224 H384 V234 H16Z" fill="#4A3A2E" />
          <path d="M160 224 H240 V229 H160Z M168 229 H232 V234 H168Z" fill="#9A846C" />
          <rect x="58" y="134" width="284" height="78" fill="url(#kl-wall)" />
          <rect x="54" y="126" width="292" height="9" fill="#C9A24B" />
          <g fill="#E8C66A" opacity=".85">
            {[62, 88, 114, 140, 254, 280, 306, 332].map((x) => (
              <rect key={x} x={x} y="128" width="6" height="5" />
            ))}
          </g>
          <g fill="#5C0A0A">
            {[64, 122, 268, 326].map((x) => (
              <rect key={x} x={x} y="135" width="10" height="77" />
            ))}
          </g>
          <g fill="#C9A24B">
            {[62, 120, 266, 324].map((x) => (
              <g key={x}>
                <rect x={x} y="135" width="14" height="5" />
                <rect x={x} y="206" width="14" height="6" />
              </g>
            ))}
          </g>
          {[98, 302].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="174" r="15" fill="#3A0606" stroke="#C9A24B" strokeWidth="2" />
              <path d={`M${cx} 159 V189 M${cx - 15} 174 H${cx + 15} M${cx - 10} 164 L${cx + 10} 184 M${cx + 10} 164 L${cx - 10} 184`} stroke="#C9A24B" strokeWidth=".8" opacity=".8" />
            </g>
          ))}
          <path d="M170 212 V166 Q200 146 230 166 V212Z" fill="#2A0505" stroke="#C9A24B" strokeWidth="2.4" />
          <path d="M200 156 V212" stroke="#C9A24B" strokeWidth="1.2" />
          <g fill="#E8C66A">
            {[176, 188, 200].map((cy) => (
              <g key={cy}>
                <circle cx="186" cy={cy} r="1.8" />
                <circle cx="214" cy={cy} r="1.8" />
              </g>
            ))}
          </g>
          <ellipse cx="200" cy="196" rx="22" ry="14" fill="#FFB060" opacity=".14" />
          <rect x="182" y="138" width="36" height="13" rx="2" fill="#C9A24B" />
          <path d="M188 144.5 H212" stroke="#6E0F0F" strokeWidth="2.5" strokeDasharray="4 3" />
          {/* atap bawah dengan ujung melengkung */}
          <path d="M2 98 Q30 126 66 126 H334 Q370 126 398 98 Q378 110 344 106 L306 88 H94 L56 106 Q22 110 2 98Z" fill="url(#kl-roof)" stroke="#C9A24B" strokeWidth="1.8" />
          <path d="M40 112 H360 M66 100 H334 M84 93 H316" stroke="#C9A24B" strokeWidth=".6" opacity=".45" />
          <rect x="112" y="70" width="176" height="20" fill="url(#kl-wall)" />
          <rect x="112" y="70" width="176" height="3" fill="#C9A24B" />
          <rect x="112" y="87" width="176" height="3" fill="#C9A24B" />
          <path d="M126 76 h8 v8 h-8 v-5 h5 M266 76 h8 v8 h-8 v-5 h5" fill="none" stroke="#EDD9A0" strokeWidth="1" />
          {/* atap atas */}
          <path d="M84 66 Q108 88 134 88 H266 Q292 88 316 66 Q300 76 274 74 L252 54 H148 L126 74 Q100 76 84 66Z" fill="url(#kl-roof)" stroke="#C9A24B" strokeWidth="1.8" />
          <path d="M118 80 H282 M136 70 H264 M146 61 H254" stroke="#C9A24B" strokeWidth=".6" opacity=".45" />
          {/* bubungan ekor walet, mutiara & api */}
          <path d="M140 54 H260 V47 H140Z" fill="#C9A24B" />
          <path d="M142 51 Q124 50 112 28 Q128 42 150 46Z" fill="#E8C66A" />
          <path d="M258 51 Q276 50 288 28 Q272 42 250 46Z" fill="#E8C66A" />
          <circle cx="200" cy="38" r="7" fill="#F3E1AE" stroke="#A9842F" />
          <path d="M186 46 q-6 -8 0 -14 q0 6 6 8z M214 46 q6 -8 0 -14 q0 6 -6 8z" fill="#E8C66A" />
          {/* lampion di emper */}
          {[78, 322].map((cx) => (
            <g key={cx}>
              <path d={`M${cx} 124 V132`} stroke="#C9A24B" />
              <ellipse cx={cx} cy="140" rx="7" ry="9" fill="url(#kl-lantern-glow)" />
              <rect x={cx - 4} y="130" width="8" height="2.5" fill="#C9A24B" />
              <rect x={cx - 4} y="148" width="8" height="2.5" fill="#C9A24B" />
            </g>
          ))}
        </symbol>

        {/* Gunung karst */}
        <symbol id="kl-mountains" viewBox="0 0 460 230" preserveAspectRatio="none">
          <path d="M0 230 V150 Q20 90 46 110 Q64 40 92 70 Q110 120 130 126 Q150 60 178 50 Q200 46 210 90 Q230 150 250 120 Q270 30 300 40 Q324 52 330 110 Q350 70 380 80 Q410 96 420 60 Q440 40 460 90 V230Z" fill="#6E1A14" opacity=".55" />
          <path d="M0 230 V176 Q40 130 70 150 Q100 100 130 140 Q160 170 190 150 Q220 120 250 150 Q280 110 310 140 Q350 170 380 140 Q420 120 460 160 V230Z" fill="#4A0909" opacity=".85" />
        </symbol>

        {/* Awan xiangyun */}
        <symbol id="kl-cloud" viewBox="0 0 150 40">
          <g fill="none" stroke="#EDD9A0" strokeWidth="2" strokeLinecap="round">
            <path d="M6 34 C4 18 26 12 34 24 C38 32 28 36 24 30 C21 25 27 22 30 26" />
            <path d="M34 24 C38 6 70 4 74 22 C76 32 62 34 60 26 C59 20 66 18 68 23" />
            <path d="M74 22 C82 10 106 12 108 26 C109 34 98 36 96 30 C95 25 101 23 103 27" />
            <path d="M108 26 C116 20 132 22 140 34 M6 34 H140" />
          </g>
        </symbol>

        {/* Bunga mei (梅花) */}
        <symbol id="kl-mei" viewBox="-10 -10 20 20">
          <g fill="#F7C4C9" stroke="#D9788A" strokeWidth=".5">
            {[0, 72, 144, 216, 288].map((deg) => (
              <circle key={deg} cx="0" cy="-5" r="3.8" transform={`rotate(${deg})`} />
            ))}
          </g>
          <circle r="2.2" fill="#C2302A" />
          <g fill="#E8C66A">
            <circle cx="0" cy="-3.4" r=".7" />
            <circle cx="3.2" cy="-1" r=".7" />
            <circle cx="2" cy="2.8" r=".7" />
            <circle cx="-2" cy="2.8" r=".7" />
            <circle cx="-3.2" cy="-1" r=".7" />
          </g>
        </symbol>
        <symbol id="kl-mei-red" viewBox="-10 -10 20 20">
          <g fill="#C2302A" stroke="#7A1010" strokeWidth=".5">
            {[0, 72, 144, 216, 288].map((deg) => (
              <circle key={deg} cx="0" cy="-5" r="3.8" transform={`rotate(${deg})`} />
            ))}
          </g>
          <circle r="2" fill="#EDD9A0" />
        </symbol>
        <symbol id="kl-petal" viewBox="0 0 20 20">
          <path d="M10 2 C16 4 18 12 10 18 C2 12 4 4 10 2Z" fill="#F7C4C9" stroke="#D9788A" strokeWidth=".6" />
        </symbol>

        {/* Ranting mei */}
        <symbol id="kl-branch" viewBox="0 0 120 90">
          <path d="M4 86 C30 70 48 60 70 40 C84 28 96 22 116 18 M48 60 C54 48 54 36 62 26 M78 34 C86 40 96 42 106 40" fill="none" stroke="#3A1410" strokeWidth="3" strokeLinecap="round" />
          <use href="#kl-mei" x="56" y="16" width="18" height="18" />
          <use href="#kl-mei" x="100" y="8" width="18" height="18" />
          <use href="#kl-mei" x="66" y="30" width="14" height="14" />
          <use href="#kl-mei" x="98" y="32" width="15" height="15" />
          <use href="#kl-mei" x="30" y="58" width="16" height="16" />
          <use href="#kl-mei-red" x="80" y="22" width="12" height="12" />
        </symbol>

        {/* Lampion */}
        <symbol id="kl-lantern" viewBox="0 0 30 48">
          <rect x="9" y="0" width="12" height="4" rx="1" fill="#C9A24B" />
          <ellipse cx="15" cy="17" rx="13" ry="13" fill="url(#kl-lantern-glow)" />
          <g fill="none" stroke="#7A0E0E" strokeWidth=".8" opacity=".7">
            <path d="M15 4 V30" />
            <path d="M15 4 C6 10 6 24 15 30" />
            <path d="M15 4 C24 10 24 24 15 30" />
          </g>
          <rect x="9" y="29" width="12" height="4" rx="1" fill="#C9A24B" />
          <path d="M12 33 V46 M15 33 V48 M18 33 V46" stroke="#E8C66A" strokeWidth="1" />
        </symbol>

        {/* Sudut meander */}
        <symbol id="kl-corner" viewBox="0 0 64 64">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
            <path d="M4 60 V4 H60" />
            <path d="M12 52 V12 H52" />
            <path d="M20 44 V20 H44 V34 H30 V28 H38" />
          </g>
          <circle cx="60" cy="4" r="2" fill="currentColor" />
          <circle cx="4" cy="60" r="2" fill="currentColor" />
        </symbol>

        {/* Pemisah koin */}
        <symbol id="kl-divider" viewBox="0 0 180 22">
          <path d="M4 11 H70 M110 11 H176" fill="none" stroke="currentColor" strokeWidth="1" />
          <g fill="currentColor">
            <circle cx="4" cy="11" r="2" />
            <circle cx="176" cy="11" r="2" />
          </g>
          <circle cx="90" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <rect x="86" y="7" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M74 11 h4 v-4 h4 M106 11 h-4 v4 h-4" fill="none" stroke="currentColor" strokeWidth="1" />
        </symbol>
      </defs>
    </svg>
  );
}
