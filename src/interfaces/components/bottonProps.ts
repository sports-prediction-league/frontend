export interface IButtonProps {
  text: string;
  width?: string;
  height?: string;
  loading?: boolean;
  fontSize?: string;
  onClick?: () => void;
  disabled?: boolean;
  leftIcon?: string;
  rounded?: string;
  background?: string;
  hoverBackground?: string;
  textColor?: string;
  fontWeight?: string;
}
