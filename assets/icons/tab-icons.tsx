import { COLORS } from "@/constants/theme";
import * as React from "react";
import { IconProps } from "./IconProps";
import Svg, { Path } from "react-native-svg";

export const HomeIcon: React.FC<IconProps> = ({
  size = 24,
  color = COLORS.PRIMARY_TEXT,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M.545 10.363A1.714 1.714 0 0 0 0 11.617v9.812A2.571 2.571 0 0 0 2.571 24h7.715v-5.143a1.714 1.714 0 1 1 3.428 0V24h7.715A2.571 2.571 0 0 0 24 21.429v-9.812c0-.476-.198-.93-.546-1.254L12.558.206a.857.857 0 0 0-1.116 0L.545 10.363Z"
      clipRule="evenodd"
    />
  </Svg>
);

export const CalendarIcon: React.FC<IconProps> = ({
  size = 24,
  color = COLORS.PRIMARY_TEXT,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M7.714 1.714a1.714 1.714 0 0 0-3.428 0V3.43H2.57A2.571 2.571 0 0 0 0 6v2.571h24V6a2.571 2.571 0 0 0-2.571-2.571h-1.714V1.714a1.714 1.714 0 1 0-3.43 0V3.43h-8.57V1.714Zm16.286 9H0V21.43A2.571 2.571 0 0 0 2.571 24H21.43A2.571 2.571 0 0 0 24 21.429V10.714Z"
      clipRule="evenodd"
    />
  </Svg>
);

export const GraphIcon: React.FC<IconProps> = ({
  size = 24,
  color = COLORS.PRIMARY_TEXT,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M2.571 1.286a1.286 1.286 0 0 0-2.571 0V22.714C0 23.424.576 24 1.286 24h21.428a1.286 1.286 0 0 0 0-2.571H2.571v-4.766l3.776-4.032a3.41 3.41 0 0 0 1.69.446 3.41 3.41 0 0 0 2.07-.696l2.44 2.276a3.433 3.433 0 1 0 5.806-1.217l.003-.01 1.987-5.455a3.426 3.426 0 1 0-2.463-.75l-1.854 5.09a3.417 3.417 0 0 0-1.81.383l-2.646-2.469a1.304 1.304 0 0 0-.139-.112 3.425 3.425 0 1 0-6.69.47 1.242 1.242 0 0 0-.05.05l-2.12 2.264V1.286Z"
      clipRule="evenodd"
    />
  </Svg>
);

export const TrophyIcon: React.FC<IconProps> = ({
  size = 24,
  color = COLORS.PRIMARY_TEXT,
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      fill={color}
      d="M24.5 4.667H21V3.5a1.167 1.167 0 0 0-1.167-1.167H8.167A1.167 1.167 0 0 0 7 3.5v1.167H3.5a1.167 1.167 0 0 0-1.167 1.166v3.5A4.666 4.666 0 0 0 7 14h1.797a7 7 0 0 0 4.036 2.228v2.439h-1.166a3.5 3.5 0 0 0-3.5 3.5V24.5a1.167 1.167 0 0 0 1.166 1.167h9.334a1.167 1.167 0 0 0 1.166-1.167v-2.333a3.5 3.5 0 0 0-3.5-3.5h-1.166v-2.439A7 7 0 0 0 19.203 14H21a4.666 4.666 0 0 0 4.667-4.667v-3.5A1.167 1.167 0 0 0 24.5 4.667Zm-17.5 7a2.333 2.333 0 0 1-2.333-2.334V7H7v2.333a7 7 0 0 0 .408 2.334H7ZM16.333 21a1.167 1.167 0 0 1 1.167 1.167v1.166h-7v-1.166A1.167 1.167 0 0 1 11.667 21h4.666Zm2.334-11.667a4.666 4.666 0 1 1-9.334 0V4.667h9.334v4.666Zm4.666 0A2.333 2.333 0 0 1 21 11.667h-.408A7.003 7.003 0 0 0 21 9.333V7h2.333v2.333Z"
    />
  </Svg>
);

export const SettingsIcon: React.FC<IconProps> = ({
  size = 24,
  color = COLORS.PRIMARY_TEXT,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M9.526 1.182L8.732 3.23 6 4.78 3.822 4.45a1.846 1.846 0 0 0-1.847.905l-.738 1.292a1.846 1.846 0 0 0 .148 2.086l1.384 1.717v3.102l-1.347 1.717a1.846 1.846 0 0 0-.148 2.086l.738 1.292a1.845 1.845 0 0 0 1.846.905l2.179-.332 2.695 1.55.794 2.05A1.845 1.845 0 0 0 11.243 24h1.55a1.845 1.845 0 0 0 1.718-1.181l.794-2.05L18 19.22l2.178.332a1.845 1.845 0 0 0 1.847-.905l.738-1.292a1.847 1.847 0 0 0-.148-2.086l-1.384-1.717v-3.102l1.347-1.717a1.847 1.847 0 0 0 .148-2.086l-.738-1.292a1.845 1.845 0 0 0-1.846-.905l-2.179.333-2.695-1.551-.794-2.05A1.846 1.846 0 0 0 12.757 0h-1.514a1.846 1.846 0 0 0-1.717 1.182ZM12 15.857a3.857 3.857 0 1 0 0-7.714 3.857 3.857 0 0 0 0 7.714Z"
      clipRule="evenodd"
    />
  </Svg>
);
