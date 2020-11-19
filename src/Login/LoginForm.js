import React, { useState, useEffect } from 'react';
// import './LoginForm.css';
import schema from './loginSchema'
import * as yup from 'yup'
import { Route, Switch } from 'react-router-dom'
import axios from 'axios'
import { useHistory } from "react-router-dom";

const initialFormValues = {
  username: '',
  password: ''
}
const initialFormErrors = {
  username: '',
  password: ''
}
const initialUsers = []
const initialDisabled = true

const LoginForm = () => {

  const [users, setUsers] = useState(initialUsers)
  const [formValues, setFormValues] = useState(initialFormValues)
  const [formErrors, setFormErrors] = useState(initialFormErrors)
  const [disabled, setDisabled] = useState(initialDisabled)

  const postNewUsers = newUser => {
    axios.post('https://secret-family-recipes-6.herokuapp.com/auth/login', newUser)
      .then(response => {
        setUsers([...users, response.data])
        localStorage.setItem("token", response.data.token);
        console.log(response.data)
        window.location.assign('/recipes');
      })
      .catch((error) => {
        // debugger
        console.log(error);
      })
      .finally(() => {
        setFormValues(initialFormValues);
      });
  };
  const validate = (name, value) => {
    //yup validation schema
    yup
      .reach(schema, name)
      .validate(value)
      .then((valid) => {
        setFormErrors({
          ...formErrors,
          [name]: "",
        });
      })
      .catch((error) => {
        setFormErrors({
          ...formErrors,
          [name]: error.errors[0],
        });
      });
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    change(name, value);
  };

  const change = (name, value) => {
    validate(name, value);
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const onSubmit = event => {
    event.preventDefault()
    submit()
    // change route to home page, dashboard
  }

  const submit = () => {
    const newUser = {
      username: formValues.username.trim(),
      password: formValues.password.trim()
    }
    postNewUsers(newUser)
  }

  useEffect(() => {
    console.log(formValues);
  }, [formValues]);

  useEffect(() => {
    schema.isValid(formValues).then((valid) => {
      setDisabled(!valid);
    });
  }, [formValues]);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h1>Login</h1>

        <div>
          <div>{formErrors.username}</div>
          <div>{formErrors.password}</div>
        </div>

        <label>Username:     </label>
        <input
          value={formValues.username}
          onChange={onChange}
          name='username'
          type='username'
        />

        <label>Password:     </label>
        <input
          value={formValues.password}
          onChange={onChange}
          name='password'
          type='password'
        />

        <button disabled={disabled} id='submitBtn'>Submit</button>
      </form>
      {/* new users click here, or something else, need to sign up? */}
    </div>
  );
};

export default LoginForm;

