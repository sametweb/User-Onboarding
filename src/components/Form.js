import React from "react";
import { withFormik, Form as MyForm, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Form = ({ values, errors, touched, status }) => {
  console.log({ values });
  console.log({ touched });
  console.log({ errors });
  console.log({ status });
  return (
    <MyForm style={{ display: "flex", flexDirection: "column" }}>
      <div className={`ui ${touched.name && errors.name && `error`} input`}>
        <Field type="text" name="name" placeholder="enter your name" />
      </div>
      {touched.name && errors.name && <p>{errors.name}</p>}
      <div className={`ui ${touched.email && errors.email && `error`} input`}>
        <Field
          type="email"
          name="email"
          placeholder="enter your email address"
        />
      </div>
      {touched.email && errors.email && <p>{errors.email}</p>}
      <div
        className={`ui ${touched.password && errors.password && `error`} input`}
      >
        <Field
          type="password"
          name="password"
          placeholder="enter your password"
        />
      </div>
      {touched.password && errors.password && <p>{errors.password}</p>}

      <div
        className={`ui ${touched.confirmPassword &&
          errors.confirmPassword &&
          `error`} input`}
      >
        <Field
          type="password"
          name="confirmPassword"
          placeholder="confirm your password"
        />
      </div>
      {touched.confirmPassword && errors.confirmPassword && (
        <p>{errors.confirmPassword}</p>
      )}

      <div className="ui checkbox">
        <Field
          id="acceptTerms"
          className="hidden"
          type="checkbox"
          name="acceptTerms"
          checked={values.acceptTerms}
        />
        <label htmlFor="acceptTerms">
          Please accept the terms and conditions
        </label>
      </div>
      {touched.acceptTerms && errors.acceptTerms && <p>{errors.acceptTerms}</p>}

      <button type="submit" className="ui primary button">
        Add New User
      </button>
    </MyForm>
  );
};

const FormWithFormik = withFormik({
  mapPropsToValues(props) {
    return {
      name: props.name || "",
      email: props.email || "",
      password: props.password || "",
      confirmPassword: props.confirmPassword || "",
      acceptTerms: props.acceptTerms || false
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("You must enter a valid email address")
      .required("Email address is required"),
    password: Yup.string().required("You must enter a valid password"),
    confirmPassword: Yup.string().test(
      "passwords-match",
      "Passwords must match",
      function(value) {
        return this.parent.password === value;
      }
    ),
    acceptTerms: Yup.boolean()
      .required(
        "You need to carefully read and accept the terms and conditions"
      )
      .test(
        "is-true",
        "Must agree to terms to continue",
        value => value === true
      )
  }),
  handleSubmit(values, { setStatus }) {
    axios
      .post("https://reqres.in/api/users/", values)
      .then(res => setStatus(res.data))
      .catch(err => console.log(err));
  }
})(Form);

export default FormWithFormik;
