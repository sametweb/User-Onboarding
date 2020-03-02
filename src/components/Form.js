import React, { useState, useEffect } from "react";
import { withFormik, Form as MyForm, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Form = ({ values, errors, touched, status }) => {
  const [users, setUsers] = useState([]);

  console.log({ values });
  console.log({ touched });
  console.log({ errors });
  console.log({ status });
  console.log({ users });

  useEffect(() => {
    if (status) {
      const { name, email, password } = status;
      const newUser = { name, email, password };
      setUsers([...users, newUser]);
    }
  }, [status]);

  return (
    <div className="column" style={{ maxWidth: "450px", margin: "0 auto" }}>
      <h2 className="ui header">
        <i aria-hidden="true" className="vcard icon"></i>
        <div className="content">
          USER ONBOARDING
          <div className="sub header">This is the place to get onboard!</div>
        </div>
      </h2>
      <MyForm className="ui large form">
        <div className="ui stacked segment">
          <div className={`${touched.name && errors.name && `error`} field`}>
            <div
              className={`ui fluid ${touched.name &&
                errors.name &&
                `error`} input`}
            >
              <Field type="text" name="name" placeholder="enter your name" />
            </div>
            {touched.name && errors.name && (
              <p style={{ color: "#9f3a38" }}>{errors.name}</p>
            )}
          </div>
          <div className={`${touched.email && errors.email && `error`} field`}>
            <div
              className={`ui fluid ${touched.email &&
                errors.email &&
                `error`} input`}
            >
              <Field
                type="email"
                name="email"
                placeholder="enter your email address"
              />
            </div>
            {touched.email && errors.email && (
              <p style={{ color: "#9f3a38" }}>{errors.email}</p>
            )}
          </div>
          <div
            className={`${touched.password &&
              errors.password &&
              `error`} field`}
          >
            <div
              className={`ui fluid ${touched.password &&
                errors.password &&
                `error`} input`}
            >
              <Field
                type="password"
                name="password"
                placeholder="enter your password"
              />
            </div>
            {touched.password && errors.password && (
              <p style={{ color: "#9f3a38" }}>{errors.password}</p>
            )}
          </div>
          <div
            className={`${touched.confirmPassword &&
              errors.confirmPassword &&
              `error`} field`}
          >
            <div
              className={`ui fluid ${touched.confirmPassword &&
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
              <p style={{ color: "#9f3a38" }}>{errors.confirmPassword}</p>
            )}
          </div>
          <div className="field">
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
          </div>
          {touched.acceptTerms && errors.acceptTerms && (
            <p style={{ color: "#9f3a38" }}>{errors.acceptTerms}</p>
          )}
          <button type="submit" className="ui teal large fluid button">
            Get Onboard!
          </button>
        </div>
      </MyForm>
      <div
        className="column"
        style={{ maxWidth: "450px", margin: "0 auto", marginTop: 30 }}
      >
        <h2 className="ui header">
          <i aria-hidden="true" className="users icon"></i>
          <div className="content">BOARDED USERS</div>
        </h2>
        <div role="list" className="ui divided left aligned list">
          {users &&
            users.map((user, index) => {
              return (
                <div role="listitem" className="item" key={index}>
                  <i aria-hidden="true" className="user circle big icon"></i>
                  <div className="content">
                    <div className="header">{user.name}</div>
                    {user.email}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
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
  handleSubmit(values, { setStatus, resetForm }) {
    axios
      .post("https://reqres.in/api/users/", values)
      .then(res => {
        setStatus(res.data);
        resetForm();
      })
      .catch(err => console.log(err));
  }
})(Form);

export default FormWithFormik;
