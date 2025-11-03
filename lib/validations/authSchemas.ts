import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email обов'язковий")
    .email("Невірний формат email")
    .trim(),
  password: yup
    .string()
    .required("Пароль обов'язковий")
    .min(6, "Пароль має бути мінімум 6 символів"),
});

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required("Ім'я обов'язкове")
    .min(2, "Ім'я має бути мінімум 2 символи")
    .max(50, "Ім'я має бути максимум 50 символів")
    .trim(),
  email: yup
    .string()
    .required("Email обов'язковий")
    .email("Невірний формат email")
    .trim(),
  password: yup
    .string()
    .required("Пароль обов'язковий")
    .min(6, "Пароль має бути мінімум 6 символів")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Пароль має містити велику літеру, малу літеру та цифру"
    ),
  confirmPassword: yup
    .string()
    .required("Підтвердіть пароль")
    .oneOf([yup.ref("password")], "Паролі не співпадають"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;

