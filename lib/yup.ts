import * as yup from "yup";

yup.setLocale({
  mixed: {
    required: "This field is required",
  },
  string: {
    email: "Invalid email",
  },
});

export default yup;
