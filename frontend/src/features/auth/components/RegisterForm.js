import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { register as postRegister } from '../reducers/registerSlce';

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '& > *': {
    margin: '8px',
    width: '25ch',
  },
});

const RegisterForm = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (formData) => {
    dispatch(postRegister(formData));
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Username"
        type="text"
        id="username"
        {...register('username', { required: true })}
        error={!!errors.username}
        helperText={errors.username ? 'This field is required' : ''}
      />

      <TextField
        label="Email"
        type="email"
        id="email"
        {...register('email', { required: true })}
        error={!!errors.email}
        helperText={errors.email ? 'This field is required' : ''}
      />

      <TextField
        label="Password"
        type="password"
        id="password1"
        {...register('password1', { required: true })}
        error={!!errors.password}
        helperText={errors.password ? 'This field is required' : ''}
      />


        <TextField
        label="Repeat password"
        type="password"
        id="password2"
        {...register('password2', { required: true })}
        error={!!errors.password}
        helperText={errors.password ? 'This field is required' : ''}
      />

      <Button
        variant="contained"
        color="primary"
        sx={{ margin: '16px 0' }}
        type="submit"
      >
        Register
      </Button>
    </Form>
  );
};

export default RegisterForm;