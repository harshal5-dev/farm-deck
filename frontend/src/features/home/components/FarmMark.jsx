const FarmMark = () => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-full"
    >
      <defs>
        <linearGradient
          id="lm-field"
          x1="6"
          y1="30"
          x2="42"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7FD66E" />
          <stop offset="100%" stopColor="#2E7D52" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="20" r="11" fill="#FFD56B" opacity="0.55" />
      <path
        d="M24 6 L36 17 L33 17 L33 28 L15 28 L15 17 L12 17 Z"
        fill="#C25A36"
      />
      <path d="M21 21 H27 V28 H21 Z" fill="#7A2E16" opacity="0.75" />
      <path
        d="M4 38 C 12 34, 20 34, 24 38 C 28 42, 36 42, 44 38 L44 44 L4 44 Z"
        fill="url(#lm-field)"
      />
      <path
        d="M24 30 L 24 24"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.95"
      />
    </svg>
  );
};

export default FarmMark;
