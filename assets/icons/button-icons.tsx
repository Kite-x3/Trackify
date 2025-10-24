import { COLORS } from "@/constants/theme";
import * as React from "react";
import { IconProps } from "./IconProps";
import Svg, { Path } from "react-native-svg";

export const CheckIcon: React.FC<IconProps> = ({
  size = 24,
  color = COLORS.PRIMARY_TEXT,
}) => (
  <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M13.637 1.198a1 1 0 0 1 .134 1.408l-8.04 9.73-.003.002a1.922 1.922 0 0 1-2.999-.055l-.001-.002L.21 9.045a1 1 0 1 1 1.578-1.228l2.464 3.167 7.976-9.652a1 1 0 0 1 1.408-.134Z"
      clipRule="evenodd"
    />
  </Svg>
);

export const AddIcon: React.FC<IconProps> = ({
  size = 24,
  color = COLORS.PRIMARY_TEXT,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M13.7143 1.71429C13.7143 0.767511 12.9468 0 12 0C11.0532 0 10.2857 0.767511 10.2857 1.71429V10.2857H1.71429C0.767511 10.2857 0 11.0532 0 12C0 12.9468 0.767511 13.7143 1.71429 13.7143H10.2857V22.2857C10.2857 23.2325 11.0532 24 12 24C12.9468 24 13.7143 23.2325 13.7143 22.2857V13.7143H22.2857C23.2325 13.7143 24 12.9468 24 12C24 11.0532 23.2325 10.2857 22.2857 10.2857H13.7143V1.71429Z"
      clipRule="evenodd"
    />
  </Svg>
);

export const MinusIcon: React.FC<IconProps> = ({
  size = 24,
  color = COLORS.PRIMARY_TEXT,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fill={color}
      d="M18 10.5H6C5.17157 10.5 4.5 11.1716 4.5 12C4.5 12.8284 5.17157 13.5 6 13.5H18C18.8284 13.5 19.5 12.8284 19.5 12C19.5 11.1716 18.8284 10.5 18 10.5Z"
    />
  </Svg>
);
