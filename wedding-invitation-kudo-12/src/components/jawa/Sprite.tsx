/**
 * Pustaka simbol SVG Ronce Melati — dirender SEKALI di InvitationShell, lalu dipakai lewat
 * <use href="#rm-…">. Semua bentuk orisinal (gunungan, joglo, gunung, melati, sulur, pemisah).
 */
export function Sprite() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        <linearGradient id="rm-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F1E2B4" />
          <stop offset=".5" stopColor="#CEAC59" />
          <stop offset="1" stopColor="#8F6F2C" />
        </linearGradient>
        <linearGradient id="rm-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#44301F" />
          <stop offset="1" stopColor="#251810" />
        </linearGradient>

        {/* Gunungan wayang */}
        <symbol id="rm-gunungan" viewBox="0 0 200 300">
          <path d="M100 4 C118 46 168 104 184 176 C192 214 186 250 172 282 L28 282 C14 250 8 214 16 176 C32 104 82 46 100 4Z" fill="url(#rm-gold)" stroke="#4E3421" strokeWidth="2" />
          <path d="M100 18 C116 56 158 108 172 176 C178 210 174 242 162 270 L38 270 C26 242 22 210 28 176 C42 108 84 56 100 18Z" fill="none" stroke="#4E3421" strokeWidth="1.2" opacity=".7" />
          <g fill="none" stroke="#3A2618" strokeWidth="2.2" strokeLinecap="round">
            <path d="M100 222 V42" />
            <path d="M100 80 C88 70 76 74 72 86 C70 96 80 100 86 94" />
            <path d="M100 80 C112 70 124 74 128 86 C130 96 120 100 114 94" />
            <path d="M100 116 C82 100 60 108 56 126 C54 140 70 146 78 136" />
            <path d="M100 116 C118 100 140 108 144 126 C146 140 130 146 122 136" />
            <path d="M100 156 C78 138 46 146 40 170 C38 186 58 192 66 180" />
            <path d="M100 156 C122 138 154 146 160 170 C162 186 142 192 134 180" />
            <path d="M100 194 C84 182 62 186 58 200" />
            <path d="M100 194 C116 182 138 186 142 200" />
          </g>
          <g fill="#3A2618">
            <circle cx="100" cy="60" r="4" />
            <circle cx="66" cy="112" r="3" />
            <circle cx="134" cy="112" r="3" />
            <circle cx="50" cy="156" r="3" />
            <circle cx="150" cy="156" r="3" />
          </g>
          {/* gapura */}
          <path d="M72 270 V236 Q72 218 100 214 Q128 218 128 236 V270Z" fill="#3A2618" />
          <path d="M84 270 V242 Q84 230 100 228 Q116 230 116 242 V270Z" fill="#CEAC59" opacity=".55" />
          <path d="M60 270 h80 v12 h-80z" fill="#4E3421" />
          <path d="M64 236 h10 v34 h-10z M126 236 h10 v34 h-10z" fill="#4E3421" />
        </symbol>

        {/* Rumah joglo */}
        <symbol id="rm-joglo" viewBox="0 0 400 230">
          <path d="M36 196 H364 V208 H36Z" fill="#3A2618" />
          <path d="M24 208 H376 V218 H24Z" fill="#2E1E12" />
          <path d="M160 208 H240 V214 H160Z M168 214 H232 V222 H168Z" fill="#4E3421" />
          <path d="M58 136 H342 V196 H58Z" fill="#251810" opacity=".85" />
          <g fill="url(#rm-gold)">
            <rect x="64" y="134" width="7" height="62" />
            <rect x="118" y="134" width="7" height="62" />
            <rect x="170" y="134" width="7" height="62" />
            <rect x="223" y="134" width="7" height="62" />
            <rect x="275" y="134" width="7" height="62" />
            <rect x="329" y="134" width="7" height="62" />
          </g>
          <path d="M200 136 V150" stroke="#CEAC59" strokeWidth="1" />
          <path d="M192 150 h16 l-4 10 h-8z" fill="#E9D6A0" />
          <circle cx="200" cy="164" r="10" fill="#E9D6A0" opacity=".18" />
          <path d="M10 138 L74 98 H326 L390 138Z" fill="url(#rm-roof)" stroke="#CEAC59" strokeWidth="1.6" />
          <path d="M74 98 L126 64 H274 L326 98Z" fill="url(#rm-roof)" stroke="#CEAC59" strokeWidth="1.6" />
          <path d="M126 64 L172 10 H228 L274 64Z" fill="url(#rm-roof)" stroke="#CEAC59" strokeWidth="1.6" />
          <g stroke="#CEAC59" strokeWidth=".6" opacity=".45">
            <path d="M30 126 H370 M50 113 H350 M66 104 H334" />
            <path d="M92 88 H308 M108 77 H292" />
            <path d="M140 48 H260 M152 34 H248 M163 21 H237" />
          </g>
          <path d="M10 138 H390" stroke="#CEAC59" strokeWidth="3" />
          <path d="M74 98 H326 M126 64 H274" stroke="#CEAC59" strokeWidth="2.2" />
          <path d="M172 10 H228" stroke="#E9D6A0" strokeWidth="3" />
          <path d="M166 12 q4 -12 10 -10 q-2 4 -4 10z M234 12 q-4 -12 -10 -10 q2 4 4 10z" fill="#E9D6A0" />
          <circle cx="200" cy="6" r="3" fill="#E9D6A0" />
          <g fill="#CEAC59" opacity=".9">
            <circle cx="200" cy="81" r="3" />
            <circle cx="200" cy="118" r="3.4" />
          </g>
        </symbol>

        {/* Pegunungan (Merapi & Merbabu) */}
        <symbol id="rm-mountains" viewBox="0 0 460 180" preserveAspectRatio="none">
          <path d="M0 180 V120 L60 92 L120 110 L190 40 L216 30 L240 38 L310 96 L360 80 L420 104 L460 96 V180Z" fill="#3A2618" opacity=".75" />
          <path d="M0 180 V140 L80 118 L150 130 L230 96 L300 126 L380 112 L460 132 V180Z" fill="#2E1E12" opacity=".9" />
          <path d="M206 34 q4 -6 10 -4 q6 2 4 -6 q6 0 6 6" fill="none" stroke="#E9D6A0" strokeWidth="1.2" opacity=".5" />
        </symbol>

        {/* Melati */}
        <symbol id="rm-melati" viewBox="-10 -10 20 20">
          <g fill="#FFFDF6" stroke="#E9D6A0" strokeWidth=".5">
            <ellipse cx="0" cy="-5" rx="2.8" ry="4.6" />
            <ellipse cx="0" cy="-5" rx="2.8" ry="4.6" transform="rotate(72)" />
            <ellipse cx="0" cy="-5" rx="2.8" ry="4.6" transform="rotate(144)" />
            <ellipse cx="0" cy="-5" rx="2.8" ry="4.6" transform="rotate(216)" />
            <ellipse cx="0" cy="-5" rx="2.8" ry="4.6" transform="rotate(288)" />
          </g>
          <circle r="1.8" fill="#E9D6A0" />
        </symbol>

        <symbol id="rm-melati-cluster" viewBox="0 0 80 80">
          <path d="M8 70 C24 54 40 46 70 40" fill="none" stroke="#3E5A3A" strokeWidth="2" />
          <path d="M30 56 c-6 -12 2 -20 12 -18 c-2 10 -6 16 -12 18z" fill="#3E5A3A" />
          <path d="M50 46 c4 -12 16 -12 20 -4 c-8 6 -14 6 -20 4z" fill="#4E6E48" />
          <use href="#rm-melati" x="2" y="54" width="22" height="22" />
          <use href="#rm-melati" x="20" y="38" width="18" height="18" />
          <use href="#rm-melati" x="56" y="28" width="20" height="20" />
          <use href="#rm-melati" x="38" y="50" width="14" height="14" />
          <circle cx="66" cy="54" r="3.5" fill="#FFFDF6" stroke="#E9D6A0" strokeWidth=".6" />
        </symbol>

        {/* Sulur sudut */}
        <symbol id="rm-corner" viewBox="0 0 80 80">
          <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <path d="M4 4 H58" />
            <path d="M4 4 V58" />
            <path d="M10 10 H40" />
            <path d="M10 10 V40" />
            <path d="M10 10 C34 14 44 24 46 46 C40 36 30 32 22 36 C16 40 18 50 26 50" />
            <path d="M10 10 C14 34 24 44 46 46" />
          </g>
          <g fill="currentColor">
            <path d="M4 4 l6 -3 l-1 6z" />
            <circle cx="58" cy="4" r="2" />
            <circle cx="4" cy="58" r="2" />
            <circle cx="46" cy="46" r="2.6" />
          </g>
        </symbol>

        {/* Pemisah */}
        <symbol id="rm-divider" viewBox="0 0 180 22">
          <path d="M4 11 H70 M110 11 H176" fill="none" stroke="currentColor" strokeWidth="1" />
          <g fill="currentColor">
            <circle cx="4" cy="11" r="2" />
            <circle cx="176" cy="11" r="2" />
          </g>
          <g fill="none" stroke="currentColor" strokeWidth="1.2">
            <ellipse cx="84" cy="11" rx="8" ry="4.5" />
            <ellipse cx="96" cy="11" rx="8" ry="4.5" />
            <path d="M90 2 L95 11 L90 20 L85 11Z" fill="#D95B82" stroke="none" />
          </g>
        </symbol>
      </defs>
    </svg>
  );
}
