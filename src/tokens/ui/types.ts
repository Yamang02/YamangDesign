/**
 * E04: 앱 셸 토큰 타입 (--shell-* CSS 변수와 대응)
 * 테마와 무관하게 고정된 스타일 (헤더, 설정패널, Lab 크롬 등)
 */
export interface UITokenColors {
  bg: {
    base: string;
    surface: string;
    elevated: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  border: {
    default: string;
    subtle: string;
  };
  action: {
    primary: string;
    hover: string;
  };
  focus: {
    ring: string;
  };
}

export interface UITokens {
  colors: UITokenColors;
}
