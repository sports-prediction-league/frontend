declare interface ICredential {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  verified: boolean;
  level: number;
  profile_picture: string | null;
  nationality: string | null;
  telegram_user_name: string | null;
  x_profile_link: string | null;
  wallet: string | null;
  email: string;
  accessToken?: string;
}

declare interface IAppState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  result: IAuthResponse | null;
}

declare interface IAuthState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  result: IAuthResponse | null;
  verificationStatus: "idle" | "loading" | "succeeded" | "failed";
  redirectionPath: string;
}

declare interface IAuthResponse {
  success: boolean;
  message: string;
  data: any;
}

declare interface IDataResponse {
  success: boolean;
  message: string;
  data: any;
}

declare interface IFormInput {
  id: number;
  label: string;
  name: string;
  type: string;
  icon?: React.ElementType;
  placeholder: string;
  single: boolean;
  group?: string;
}

declare interface IRegisterData {
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  confirmPassword: string;
}

declare interface ILoginData {
  email: string;
  password: string;
}
